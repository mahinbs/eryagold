import { createClient } from '../client';

// Shared singleton client for all API calls in this file
const supabase = createClient();

export const getAllDesigns = async () => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createDesign = async (designData: any) => {
  const { data, error } = await supabase
    .from('designs')
    .insert(designData)
    .select();
  
  if (error) {
    console.error('Supabase error inserting design:', error);
    throw error;
  }
  return data;
};

export const updateDesign = async (id: string, designData: any) => {
  const { data, error } = await supabase
    .from('designs')
    .update(designData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteDesign = async (id: string) => {
  const { error } = await supabase
    .from('designs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const getAllInquiries = async () => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, profiles(full_name, email), designs(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateInquiryStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (id: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteUserProfile = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const sendNotification = async (notificationData: any) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData);
  if (error) throw error;
  return data;
};

// Optimized getStats with parallel fetching
export const getStats = async () => {
  const [designsRes, usersRes, inquiriesRes] = await Promise.all([
    supabase.from('designs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true })
  ]);

  return { 
    designCount: designsRes.count || 0, 
    userCount: usersRes.count || 0, 
    inquiryCount: inquiriesRes.count || 0 
  };
};

// Category Management
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

export const createCategory = async (categoryData: any) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select();
  if (error) throw error;
  return data;
};

export const updateCategoryTags = async (id: string, tags: string[]) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ tags })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('jewellery-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('jewellery-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Featured Collections
export const getAllCollections = async () => {
  const { data, error } = await supabase
    .from('featured_collections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCollection = async (collectionData: any) => {
  const { data, error } = await supabase
    .from('featured_collections')
    .insert(collectionData)
    .select();
  if (error) throw error;
  return data;
};

export const deleteCollection = async (id: string) => {
  const { error } = await supabase
    .from('featured_collections')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const addDesignToCollection = async (collection_id: string, design_id: string) => {
  const { data, error } = await supabase
    .from('collection_designs')
    .insert({ collection_id, design_id })
    .select();
  if (error) throw error;
  return data;
};

export const removeDesignFromCollection = async (collection_id: string, design_id: string) => {
  const { error } = await supabase
    .from('collection_designs')
    .delete()
    .match({ collection_id, design_id });
  if (error) throw error;
  return true;
};

export const getCollectionDesigns = async (collection_id: string) => {
  const { data, error } = await supabase
    .from('collection_designs')
    .select('*, designs(*)')
    .eq('collection_id', collection_id);
  if (error) throw error;
  return data?.map(item => item.designs) || [];
};
