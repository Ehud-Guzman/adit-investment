import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// 🔧 MongoDB connection URI
const uri = "mongodb+srv://adit:adit2025@hotelbooking.d9kury9.mongodb.net/ADIT-website?retryWrites=true&w=majority&appName=HotelBooking";
const dbName = "ADIT-website";
const collectionName = "products";

async function exportAllProductNames() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all products, only name field
    const cursor = collection.find({}, { projection: { name: 1, _id: 0 } });

    const namesSet = new Set(); // avoid duplicates
    await cursor.forEach(doc => {
      if (doc.name && doc.name.trim() !== "") {
        namesSet.add(doc.name.trim());
      }
    });

    const names = Array.from(namesSet).sort(); // optional: sort alphabetically

    // Save to CSV
    const filePath = path.join(process.cwd(), "product_names.csv");
    fs.writeFileSync(filePath, names.join("\n"), "utf8");

    console.log(`✅ Exported ${names.length} unique product names to ${filePath}`);
  } catch (err) {
    console.error("❌ Error exporting product names:", err);
  } finally {
    await client.close();
  }
}

exportAllProductNames();
