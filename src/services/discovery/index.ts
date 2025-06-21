
export * from './types';
export { reviewService } from './reviewService';
export { userListService } from './userListService';
export { commentService } from './commentService';

// Legacy export for backward compatibility
export const discoveryService = {
  ...reviewService,
  ...userListService,
  ...commentService
};
