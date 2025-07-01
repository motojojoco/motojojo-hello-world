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
          },
        ]
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
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string
          deletable: boolean
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          deletable?: boolean
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string
          deletable?: boolean
          icon?: string | null
          id?: string
          name?: string
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
          duration: string | null
          event_type: string | null
          featured: boolean
          gallery: string[] | null
          host: string | null
          id: string
          image: string
          is_published: boolean
          long_description: string | null
          price: number
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
          duration?: string | null
          event_type?: string | null
          featured?: boolean
          gallery?: string[] | null
          host?: string | null
          id?: string
          image: string
          is_published?: boolean
          long_description?: string | null
          price: number
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
          duration?: string | null
          event_type?: string | null
          featured?: boolean
          gallery?: string[] | null
          host?: string | null
          id?: string
          image?: string
          is_published?: boolean
          long_description?: string | null
          price?: number
          subtitle?: string | null
          time?: string
          title?: string
          updated_at?: string | null
          venue?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          qr_code: string | null
          ticket_number: string
          username: string | null
          attended: boolean | null
          attended_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          ticket_number: string
          username?: string | null
          attended?: boolean | null
          attended_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          ticket_number?: string
          username?: string | null
          attended?: boolean | null
          attended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_event_seats: {
        Args: { event_id: string; total_seats: number }
        Returns: undefined
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
