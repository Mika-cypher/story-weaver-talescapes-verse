
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface StoryFormData {
  title: string;
  description: string;
  coverImage: string;
  author: string;
}

interface StoryDetailsFormProps {
  form: UseFormReturn<StoryFormData>;
}

export const StoryDetailsForm = ({ form }: StoryDetailsFormProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Story Information</CardTitle>
      <CardDescription>
        Basic information about your interactive story
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter the story title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a short description of the story" 
                className="resize-none"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://example.com/image.jpg" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author</FormLabel>
            <FormControl>
              <Input placeholder="Author name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
