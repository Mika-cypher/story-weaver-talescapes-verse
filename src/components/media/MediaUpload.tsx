
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mediaService } from '@/services/mediaService';
import { analyticsService } from '@/services/analyticsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface MediaUploadProps {
  onUploadComplete?: (media: any) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [licenseType, setLicenseType] = useState('all_rights_reserved');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getMediaType = (file: File): 'image' | 'audio' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileUrl = await mediaService.uploadFile(selectedFile, user.id);
      
      // Create media record
      const media = await mediaService.createMedia({
        user_id: user.id,
        title,
        description,
        media_type: getMediaType(selectedFile),
        file_url: fileUrl,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        tags: tags.length > 0 ? tags : undefined,
        category: category || undefined,
        is_public: isPublic,
        is_featured: false,
        license_type: licenseType
      });

      // Track upload event
      await analyticsService.trackEvent(media.id, 'media', 'view', user.id);

      toast({
        title: "Upload successful",
        description: "Your media has been uploaded successfully"
      });

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setTags([]);
      setTagInput('');
      
      onUploadComplete?.(media);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Upload Media</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*,audio/*,video/*,.pdf"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter media title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your media"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Digital Art, Podcast, Tutorial"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">License</label>
          <Select value={licenseType} onValueChange={setLicenseType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_rights_reserved">All Rights Reserved</SelectItem>
              <SelectItem value="creative_commons">Creative Commons</SelectItem>
              <SelectItem value="public_domain">Public Domain</SelectItem>
              <SelectItem value="commercial_use">Commercial Use</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is-public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="is-public" className="text-sm">
            Make this media public
          </label>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !title || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Media'}
        </Button>
      </div>
    </div>
  );
};
