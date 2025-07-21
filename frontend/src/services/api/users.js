import { api } from "./index";

export const getAllUsers = (filters = {}) =>
  api.get("/admin/users", { params: filters }).then((res) => res.data);

export const deleteUser = (id) => api.delete(`/users/${id}`).then((res) => res.data);
export const updateUser = (id, userData) =>
  api.put(`/users/${id}`, userData).then((res) => res.data);
export const getUserById = (id) => api.get(`/users/${id}`).then((res) => res.data);

//services/api/users.js