import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      assistants: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          personality: string;
          language: string;
          tone: string;
          primary_color: string;
          secondary_color: string;
          logo: string | null;
          position: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          personality: string;
          language?: string;
          tone?: string;
          primary_color?: string;
          secondary_color?: string;
          logo?: string | null;
          position?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          personality?: string;
          language?: string;
          tone?: string;
          primary_color?: string;
          secondary_color?: string;
          logo?: string | null;
          position?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_base: {
        Row: {
          id: string;
          assistant_id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assistant_id: string;
          title: string;
          content: string;
          category: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assistant_id?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          assistant_id: string;
          started_at: string;
          ended_at: string | null;
          user_location: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assistant_id: string;
          started_at?: string;
          ended_at?: string | null;
          user_location?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assistant_id?: string;
          started_at?: string;
          ended_at?: string | null;
          user_location?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          audio_url: string | null;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          audio_url?: string | null;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          audio_url?: string | null;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
};