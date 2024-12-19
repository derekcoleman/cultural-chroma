import type { Recommendation } from '@/types/recommendations';

export type Tables = {
  favorite_artists: {
    Row: {
      artist_name: string
      created_at: string
      genres: string[]
      id: string
      user_id: string
    }
    Insert: {
      artist_name: string
      created_at?: string
      genres?: string[]
      id?: string
      user_id: string
    }
    Update: {
      artist_name?: string
      created_at?: string
      genres?: string[]
      id?: string
      user_id?: string
    }
    Relationships: [
      {
        foreignKeyName: "favorite_artists_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
  favorite_songs: {
    Row: {
      artist_name: string
      created_at: string
      id: string
      song_name: string
      user_id: string
    }
    Insert: {
      artist_name: string
      created_at?: string
      id?: string
      song_name: string
      user_id: string
    }
    Update: {
      artist_name?: string
      created_at?: string
      id?: string
      song_name?: string
      user_id?: string
    }
    Relationships: [
      {
        foreignKeyName: "favorite_songs_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
  profiles: {
    Row: {
      avatar_url: string | null
      bio: string | null
      created_at: string
      display_name: string | null
      id: string
      preferred_categories: string[] | null
      updated_at: string | null
    }
    Insert: {
      avatar_url?: string | null
      bio?: string | null
      created_at?: string
      display_name?: string | null
      id: string
      preferred_categories?: string[] | null
      updated_at?: string | null
    }
    Update: {
      avatar_url?: string | null
      bio?: string | null
      created_at?: string
      display_name?: string | null
      id?: string
      preferred_categories?: string[] | null
      updated_at?: string | null
    }
    Relationships: []
  }
  recommendation_feedback: {
    Row: {
      created_at: string | null
      id: string
      is_positive: boolean
      recommendation_title: string
      recommendation_type: string
      user_id: string | null
    }
    Insert: {
      created_at?: string | null
      id?: string
      is_positive: boolean
      recommendation_title: string
      recommendation_type: string
      user_id?: string | null
    }
    Update: {
      created_at?: string | null
      id?: string
      is_positive?: boolean
      recommendation_title?: string
      recommendation_type?: string
      user_id?: string | null
    }
    Relationships: [
      {
        foreignKeyName: "recommendation_feedback_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
  cached_recommendations: {
    Row: {
      id: string
      user_id: string
      recommendations: Recommendation[]
      created_at: string
    }
    Insert: {
      id?: string
      user_id: string
      recommendations: Recommendation[]
      created_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      recommendations?: Recommendation[]
      created_at?: string
    }
    Relationships: [
      {
        foreignKeyName: "cached_recommendations_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "profiles"
        referencedColumns: ["id"]
      }
    ]
  }
}