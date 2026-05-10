export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type CommissionStatus = 'pending' | 'reviewing' | 'approved' | 'active' | 'delivered' | 'closed' | 'rejected'
export type ProjectStatus = 'in_progress' | 'review' | 'revision' | 'delivered' | 'complete'
export type UserRole = 'client' | 'admin'
export type DeliverableType = 'file' | 'link' | 'preview' | 'code'
export type CommissionTier = 'foundation' | 'presence' | 'architecture'

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          display_name?: string | null
          role?: UserRole
        }
      }
      commissions: {
        Row: {
          id: string
          client_id: string | null
          email: string | null
          community_name: string
          genre: string
          platform: string
          member_count: string | null
          tier: CommissionTier
          goals: string | null
          inspiration: string | null
          existing_assets: string | null
          timeline: string | null
          status: CommissionStatus
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          email?: string | null
          community_name: string
          genre: string
          platform: string
          member_count?: string | null
          tier: CommissionTier
          goals?: string | null
          inspiration?: string | null
          existing_assets?: string | null
          timeline?: string | null
          status?: CommissionStatus
        }
        Update: {
          status?: CommissionStatus
          admin_notes?: string | null
          tier?: CommissionTier
        }
      }
      projects: {
        Row: {
          id: string
          commission_id: string | null
          client_id: string | null
          title: string
          status: ProjectStatus
          notes: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          commission_id?: string | null
          client_id?: string | null
          title: string
          status?: ProjectStatus
          notes?: string | null
          due_date?: string | null
        }
        Update: {
          title?: string
          status?: ProjectStatus
          notes?: string | null
          due_date?: string | null
        }
      }
      deliverables: {
        Row: {
          id: string
          project_id: string
          name: string
          url: string | null
          type: DeliverableType
          description: string | null
          created_at: string
        }
        Insert: {
          project_id: string
          name: string
          url?: string | null
          type: DeliverableType
          description?: string | null
        }
        Update: {
          name?: string
          url?: string | null
          description?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          project_id: string
          sender_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          project_id: string
          sender_id?: string | null
          content: string
        }
        Update: never
      }
    }
  }
}
