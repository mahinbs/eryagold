'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, FolderOpen, X, Tags, Loader2 } from 'lucide-react';
import { getAllCategories, createCategory, deleteCategory, updateCategoryTags } from '../../supabase/api';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    setIsSubmitting(true);
    try {
      await createCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(`Failed to create category: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category.');
    }
  };

  const openTagModal = (category: any) => {
    setSelectedCategory(category);
    setCurrentTags(category.tags || []);
    setIsTagModalOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (currentTags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    setCurrentTags([...currentTags, newTag.trim()]);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(t => t !== tagToRemove));
  };

  const saveTags = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await updateCategoryTags(selectedCategory.id, currentTags);
      setIsTagModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error updating tags:', error);
      alert('Failed to save tags.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Category Architecture</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage root categories and define their sub-tags (e.g. Long/Short for Necklaces) to power the mobile app filters.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] transition-colors"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Category
            </button>
          </div>
        </div>

        {/* Categories Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {loading ? (
                  <div className="bg-white py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-[#C6A24D] animate-spin" />
                    <p className="mt-4 text-gray-500">Syncing categories...</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-[#FAF9F6]">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Category Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sub-tags / Filters</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded bg-[#FAF9F6] border border-[#E6D6A8] flex items-center justify-center">
                                <FolderOpen className="h-4 w-4 text-[#C6A24D]" />
                              </div>
                              {cat.name}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {cat.tags && cat.tags.length > 0 ? (
                                cat.tags.map((tag: string) => (
                                  <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-300 italic">No tags defined</span>
                              )}
                              <button 
                                onClick={() => openTagModal(cat)}
                                className="inline-flex items-center gap-1 text-[#C6A24D] hover:text-[#B59136] font-medium ml-1"
                              >
                                <Plus className="h-3 w-3" /> Add
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 border-l border-gray-50">
                            <div className="flex justify-end gap-4">
                               <button 
                                onClick={() => openTagModal(cat)}
                                className="text-gray-400 hover:text-[#C6A24D] transition-colors"
                                title="Manage Tags"
                              >
                                <Tags className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(cat.id, cat.name)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 font-serif">Create New Category</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Necklaces, Rings"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief summary..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-transparent bg-[#1E1E1E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tags Management Modal */}
      {isTagModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 font-serif">Tags for {selectedCategory.name}</h3>
              <button 
                onClick={() => setIsTagModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Define the filtering options for this category (e.g. Long, Short, Pendent). 
                These will appear as options in the mobile app.
              </p>
              
              <form onSubmit={handleAddTag} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white hover:bg-[#B59136] transition-colors"
                >
                  Add
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                {currentTags.length > 0 ? (
                  currentTags.map((tag) => (
                    <div key={tag} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{tag}</span>
                      <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No tags defined yet.
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsTagModalOpen(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTags}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-transparent bg-[#1E1E1E] py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Tags
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
