// utils/validate.js

// Email format validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// MongoDB ObjectId validation
export const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Product fields
export const validateProductFields = (product) => {
  const required = ['name', 'price', 'description', 'category'];
  const missing = required.filter((field) => !product[field]);
  if (missing.length > 0) {
    return { valid: false, message: `Missing fields: ${missing.join(', ')}` };
  }
  return { valid: true };
};

// User fields
export const validateUserFields = (user) => {
  const required = ['name', 'email', 'password'];
  const missing = required.filter((field) => !user[field]);
  if (missing.length > 0) {
    return { valid: false, message: `Missing fields: ${missing.join(', ')}` };
  }
  if (!isValidEmail(user.email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
};

// Review fields
export const validateReviewFields = (review) => {
  const required = ['productId', 'rating', 'comment'];
  const missing = required.filter((field) => !review[field]);
  if (missing.length > 0) {
    return { valid: false, message: `Missing fields: ${missing.join(', ')}` };
  }
  if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
    return { valid: false, message: 'Rating must be a number between 1 and 5' };
  }
  return { valid: true };
};

// Cart item fields
export const validateCartItemFields = (item) => {
  const required = ['productId', 'quantity'];
  const missing = required.filter((field) => !item[field]);
  if (missing.length > 0) {
    return { valid: false, message: `Missing fields: ${missing.join(', ')}` };
  }
  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    return { valid: false, message: 'Quantity must be a positive number' };
  }
  return { valid: true };
};

// Wishlist item fields
export const validateWishlistItemFields = (item) => {
  if (!item.productId) {
    return { valid: false, message: 'Missing productId' };
  }
  if (!isValidObjectId(item.productId)) {
    return { valid: false, message: 'Invalid productId format' };
  }
  return { valid: true };
};

// Extract and validate query id
export const getQueryId = (req) => {
  const { id } = req.query;
  if (!id) {
    return { valid: false, message: 'Missing query parameter: id' };
  }
  if (!isValidObjectId(id)) {
    return { valid: false, message: 'Invalid ID format' };
  }
  return { valid: true, id };
};
