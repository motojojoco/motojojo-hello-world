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
      artists: {
        Row: {
          created_at: string | null
          genre: string
          id: string
          image: string | null
          name: string
          profile: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          genre: string
          id?: string
          image?: string | null
          name: string
          profile: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          genre?: string
          id?: string
          image?: string | null
          name?: string
          profile?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          created_at: string
          event_id: string
          host_id: string
          id: string
          marked_at: string
          notes: string | null
          status: string
          ticket_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          host_id: string
          id?: string
          marked_at?: string
          notes?: string | null
          status?: string
          ticket_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          host_id?: string
          id?: string
          marked_at?: string
          notes?: string | null
          status?: string
          ticket_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link_text: string | null
          link_url: string | null
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          booking_date: string
          email: string
          event_id: string | null
          id: string
          name: string
          order_id: string | null
          payment_id: string | null
          phone: string
          status: string
          tickets: number
          user_id: string
        }
        Insert: {
          amount: number
          booking_date?: string
          email: string
          event_id?: string | null
          id?: string
          name: string
          order_id?: string | null
          payment_id?: string | null
          phone: string
          status?: string
          tickets?: number
          user_id: string
        }
        Update: {
          amount?: number
          booking_date?: string
          email?: string
          event_id?: string | null
          id?: string
          name?: string
          order_id?: string | null
          payment_id?: string | null
          phone?: string
          status?: string
          tickets?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_seats: {
        Row: {
          booking_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          seat_number: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          seat_number: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          seat_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_seats_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      event_types: {
        Row: {
          created_at: string
          deletable: boolean
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deletable?: boolean
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deletable?: boolean
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          category: string
          city: string
          created_at: string
          created_by: string | null
          date: string
          description: string
          discounted_price: number | null
          duration: string | null
          event_type: string | null
          featured: boolean
          gallery: string[] | null
          has_discount: boolean
          host: string | null
          id: string
          image: string
          is_published: boolean
          long_description: string | null
          price: number
          real_price: number | null
          subtitle: string | null
          time: string
          title: string
          updated_at: string | null
          venue: string
        }
        Insert: {
          address?: string | null
          category: string
          city: string
          created_at?: string
          created_by?: string | null
          date: string
          description: string
          discounted_price?: number | null
          duration?: string | null
          event_type?: string | null
          featured?: boolean
          gallery?: string[] | null
          has_discount?: boolean
          host?: string | null
          id?: string
          image: string
          is_published?: boolean
          long_description?: string | null
          price: number
          real_price?: number | null
          subtitle?: string | null
          time: string
          title: string
          updated_at?: string | null
          venue: string
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          discounted_price?: number | null
          duration?: string | null
          event_type?: string | null
          featured?: boolean
          gallery?: string[] | null
          has_discount?: boolean
          host?: string | null
          id?: string
          image?: string
          is_published?: boolean
          long_description?: string | null
          price?: number
          real_price?: number | null
          subtitle?: string | null
          time?: string
          title?: string
          updated_at?: string | null
          venue?: string
        }
        Relationships: []
      }
      host_events: {
        Row: {
          created_at: string
          event_id: string
          host_id: string
          id: string
          permissions: Json
        }
        Insert: {
          created_at?: string
          event_id: string
          host_id: string
          id?: string
          permissions?: Json
        }
        Update: {
          created_at?: string
          event_id?: string
          host_id?: string
          id?: string
          permissions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "host_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          }
        ]
      }
      host_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          invitation_token: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          invitation_token: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          invitation_token?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      hosts: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          host_name: string
          id: string
          is_active: boolean
          is_verified: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          host_name: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          host_name?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hosts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          attended: boolean | null
          attended_at: string | null
          booking_id: string | null
          created_at: string
          id: string
          qr_code: string | null
          ticket_number: string
          username: string | null
        }
        Insert: {
          attended?: boolean | null
          attended_at?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          ticket_number: string
          username?: string | null
        }
        Update: {
          attended?: boolean | null
          attended_at?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          ticket_number?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          updated_at: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      attendance_summary_view: {
        Row: {
          absent_count: number | null
          attendance_rate: number | null
          event_city: string | null
          event_date: string | null
          event_id: string | null
          event_title: string | null
          host_name: string | null
          present_count: number | null
          total_tickets: number | null
        }
        Relationships: []
      }
      host_dashboard_view: {
        Row: {
          absent_tickets: number | null
          city: string | null
          email: string | null
          host_id: string | null
          host_name: string | null
          present_tickets: number | null
          total_events: number | null
          total_tickets: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_host_invitation: {
        Args: {
          invitation_token: string
          user_id: string
          host_name: string
          phone?: string
          city?: string
          bio?: string
        }
        Returns: Json
      }
      create_host_invitation: {
        Args: {
          invite_email: string
          invited_by_user_id: string
        }
        Returns: Json
      }
      get_attendance_stats: {
        Args: {
          event_id?: string
          city?: string
        }
        Returns: Json
      }
      mark_attendance: {
        Args: {
          ticket_id: string
          event_id: string
          status: string
          notes?: string
        }
        Returns: Json
      }
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
