import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  link_text?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateBannerInput {
  title?: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  is_active?: boolean;
  sort_order?: number;
}

export const getBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
  
  return data || [];
};

export const getAllBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching all banners:", error);
    return [];
  }
  
  return data || [];
};

export const createBanner = async (bannerData: CreateBannerInput): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .insert(bannerData)
    .select('*')
    .single();

  if (error) {
    console.error("Error creating banner:", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateBanner = async (id: string, bannerData: UpdateBannerInput): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .update(bannerData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating banner:", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting banner:", error);
    throw new Error(error.message);
  }
};

export const getBanner = async (id: string): Promise<Banner | null> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching banner:", error);
    return null;
  }

  return data;
}; 