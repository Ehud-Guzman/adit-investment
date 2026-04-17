// backend/utils/xlsxWriter.js
// Builds an xlsx Buffer from a 2D array — no external packages
// Uses zlib.deflateRawSync + hand-crafted ZIP + minimal xlsx XML

import { deflateRawSync } from 'zlib';

/* ── CRC32 ─────────────────────────────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xFF];
  return (c ^ 0xFFFFFFFF) >>> 0;
}

/* ── ZIP builder ─────────────────────────────────────────────────── */
function buildZip(entries) {
  const localParts = [];
  const cdMeta = [];
  let pos = 0;

  for (const { name, data } of entries) {
    const nameBuf   = Buffer.from(name, 'utf8');
    const comp      = deflateRawSync(data, { level: 6 });
    const checksum  = crc32(data);

    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);          // local file header sig
    lh.writeUInt16LE(20, 4);                   // version needed
    lh.writeUInt16LE(0, 6);                    // general purpose bit flag
    lh.writeUInt16LE(8, 8);                    // compression: DEFLATE
    lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0, 12); // mod time/date
    lh.writeUInt32LE(checksum, 14);
    lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);                   // extra field length
    nameBuf.copy(lh, 30);

    cdMeta.push({ nameBuf, checksum, comp, rawLen: data.length, offset: pos });
    localParts.push(lh, comp);
    pos += lh.length + comp.length;
  }

  /* Central directory */
  const cdStart = pos;
  const cdParts = [];
  for (const e of cdMeta) {
    const cd = Buffer.alloc(46 + e.nameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0);           // central dir sig
    cd.writeUInt16LE(20, 4);                    // version made by
    cd.writeUInt16LE(20, 6);                    // version needed
    cd.writeUInt16LE(0, 8);                     // bit flag
    cd.writeUInt16LE(8, 10);                    // DEFLATE
    cd.writeUInt16LE(0, 12); cd.writeUInt16LE(0, 14); // mod time/date
    cd.writeUInt32LE(e.checksum, 16);
    cd.writeUInt32LE(e.comp.length, 20);
    cd.writeUInt32LE(e.rawLen, 24);
    cd.writeUInt16LE(e.nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);                    // extra field length
    cd.writeUInt16LE(0, 32);                    // comment length
    cd.writeUInt16LE(0, 34);                    // disk number start
    cd.writeUInt16LE(0, 36);                    // internal attr
    cd.writeUInt32LE(0, 38);                    // external attr
    cd.writeUInt32LE(e.offset, 42);
    e.nameBuf.copy(cd, 46);
    cdParts.push(cd);
    pos += cd.length;
  }

  /* End of central directory */
  const cdSize = pos - cdStart;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdStart, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...cdParts, eocd]);
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function xmlEsc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colLetter(n) {          // 0-based → 'A', 'B', ..., 'AA', ...
  let s = '';
  n++;
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/* ── Sheet XML ───────────────────────────────────────────────────── */
function buildSheetXml(rows) {
  const rowsXml = rows.map((row, ri) => {
    const cells = row.map((val, ci) => {
      const ref = `${colLetter(ci)}${ri + 1}`;
      const str = String(val ?? '');
      if (str !== '' && !isNaN(Number(str)) && !/^0\d/.test(str)) {
        return `<c r="${ref}"><v>${str}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"><is><t>${xmlEsc(str)}</t></is></c>`;
    }).join('');
    return `<row r="${ri + 1}">${cells}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\
<sheetData>${rowsXml}</sheetData></worksheet>`;
}

/* ── Boilerplate XML files ───────────────────────────────────────── */
const CT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

const WB = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Products" sheetId="1" r:id="rId1"/></sheets></workbook>`;

const WB_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts><font><sz val="11"/><name val="Calibri"/></font></fonts><fills><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>`;

/* ── Public API ──────────────────────────────────────────────────── */
/**
 * Build an xlsx file Buffer from a 2D array of values.
 * @param {Array<Array<any>>} rows  First row should be headers.
 * @returns {Buffer}
 */
export function buildXlsx(rows) {
  return buildZip([
    { name: '[Content_Types].xml',        data: Buffer.from(CT,       'utf8') },
    { name: '_rels/.rels',                data: Buffer.from(RELS,     'utf8') },
    { name: 'xl/workbook.xml',            data: Buffer.from(WB,       'utf8') },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from(WB_RELS,  'utf8') },
    { name: 'xl/worksheets/sheet1.xml',   data: Buffer.from(buildSheetXml(rows), 'utf8') },
    { name: 'xl/styles.xml',              data: Buffer.from(STYLES,   'utf8') },
  ]);
}
