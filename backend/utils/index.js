// utils/index.js

/**
 * Extracts an ID from different parts of a request-like object.
 * Works with req.query, req.params, or plain objects.
 */
export const getQueryId = (source = {}) => {
  return (
    source.id ||
    source._id ||
    source?.params?.id ||
    source?.query?.id ||
    source?.body?.id ||
    null
  );
};
