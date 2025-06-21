
import { reviewService } from './reviewService';
import { userListService } from './userListService';
import { commentService } from './commentService';

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
