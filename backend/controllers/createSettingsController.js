import { ObjectId } from "mongodb";

// 🧪 ID Checker
const isValidId = (id) => ObjectId.isValid(id);

// 🏗 Controller Factory
export const createSettingsController = (settingsCollection) => ({
  // ✅ Create a new setting
  createSetting: async (req, res) => {
    try {
      const { key, value, description = "" } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({ message: "⚠️ 'key' and 'value' are required" });
      }

      const exists = await settingsCollection.findOne({ key });
      if (exists) {
        return res.status(409).json({ message: "⚠️ Setting with this key already exists" });
      }

      const newSetting = {
        key,
        value,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { insertedId } = await settingsCollection.insertOne(newSetting);

      res.status(201).json({
        message: "✅ Setting created successfully",
        setting: { _id: insertedId, ...newSetting },
      });
    } catch (err) {
      console.error("❌ createSetting error:", err);
      res.status(500).json({ message: "🚨 Internal error creating setting" });
    }
  },

  // 📥 Fetch all settings
  getAllSettings: async (_req, res) => {
    try {
      const settings = await settingsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json({ settings });
    } catch (err) {
      console.error("❌ getAllSettings error:", err);
      res.status(500).json({ message: "🚨 Failed to retrieve settings" });
    }
  },

  // 🔍 Get a single setting by ID
  getSettingById: async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "❌ Invalid setting ID format" });
    }

    try {
      const setting = await settingsCollection.findOne({ _id: new ObjectId(id) });

      if (!setting) {
        return res.status(404).json({ message: "⚠️ Setting not found" });
      }

      res.status(200).json({ setting });
    } catch (err) {
      console.error("❌ getSettingById error:", err);
      res.status(500).json({ message: "🚨 Failed to fetch setting" });
    }
  },

  // ✏️ Update an existing setting
  updateSetting: async (req, res) => {
    const { id } = req.params;
    const { value, description } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "❌ Invalid setting ID format" });
    }

    const updates = {
      updatedAt: new Date(),
    };

    if (value !== undefined) updates.value = value;
    if (description !== undefined) updates.description = description;

    try {
      const result = await settingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "⚠️ Setting not found" });
      }

      const updatedSetting = await settingsCollection.findOne({ _id: new ObjectId(id) });

      res.status(200).json({
        message: "✅ Setting updated successfully",
        setting: updatedSetting,
      });
    } catch (err) {
      console.error("❌ updateSetting error:", err);
      res.status(500).json({ message: "🚨 Failed to update setting" });
    }
  },

  // 🗑️ Delete a setting
  deleteSetting: async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "❌ Invalid setting ID format" });
    }

    try {
      const result = await settingsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "⚠️ Setting not found or already deleted" });
      }

      res.status(200).json({ message: "🗑️ Setting deleted successfully" });
    } catch (err) {
      console.error("❌ deleteSetting error:", err);
      res.status(500).json({ message: "🚨 Failed to delete setting" });
    }
  },
});
