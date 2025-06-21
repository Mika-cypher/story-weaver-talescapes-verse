
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, userListService, commentService } from '@/services/discovery';
import type { Review, UserList, ContentComment } from '@/services/discovery';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useReviews = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: ['reviews', contentId, contentType],
    queryFn: () => reviewService.getReviews(contentId, contentType),
  });
};

export const useAverageRating = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: ['average-rating', contentId, contentType],
    queryFn: () => reviewService.getAverageRating(contentId, contentType),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.content_id, data.content_type] });
      queryClient.invalidateQueries({ queryKey: ['average-rating', data.content_id, data.content_type] });
      toast({
        title: "Review added",
        description: "Your review has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUserListStatus = (contentId: string, contentType: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-list-status', user?.id, contentId, contentType],
    queryFn: () => user ? userListService.getUserListStatus(user.id, contentId, contentType) : null,
    enabled: !!user,
  });
};

export const useAddToList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userListService.addToList,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-list-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-lists'] });
      toast({
        title: "Added to list",
        description: "Item has been added to your list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add to list. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, contentId, contentType }: { userId: string; contentId: string; contentType: string }) =>
      userListService.removeFromList(userId, contentId, contentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-list-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-lists'] });
      toast({
        title: "Removed from list",
        description: "Item has been removed from your list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from list. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useComments = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: ['comments', contentId, contentType],
    queryFn: () => commentService.getComments(contentId, contentType),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: commentService.createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.content_id, data.content_type] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });
};
