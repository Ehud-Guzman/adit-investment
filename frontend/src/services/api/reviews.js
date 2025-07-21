import { api } from "./index";

export const getProductReviews = (productId) =>
  api.get(`/reviews/${productId}`).then((res) => res.data);

export const submitReview = (productId, review) =>
  api.post(`/reviews/${productId}`, review).then((res) => res.data);