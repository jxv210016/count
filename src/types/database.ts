export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          preferred_deck_count: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          preferred_deck_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          preferred_deck_count?: number
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          ended_at: string | null
          deck_count: number
          hands_played: number
          count_correct: number
          count_checks: number
          decisions_correct: number
          decisions_total: number
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          ended_at?: string | null
          deck_count: number
          hands_played?: number
          count_correct?: number
          count_checks?: number
          decisions_correct?: number
          decisions_total?: number
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          ended_at?: string | null
          deck_count?: number
          hands_played?: number
          count_correct?: number
          count_checks?: number
          decisions_correct?: number
          decisions_total?: number
        }
      }
      decisions: {
        Row: {
          id: string
          session_id: string
          user_id: string
          player_cards: string[]
          dealer_upcard: string
          player_decision: string
          correct_decision: string
          is_correct: boolean
          running_count: number
          true_count: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          player_cards: string[]
          dealer_upcard: string
          player_decision: string
          correct_decision: string
          is_correct: boolean
          running_count: number
          true_count: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          player_cards?: string[]
          dealer_upcard?: string
          player_decision?: string
          correct_decision?: string
          is_correct?: boolean
          running_count?: number
          true_count?: number
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Decision = Database['public']['Tables']['decisions']['Row']
