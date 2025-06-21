export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      background_presets: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      choices: {
        Row: {
          created_at: string
          id: string
          next_scene_id: string | null
          scene_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_scene_id?: string | null
          scene_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          next_scene_id?: string | null
          scene_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "choices_next_scene_id_fkey"
            columns: ["next_scene_id"]
            isOneToOne: false
            referencedRelation: "scenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "choices_scene_id_fkey"
            columns: ["scene_id"]
            isOneToOne: false
            referencedRelation: "scenes"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          artist_id: string
          budget_max: number | null
          budget_min: number | null
          client_id: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          artist_id: string
          budget_max?: number | null
          budget_min?: number | null
          client_id: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          artist_id?: string
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_media: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_size: number | null
          file_url: string
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          license_type: string | null
          media_type: string
          mime_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          media_type: string
          mime_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          media_type?: string
          mime_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          created_at: string
          id: string
          media_id: string
          order_index: number | null
          portfolio_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          order_index?: number | null
          portfolio_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          order_index?: number | null
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "creator_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_items_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          portfolio_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          portfolio_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          portfolio_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bio_long: string | null
          commission_status: string | null
          created_at: string
          creator_type: string[] | null
          display_name: string | null
          hourly_rate: number | null
          id: string
          role: string | null
          updated_at: string
          username: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bio_long?: string | null
          commission_status?: string | null
          created_at?: string
          creator_type?: string[] | null
          display_name?: string | null
          hourly_rate?: number | null
          id: string
          role?: string | null
          updated_at?: string
          username: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bio_long?: string | null
          commission_status?: string | null
          created_at?: string
          creator_type?: string[] | null
          display_name?: string | null
          hourly_rate?: number | null
          id?: string
          role?: string | null
          updated_at?: string
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      saved_stories: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scenes: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_ending: boolean
          story_id: string
          title: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_ending?: boolean
          story_id: string
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_ending?: boolean
          story_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          author_id: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          start_scene_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          start_scene_id?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          start_scene_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_story_settings: {
        Row: {
          ambient_sound_id: string | null
          audio_enabled: boolean
          background_opacity: number
          created_at: string
          id: string
          sound_volume: number
          story_id: string
          updated_at: string
          user_id: string
          visual_background_id: string | null
          visual_enabled: boolean
        }
        Insert: {
          ambient_sound_id?: string | null
          audio_enabled?: boolean
          background_opacity?: number
          created_at?: string
          id?: string
          sound_volume?: number
          story_id: string
          updated_at?: string
          user_id: string
          visual_background_id?: string | null
          visual_enabled?: boolean
        }
        Update: {
          ambient_sound_id?: string | null
          audio_enabled?: boolean
          background_opacity?: number
          created_at?: string
          id?: string
          sound_volume?: number
          story_id?: string
          updated_at?: string
          user_id?: string
          visual_background_id?: string | null
          visual_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_story_settings_ambient_sound_id_fkey"
            columns: ["ambient_sound_id"]
            isOneToOne: false
            referencedRelation: "background_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_story_settings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_story_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_story_settings_visual_background_id_fkey"
            columns: ["visual_background_id"]
            isOneToOne: false
            referencedRelation: "background_presets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
