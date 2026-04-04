'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ImageIcon, Loader2, Upload, Tag } from 'lucide-react';
import { getAllDesigns, createDesign, deleteDesign, getAllCategories, uploadImage } from '../../supabase/api';

export default function DesignsManagement() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: '',
    material: '',
    tags: [] as string[],
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [designsData, categoriesData] = await Promise.all([
        getAllDesigns(),
        getAllCategories()
      ]);
      setDesigns(designsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Name and Category are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;

      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      await createDesign({ ...formData, image_url: finalImageUrl });
      
      setIsModalOpen(false);
      setFormData({ 
        name: '', 
        category: '', 
        price: '', 
        description: '', 
        image_url: '', 
        material: '', 
        tags: [],
        status: 'active' 
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData();
    } catch (error: any) {
      console.error('Detailed error creating design:', error);
      alert(`Failed to save design: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteDesign(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Failed to delete design.');
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const selectedCategoryData = categories.find(c => c.name === formData.category);
  const availableTags = selectedCategoryData?.tags || [];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Designs Catalog</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your jewellery pieces. Assign them to categories and tags to power the mobile filters.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] transition-colors"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add design
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-[#C6A24D] animate-spin" />
            <p className="mt-4 text-gray-500">Syncing with catalog...</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-[#FAF9F6]">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Design</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category & Tags</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Material</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {designs.map((design) => (
                        <tr key={design.id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {design.image_url ? (
                                  <img className="h-10 w-10 rounded object-cover border border-gray-100" src={design.image_url} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{design.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis italic">
                            {design.description ? (design.description.length > 50 ? design.description.substring(0, 50) + '...' : design.description) : 'No description'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-col gap-1.5">
                               <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10 w-fit">
                                 {design.category}
                               </span>
                               <div className="flex flex-wrap gap-1">
                                  {design.tags && design.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                      {tag}
                                    </span>
                                  ))}
                               </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                             {design.material || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">{design.price || 'P.O.E.'}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              design.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {design.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-3">
                              <button onClick={() => handleDelete(design.id, design.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Design Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 font-serif">Add New Jewellery Design</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddDesign} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Design Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                      placeholder="e.g. Classic Solitaire Ring"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, tags: [] })}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Display</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                        placeholder="e.g. ₹50,000"
                      />
                    </div>
                  </div>

                  {/* Sub-category Tags Selection */}
                  {formData.category && (
                    <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#E6D6A8]/30">
                       <label className="block text-xs font-semibold text-[#B59136] uppercase tracking-wider mb-3 flex items-center gap-2">
                         <Tag className="h-3 w-3" /> Filters for {formData.category}
                       </label>
                       <div className="flex flex-wrap gap-2">
                          {availableTags.length > 0 ? (
                            availableTags.map((tag: string) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                                  formData.tags.includes(tag)
                                    ? "bg-[#C6A24D] border-[#C6A24D] text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-[#C6A24D]/50"
                                }`}
                              >
                                {tag}
                              </button>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">No tags defined for this category. Add them in Category Management.</p>
                          )}
                       </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                      placeholder="e.g. 22K Gold, VVS Diamond"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jewellery Image</label>
                    <div className="mt-1 flex flex-col gap-4">
                      {/* File Upload Area */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                          {previewUrl ? (
                            <div className="relative h-full w-full">
                               <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                 <Plus className="h-8 w-8 text-white" />
                               </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-[#C6A24D] transition-colors" />
                              <p className="text-sm text-gray-500">Tap to upload high-res image</p>
                            </div>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>

                      {/* Manual URL Fallback */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-tight">External Image Link</label>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({ ...formData, image_url: e.target.value });
                            if (e.target.value) {
                              setPreviewUrl(e.target.value);
                              setSelectedFile(null);
                            }
                          }}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] text-xs"
                          placeholder="Paste a secure URL here..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                    >
                      <option value="active">Active (Visible in App)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                    placeholder="Tell the story of this piece..."
                  />
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-transparent bg-[#1E1E1E] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Finalizing Piece...' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
