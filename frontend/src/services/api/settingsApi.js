// services/api/settingsApi.js
import api from "./index"; // ✅ your Axios instance

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const createSetting = async (setting) => {
  const { data } = await api.post("/settings", setting);
  return data;
};

export const updateSetting = async (id, setting) => {
  const { data } = await api.put(`/settings/${id}`, setting);
  return data;
};

export const deleteSetting = async (id) => {
  const { data } = await api.delete(`/settings/${id}`);
  return data;
};
