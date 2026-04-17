// backend/deleteCloudinaryFolders.js
// Deletes ALL images in the adit-products (hyphen) and adit_products (underscore)
// Cloudinary folders, then removes the empty folders.
//
// ⚠️  IRREVERSIBLE — run only after confirming local images are downloaded.
// Run: node deleteCloudinaryFolders.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDERS = ["adit-products", "adit_products", "Adit-products"];

// Fetch all public_ids under a folder prefix (handles pagination)
async function fetchPublicIds(prefix) {
  const ids = [];
  let cursor = null;
  do {
    const opts = { type: "upload", prefix, max_results: 500 };
    if (cursor) opts.next_cursor = cursor;
    const res = await cloudinary.api.resources(opts);
    res.resources.forEach(r => ids.push(r.public_id));
    cursor = res.next_cursor || null;
  } while (cursor);
  return ids;
}

// Delete public_ids in batches of 100 (Cloudinary API limit per call)
async function deleteInBatches(ids) {
  let deleted = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    const res = await cloudinary.api.delete_resources(batch);
    deleted += Object.keys(res.deleted).length;
    process.stdout.write(`\r  Deleted ${deleted}/${ids.length} images...`);
  }
  if (ids.length > 0) console.log(); // newline after progress
  return deleted;
}

async function run() {
  console.log("🔍 Scanning Cloudinary folders...\n");

  // Collect unique public_ids across all folder name variants
  const seen = new Set();
  const allIds = [];

  for (const folder of FOLDERS) {
    const ids = await fetchPublicIds(folder);
    console.log(`  📁 ${folder}: ${ids.length} image(s)`);
    for (const id of ids) {
      if (!seen.has(id)) { seen.add(id); allIds.push(id); }
    }
  }

  console.log(`\n📦 Total unique images to delete: ${allIds.length}`);

  if (allIds.length === 0) {
    console.log("✅ Nothing to delete — folders are already empty.");
  } else {
    console.log("🗑️  Deleting images...");
    const deleted = await deleteInBatches(allIds);
    console.log(`✅ Deleted ${deleted} image(s).`);
  }

  // Delete the (now empty) folders
  console.log("\n🗂️  Removing empty folders...");
  for (const folder of FOLDERS) {
    try {
      await cloudinary.api.delete_folder(folder);
      console.log(`  ✅ Folder deleted: ${folder}`);
    } catch (err) {
      if (err?.error?.http_code === 404 || err?.message?.includes("not found") || err?.message?.includes("does not exist")) {
        console.log(`  ℹ️  Folder not found (already gone): ${folder}`);
      } else if (err?.message?.includes("not empty")) {
        console.log(`  ⚠️  Folder ${folder} still has resources — delete images first.`);
      } else {
        console.log(`  ⚠️  Could not delete folder ${folder}: ${err.message}`);
      }
    }
  }

  console.log("\n🎉 Done! Cloudinary is clean.");
}

run().catch(err => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
