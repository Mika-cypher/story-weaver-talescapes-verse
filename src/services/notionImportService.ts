
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";

interface NotionStoryRow {
  Name: string;
  Author: string;
  Category: string;
  Created: string;
  Tags: string;
}

export const notionImportService = {
  // Parse CSV content into story objects
  parseNotionCSV: (csvContent: string): NotionStoryRow[] => {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as NotionStoryRow;
    });
  },

  // Transform Notion data to our Story format
  transformNotionData: async (notionRows: NotionStoryRow[]): Promise<Partial<Story>[]> => {
    const stories: Partial<Story>[] = [];
    
    for (const row of notionRows) {
      // Handle author - create profile if it doesn't exist
      let authorId = await notionImportService.getOrCreateAuthor(row.Author);
      
      const story: Partial<Story> = {
        id: crypto.randomUUID(),
        title: row.Name,
        description: `Category: ${row.Category}`, // Use category as description for now
        author: authorId,
        status: "published" as const,
        featured: false,
        createdAt: row.Created ? new Date(row.Created).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scenes: [] // Linear content, no interactive scenes
      };

      stories.push(story);
    }
    
    return stories;
  },

  // Get or create author profile
  getOrCreateAuthor: async (authorName: string): Promise<string> => {
    if (!authorName || authorName.trim() === '') {
      authorName = 'Unknown Author';
    }

    // First check if profile exists with this display name
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('display_name', authorName)
      .maybeSingle();

    if (existingProfile) {
      return existingProfile.id;
    }

    // Create new profile for this author
    const userId = crypto.randomUUID();
    const username = authorName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username,
        display_name: authorName,
        bio: `Author imported from Notion`
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating author profile:', error);
      // Return a default author ID if creation fails
      return 'default-author-id';
    }

    return newProfile.id;
  },

  // Import stories to Supabase
  importStories: async (stories: Partial<Story>[]): Promise<void> => {
    const session = await supabase.auth.getSession();
    
    for (const story of stories) {
      try {
        const { error } = await supabase
          .from('stories')
          .insert({
            id: story.id,
            title: story.title,
            description: story.description,
            author_id: story.author,
            status: story.status,
            featured: story.featured,
            created_at: story.createdAt,
            updated_at: story.updatedAt
          });

        if (error) {
          console.error('Error importing story:', story.title, error);
        } else {
          console.log('Successfully imported story:', story.title);
        }
      } catch (error) {
        console.error('Unexpected error importing story:', story.title, error);
      }
    }
  },

  // Main import function
  importFromNotionCSV: async (csvContent: string): Promise<{ success: boolean; message: string; count: number }> => {
    try {
      // Parse CSV
      const notionRows = notionImportService.parseNotionCSV(csvContent);
      console.log('Parsed Notion rows:', notionRows);

      if (notionRows.length === 0) {
        return { success: false, message: 'No data found in CSV', count: 0 };
      }

      // Transform to our format
      const stories = await notionImportService.transformNotionData(notionRows);
      console.log('Transformed stories:', stories);

      // Import to Supabase
      await notionImportService.importStories(stories);

      return { 
        success: true, 
        message: `Successfully imported ${stories.length} stories from Notion`, 
        count: stories.length 
      };
    } catch (error) {
      console.error('Import error:', error);
      return { 
        success: false, 
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        count: 0 
      };
    }
  }
};
