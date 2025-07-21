// routes/settings.js
import express from "express";
import { verifyToken } from "../middleware/auth/index.js";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin.js";
import { createSettingsController } from "../controllers/createSettingsController.js";

/**
 * 🛠️ Settings Router Factory
 * @param {Collection} settingsCollection - MongoDB collection for settings
 */
const createSettingsRouter = (settingsCollection) => {
  if (!settingsCollection) {
    throw new Error("❌ Settings collection is not provided to the router.");
  }

  const router = express.Router();
  const {
    createSetting,
    getAllSettings,
    getSettingById,
    updateSetting,
    deleteSetting,
  } = createSettingsController(settingsCollection);

  // 🔐 All routes are Super Admin only
  router.use(verifyToken, verifySuperAdmin);

  // 🌱 Create a new setting
  router.post("/", createSetting);

  // 📥 Get all settings
  router.get("/", getAllSettings);

  // 🔍 Get a single setting by ID
  router.get("/:id", getSettingById);

  // ✏️ Update a setting by ID
  router.put("/:id", updateSetting);

  // 🗑️ Delete a setting by ID
  router.delete("/:id", deleteSetting);

  // ❌ Catch-all for unknown subroutes
  router.use((req, res) => {
    res.status(404).json({
      message: `❌ Invalid settings route: ${req.originalUrl}`,
    });
  });

  return router;
};

export default createSettingsRouter;
