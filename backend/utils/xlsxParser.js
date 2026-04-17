// backend/utils/xlsxParser.js
// Pure Node.js xlsx parser — no external packages needed
// Reads .xlsx (ZIP+XML) using only zlib (built-in) + Buffer

import { inflateRawSync } from 'zlib';

/* ── ZIP reader ──────────────────────────────────────────────────── */
function readZip(buf) {
  const EOCD_SIG = 0x06054b50;
  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65558); i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocdOffset = i; break; }
  }
  if (eocdOffset === -1) throw new Error('Not a valid xlsx/zip file (no EOCD)');

  const numEntries = buf.readUInt16LE(eocdOffset + 10);
  const cdOffset   = buf.readUInt32LE(eocdOffset + 16);

  const files = {};
  let pos = cdOffset;

  for (let i = 0; i < numEntries; i++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;          // CD signature

    const compression = buf.readUInt16LE(pos + 10);
    const compSz      = buf.readUInt32LE(pos + 20);
    const fnLen       = buf.readUInt16LE(pos + 28);
    const extraLen    = buf.readUInt16LE(pos + 30);
    const commentLen  = buf.readUInt16LE(pos + 32);
    const lhOffset    = buf.readUInt32LE(pos + 42);

    const fileName = buf.toString('utf8', pos + 46, pos + 46 + fnLen);
    pos += 46 + fnLen + extraLen + commentLen;

    if (buf.readUInt32LE(lhOffset) !== 0x04034b50) continue;  // LFH signature
    const lhFnLen    = buf.readUInt16LE(lhOffset + 26);
    const lhExtraLen = buf.readUInt16LE(lhOffset + 28);
    const dataStart  = lhOffset + 30 + lhFnLen + lhExtraLen;

    const compressed = buf.slice(dataStart, dataStart + compSz);
    if (compression === 0)      files[fileName] = compressed;
    else if (compression === 8) files[fileName] = inflateRawSync(compressed);
    // other methods skipped
  }
  return files;
}

/* ── XML helpers ─────────────────────────────────────────────────── */
function decodeXml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseSharedStrings(xml) {
  const strings = [];
  for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    const parts = [...m[1].matchAll(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)].map(t => decodeXml(t[1]));
    strings.push(parts.join(''));
  }
  return strings;
}

function colLetterToIndex(col) {
  let n = 0;
  for (const c of col) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

function parseSheet(xml, sharedStrings) {
  const rows = [];
  for (const rowM of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    // Match each <c> cell: capture column letters, type attr, and inner content
    for (const cellM of rowM[1].matchAll(
      /<c r="([A-Z]+)\d+"(?:[^>]*?t="([^"]*)")?[^>]*>([\s\S]*?)<\/c>/g
    )) {
      const colIdx = colLetterToIndex(cellM[1]);
      const type   = cellM[2];   // 's' = shared string, else numeric/formula
      const inner  = cellM[3];

      let value = '';
      const vMatch = inner.match(/<v>([^<]*)<\/v>/);
      if (vMatch) {
        const raw = vMatch[1].trim();
        value = type === 's' ? (sharedStrings[parseInt(raw)] ?? '') : raw;
      } else {
        // Inline string <is><t>...</t></is>
        const tMatch = inner.match(/<t[^>]*>([^<]*)<\/t>/);
        if (tMatch) value = decodeXml(tMatch[1]);
      }

      while (cells.length <= colIdx) cells.push('');
      cells[colIdx] = value;
    }
    if (cells.some(c => c !== '')) rows.push(cells);
  }
  return rows;
}

/* ── Public API ──────────────────────────────────────────────────── */
/**
 * Parse an xlsx Buffer.
 * Returns an array of rows; each row is an array of string values.
 * First row is the header.
 */
export function parseXlsx(buffer) {
  const files = readZip(buffer);

  const ssKey = Object.keys(files).find(k => k === 'xl/sharedStrings.xml');
  const sharedStrings = ssKey ? parseSharedStrings(files[ssKey].toString('utf8')) : [];

  const sheetKey = Object.keys(files).find(k => /xl\/worksheets\/sheet1\.xml/.test(k));
  if (!sheetKey) throw new Error('No sheet1.xml found in xlsx');

  return parseSheet(files[sheetKey].toString('utf8'), sharedStrings);
}
