import { supabase } from '../client';

export const getDesigns = async (category?: string, tag?: string, material?: string) => {
  let query = supabase.from('designs').select('*').eq('status', 'active');
  
  if (category) {
    query = query.ilike('category', category);
  }
  
  if (tag && tag !== 'All') {
    query = query.contains('tags', [tag]);
  }

  if (material) {
    query = query.eq('material', material);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getDistinctMaterials = async (category: string) => {
  const { data, error } = await supabase
    .from('designs')
    .select('material')
    .ilike('category', category)
    .eq('status', 'active');
  
  if (error) throw error;
  
  // Return unique materials, filtering out nulls
  const materials = Array.from(new Set(data.map(d => d.material).filter(Boolean)));
  return materials;
};

export const getDesignById = async (id: string) => {
  if (!id) return null;
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const toggleWishlist = async (profileId: string, designId: string) => {
  const { data: existing } = await supabase
    .from('wishlists')
    .select('*')
    .eq('profile_id', profileId)
    .eq('design_id', designId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('profile_id', profileId)
      .eq('design_id', designId);
    if (error) throw error;
    return { status: 'removed' };
  } else {
    const { error } = await supabase
      .from('wishlists')
      .insert({ profile_id: profileId, design_id: designId });
    if (error) throw error;
    return { status: 'added' };
  }
};

export const getWishlist = async (profileId: string) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('design_id, designs(*)')
    .eq('profile_id', profileId);
  if (error) throw error;
  return data.map(item => item.designs);
};

export const submitInquiry = async (profileId: string, designId: string | null, subject: string, message: string) => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({ profile_id: profileId, design_id: designId, subject, message });
  if (error) throw error;
  return data;
};

export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Collections / Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

export const getFeaturedCollections = async () => {
  const { data, error } = await supabase
    .from('featured_collections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getDesignsByCollection = async (collectionId: string) => {
  const { data, error } = await supabase
    .from('collection_designs')
    .select('design_id, designs(*)')
    .eq('collection_id', collectionId);
  if (error) throw error;
  return data.map(item => item.designs);
};

// Profile Management
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId);
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};
