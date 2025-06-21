
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Music, MessageSquare, Plus, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserListStatus, useAddToList, useRemoveFromList } from '@/hooks/useDiscovery';

interface AddToListButtonProps {
  contentId: string;
  contentType: 'story' | 'song' | 'dialect';
}

const AddToListButton: React.FC<AddToListButtonProps> = ({ contentId, contentType }) => {
  const { user } = useAuth();
  const { data: listStatus } = useUserListStatus(contentId, contentType);
  const addToList = useAddToList();
  const removeFromList = useRemoveFromList();

  if (!user) return null;

  const getListOptions = () => {
    if (contentType === 'story') {
      return [
        { value: 'want_to_read', label: 'Want to Read', icon: BookOpen },
        { value: 'currently_reading', label: 'Currently Reading', icon: BookOpen },
        { value: 'read', label: 'Read', icon: Check },
      ];
    } else if (contentType === 'song') {
      return [
        { value: 'want_to_listen', label: 'Want to Listen', icon: Music },
        { value: 'currently_listening', label: 'Currently Listening', icon: Music },
        { value: 'listened', label: 'Listened', icon: Check },
      ];
    } else {
      return [
        { value: 'want_to_read', label: 'Want to Learn', icon: MessageSquare },
        { value: 'currently_reading', label: 'Currently Learning', icon: MessageSquare },
        { value: 'read', label: 'Learned', icon: Check },
      ];
    }
  };

  const handleAddToList = (listType: string) => {
    if (listStatus && listStatus.list_type === listType) {
      // Remove from list if already in this list
      removeFromList.mutate({
        userId: user.id,
        contentId,
        contentType,
      });
    } else {
      // Add to list
      addToList.mutate({
        user_id: user.id,
        content_id: contentId,
        content_type: contentType,
        list_type: listType as any,
      });
    }
  };

  const currentListOption = listStatus ? getListOptions().find(opt => opt.value === listStatus.list_type) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={currentListOption ? "default" : "outline"} size="sm">
          {currentListOption ? (
            <>
              <currentListOption.icon className="h-4 w-4 mr-2" />
              {currentListOption.label}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to List
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {getListOptions().map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleAddToList(option.value)}
            className={listStatus?.list_type === option.value ? "bg-primary/10" : ""}
          >
            <option.icon className="h-4 w-4 mr-2" />
            {option.label}
            {listStatus?.list_type === option.value && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddToListButton;
