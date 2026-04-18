/**
 * upload-and-merge-products.mjs
 *
 * 1. Match images in products-images/ to new products in adit_new-products-no-images.xlsx
 * 2. Upload matched images to Cloudinary
 * 3. Merge those products (with image URLs) into adit_products_updated-with-images.xlsx
 * 4. Remove matched products from adit_new-products-no-images.xlsx (leaving only truly image-less ones)
 */

import { v2 as cloudinary } from './backend/node_modules/cloudinary/cloudinary.js';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { extname, basename, join } from 'path';

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: 'dcywqtljq',
  api_key:    '655339527751366',
  api_secret: 'KxxB1oIbs9ZWKof6fn_Gcizr8M0',
});

// ── Minimal xlsx reader (ZIP + XML, no deps) ───────────────────────────────
import { inflateRawSync, deflateRawSync } from 'zlib';
import { createWriteStream } from 'fs';

function readZip(buf) {
  const EOCD = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65558); i--)
    if (buf.readUInt32LE(i) === EOCD) { eocd = i; break; }
  if (eocd === -1) throw new Error('Not a valid xlsx (no EOCD)');
  const n   = buf.readUInt16LE(eocd + 10);
  const cdO = buf.readUInt32LE(eocd + 16);
  const files = {};
  let pos = cdO;
  for (let i = 0; i < n; i++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const comp   = buf.readUInt16LE(pos + 10);
    const csz    = buf.readUInt32LE(pos + 20);
    const fnLen  = buf.readUInt16LE(pos + 28);
    const exLen  = buf.readUInt16LE(pos + 30);
    const cmtLen = buf.readUInt16LE(pos + 32);
    const lhO    = buf.readUInt32LE(pos + 42);
    const name   = buf.toString('utf8', pos + 46, pos + 46 + fnLen);
    pos += 46 + fnLen + exLen + cmtLen;
    if (buf.readUInt32LE(lhO) !== 0x04034b50) continue;
    const lhFn  = buf.readUInt16LE(lhO + 26);
    const lhEx  = buf.readUInt16LE(lhO + 28);
    const data  = lhO + 30 + lhFn + lhEx;
    const slice = buf.slice(data, data + csz);
    files[name] = comp === 8 ? inflateRawSync(slice) : slice;
  }
  return files;
}

function decodeXml(s) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'"').replace(/&apos;/g,"'")
          .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n));
}
function parseSharedStrings(xml) {
  const out = [];
  for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g))
    out.push([...m[1].matchAll(/<t(?:\s[^>]*)?>([^<]*)<\/t>/g)].map(t=>decodeXml(t[1])).join(''));
  return out;
}
function colIdx(col) { let n=0; for(const c of col) n=n*26+(c.charCodeAt(0)-64); return n-1; }
function parseSheet(xml, ss) {
  const rows = [];
  for (const rm of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const cm of rm[1].matchAll(/<c r="([A-Z]+)\d+"(?:[^>]*?t="([^"]*)")?[^>]*>([\s\S]*?)<\/c>/g)) {
      const ci = colIdx(cm[1]);
      let val  = '';
      const v  = cm[3].match(/<v>([^<]*)<\/v>/);
      if (v) val = cm[2]==='s' ? (ss[+v[1]]??'') : v[1].trim();
      else { const t = cm[3].match(/<t[^>]*>([^<]*)<\/t>/); if(t) val=decodeXml(t[1]); }
      while(cells.length<=ci) cells.push('');
      cells[ci]=val;
    }
    if (cells.some(c=>c!=='')) rows.push(cells);
  }
  return rows;
}
function parseXlsx(path) {
  const files = readZip(readFileSync(path));
  const ssKey = Object.keys(files).find(k=>k==='xl/sharedStrings.xml');
  const ss    = ssKey ? parseSharedStrings(files[ssKey].toString('utf8')) : [];
  const shKey = Object.keys(files).find(k=>/xl\/worksheets\/sheet1\.xml/.test(k));
  if (!shKey) throw new Error('No sheet1 in '+path);
  return parseSheet(files[shKey].toString('utf8'), ss);
}

