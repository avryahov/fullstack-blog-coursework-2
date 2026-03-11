export const publicOperations = new Set(['register', 'authorize', 'fetchPost', 'fetchPosts']);

export const isPublicOperation = operation => publicOperations.has(operation);
