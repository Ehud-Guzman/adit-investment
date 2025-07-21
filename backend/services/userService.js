// services/userService.js
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidId = (id) => ObjectId.isValid(id);

export const checkUserExists = async (users, email, excludeId = null) => {
  const query = { email };
  if (excludeId) query._id = { $ne: new ObjectId(excludeId) };
  return await users.findOne(query);
};

export const createUser = async (users, { name, email, password, isAdmin }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await users.insertOne({
    name,
    email,
    password: hashedPassword,
    isAdmin,
    role: "user",
    status: "active",
    createdAt: new Date(),
    isVerified: false,
    emailVerifiedAt: null,
  });
  return await users.findOne({ _id: result.insertedId }, { projection: { password: 0 } });
};

export const getUsersPaginated = async (users, { search, role, status, page, limit }) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const query = {};
  if (search.trim()) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  if (role !== "all") query.role = role;
  if (status !== "all") query.status = status;

  const projection = { password: 0 };

  const [usersList, total] = await Promise.all([
    users.find(query, { projection }).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit).toArray(),
    users.countDocuments(query),
  ]);

  return {
    users: usersList,
    total,
    page: parsedPage,
    pages: Math.ceil(total / parsedLimit),
  };
};

export const findUserById = async (users, id) => {
  return await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
};

export const updateUser = async (users, id, data) => {
  const update = { ...data };
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  await users.updateOne({ _id: new ObjectId(id) }, { $set: update });
  return await findUserById(users, id);
};

export const deleteUser = async (users, id) => {
  return await users.deleteOne({ _id: new ObjectId(id) });
};

export const toggleAdminStatus = async (users, id, current) => {
  const updated = !current;
  await users.updateOne({ _id: new ObjectId(id) }, { $set: { isAdmin: updated } });
  return await findUserById(users, id);
};

export const changeUserStatus = async (users, id, status) => {
  await users.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return await findUserById(users, id);
};