// ── Minimal xlsx writer ────────────────────────────────────────────────────
function escXml(s) {
  return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                      .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function writeXlsx(path, rows) {
  // Build shared strings
  const ssMap = new Map(); const ssArr = [];
  function si(v) {
    const k = String(v??'');
    if (!ssMap.has(k)) { ssMap.set(k, ssArr.length); ssArr.push(k); }
    return ssMap.get(k);
  }

  const sheetRows = rows.map((row, ri) => {
    const cells = row.map((val, ci) => {
      const col = String.fromCharCode(65 + ci);
      const ref = `${col}${ri+1}`;
      if (val === null || val === undefined || val === '') return `<c r="${ref}"/>`;
      const num = typeof val === 'number' || (!isNaN(Number(val)) && String(val).trim() !== '');
      if (num) return `<c r="${ref}"><v>${escXml(val)}</v></c>`;
      return `<c r="${ref}" t="s"><v>${si(val)}</v></c>`;
    }).join('');
    return `<row r="${ri+1}">${cells}</row>`;
  }).join('');

  const sharedStrXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${ssArr.length}" uniqueCount="${ssArr.length}">${ssArr.map(s=>`<si><t>${escXml(s)}</t></si>`).join('')}</sst>`;
  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;
  const wbXml    = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const relsXml  = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>`;
  const ctXml    = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;

  function entry(name, data) {
    const buf = typeof data === 'string' ? Buffer.from(data,'utf8') : data;
    const comp = deflateRawSync(buf);
    const fn   = Buffer.from(name,'utf8');
    const crc  = crc32(buf);
    const lh   = Buffer.alloc(30+fn.length);
    lh.writeUInt32LE(0x04034b50,0); lh.writeUInt16LE(20,4); lh.writeUInt16LE(8,6);
    lh.writeUInt32LE(0,8); lh.writeUInt32LE(crc,14);
    lh.writeUInt32LE(comp.length,18); lh.writeUInt32LE(buf.length,22);
    lh.writeUInt16LE(fn.length,26); lh.writeUInt16LE(0,28); fn.copy(lh,30);
    return { name, lh, data: comp, uncompLen: buf.length, crc };
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (const b of buf) {
      crc ^= b;
      for (let k=0;k<8;k++) crc = (crc>>>1)^(crc&1?0xedb88320:0);
    }
    return (crc^0xffffffff)>>>0;
  }

  const entries = [
    entry('[Content_Types].xml', ctXml),
    entry('xl/_rels/workbook.xml.rels', relsXml),
    entry('xl/workbook.xml', wbXml),
    entry('xl/sharedStrings.xml', sharedStrXml),
    entry('xl/worksheets/sheet1.xml', sheetXml),
  ];

  const parts = [];
  const cdParts = [];
  let offset = 0;
  for (const e of entries) {
    parts.push(e.lh, e.data);
    const fn  = Buffer.from(e.name,'utf8');
    const cd  = Buffer.alloc(46+fn.length);
    cd.writeUInt32LE(0x02014b50,0); cd.writeUInt16LE(20,4); cd.writeUInt16LE(20,6);
    cd.writeUInt16LE(8,10); cd.writeUInt32LE(0,12); cd.writeUInt32LE(e.crc,16);
    cd.writeUInt32LE(e.data.length,20); cd.writeUInt32LE(e.uncompLen,24);
    cd.writeUInt16LE(fn.length,28); cd.writeUInt16LE(0,30); cd.writeUInt16LE(0,32);
    cd.writeUInt16LE(0,34); cd.writeUInt16LE(0,36); cd.writeUInt32LE(0,38);
    cd.writeUInt32LE(offset,42); fn.copy(cd,46);
    cdParts.push(cd);
    offset += e.lh.length + e.data.length;
  }
  const cd     = Buffer.concat(cdParts);
  const eocd   = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50,0); eocd.writeUInt16LE(0,4); eocd.writeUInt16LE(0,6);
  eocd.writeUInt16LE(entries.length,8); eocd.writeUInt16LE(entries.length,10);
  eocd.writeUInt32LE(cd.length,12); eocd.writeUInt32LE(offset,16); eocd.writeUInt16LE(0,20);
  writeFileSync(path, Buffer.concat([...parts, cd, eocd]));
}

// ── Main ───────────────────────────────────────────────────────────────────
const IMG_DIR      = './products-images';
const NO_IMG_FILE  = './Exported products/adit_new-products-no-images.xlsx';
const WITH_IMG_FILE= './Exported products/adit_products_updated-with-images.xlsx';

// 1. Load new products (no-images file)
const noImgRows  = parseXlsx(NO_IMG_FILE);
const noImgHdrs  = noImgRows[0];
const noImgData  = noImgRows.slice(1);
// Map: UPPER_NAME -> row array
const noImgMap   = new Map();
for (const row of noImgData) {
  const name = row[0]?.trim();
  if (name) noImgMap.set(name.toUpperCase(), row);
}

// 2. Load with-images file
const withImgRows = parseXlsx(WITH_IMG_FILE);
const withImgHdrs = withImgRows[0];
const withImgData = withImgRows.slice(1);

// 3. Find image matches
const imgFiles = readdirSync(IMG_DIR);
function imgToName(fn) {
  return basename(fn, extname(fn)).replace(/_/g,' ').trim().toUpperCase();
}

const matched = [];
for (const fn of imgFiles) {
  const norm = imgToName(fn);
  if (noImgMap.has(norm)) {
    matched.push({ file: join(IMG_DIR, fn), norm, row: noImgMap.get(norm) });
  }
}

const CACHE_FILE = './upload-cache.json';
const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE,'utf8')) : {};

console.log(`\nFound ${matched.length} images. ${Object.keys(cache).length} already cached.\n`);

// 4. Upload each to Cloudinary, collect results
const uploadedNames = new Set();
const newWithImgRows = [];

for (const { file, norm, row } of matched) {
  let url;
  if (cache[norm]) {
    url = cache[norm];
    console.log(`  CACHED: ${norm} → ${url}`);
  } else {
    process.stdout.write(`  Uploading: ${norm} ... `);
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'Adit-products',
        resource_type: 'image',
      });
      url = result.secure_url;
      cache[norm] = url;
      writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      console.log(`OK → ${url}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      continue;
    }
  }

    // Build a row in the same format as with-images headers:
    // Name, Category, Price (KES), Original Price (KES), Discount %, Stock,
    // Description, Featured, Approved, Rating, Reviews, Image 1, Image 2, Image 3
    const newRow = [
      row[0],   // Name
      row[1],   // Category
      row[2],   // Price (KES)
      row[3],   // Original Price (KES)
      row[4],   // Discount %
      row[5],   // Stock
      row[6],   // Description
      row[7],   // Featured
      row[8],   // Approved
      row[9],   // Rating
      row[10],  // Reviews
      url,      // Image 1
      '',       // Image 2
      '',       // Image 3
    ];
    newWithImgRows.push(newRow);
    uploadedNames.add(norm);
}

// 5. Merge uploaded products into with-images file
const mergedWithImg = [withImgHdrs, ...withImgData, ...newWithImgRows];
writeXlsx(WITH_IMG_FILE, mergedWithImg);
console.log(`\n✅ Merged ${newWithImgRows.length} products into ${WITH_IMG_FILE}`);

// 6. Remove uploaded products from no-images file (keep only those still without images)
const remaining = noImgData.filter(row => {
  const name = row[0]?.trim()?.toUpperCase();
  return name && !uploadedNames.has(name);
});
const updatedNoImg = [noImgHdrs, ...remaining];
writeXlsx(NO_IMG_FILE, updatedNoImg);
console.log(`✅ Updated ${NO_IMG_FILE} — ${remaining.length} products still without images`);

console.log('\nDone.');
