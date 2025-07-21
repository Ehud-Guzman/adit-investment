import { ObjectId } from "mongodb";

export const createEmailTokenModel = (db) => {
  const emailTokens = db.collection("email_tokens");

  const createToken = async (userId, token, expiresAt) => {
    await emailTokens.insertOne({
      userId: new ObjectId(userId),
      token,
      expiresAt,
      createdAt: new Date(),
    });
  };

  const findToken = async (token) => {
    return await emailTokens.findOne({ token });
  };

  const deleteToken = async (token) => {
    await emailTokens.deleteOne({ token });
  };

  return {
    createToken,
    findToken,
    deleteToken,
  };
};
