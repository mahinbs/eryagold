"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Loader2, Package, Search } from "lucide-react";
import { 
  getAllCollections, 
  createCollection, 
  deleteCollection, 
  getAllDesigns, 
  addDesignToCollection, 
  removeDesignFromCollection, 
  getCollectionDesigns 
} from "../../supabase/api";

export default function CollectionsManagement() {
  const [collections, setCollections] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [collectionDesigns, setCollectionDesigns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCollections();
    fetchDesigns();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getAllCollections();
      setCollections(data || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesigns = async () => {
    try {
      const data = await getAllDesigns();
      setDesigns(data || []);
    } catch (error) {
      console.error("Error fetching designs:", error);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCollection(formData);
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      fetchCollections();
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection. Make sure the name is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" collection?`)) return;
    try {
      await deleteCollection(id);
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const openManageModal = async (collection: any) => {
    setSelectedCollection(collection);
    setIsManageModalOpen(true);
    try {
      const activeDesigns = await getCollectionDesigns(collection.id);
      setCollectionDesigns(activeDesigns.map((d: any) => d.id));
    } catch (error) {
      console.error("Error fetching collection designs:", error);
    }
  };

  const toggleDesignInCollection = async (designId: string) => {
    if (!selectedCollection) return;

    const isCurrentlyIn = collectionDesigns.includes(designId);
    try {
      if (isCurrentlyIn) {
        await removeDesignFromCollection(selectedCollection.id, designId);
        setCollectionDesigns(prev => prev.filter(id => id !== designId));
      } else {
        await addDesignToCollection(selectedCollection.id, designId);
        setCollectionDesigns(prev => [...prev, designId]);
      }
    } catch (error) {
      console.error("Error toggling design in collection:", error);
    }
  };

  const filteredDesigns = designs.filter(design => 
    design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Featured Collections</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage highlight series like "Bridal Collection" or "Wedding Edit".
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] transition-colors"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Collection
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-[#C6A24D] animate-spin" />
            <p className="mt-4 text-gray-500">Loading collections...</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 font-serif">{collection.name}</h3>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleDeleteCollection(collection.id, collection.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{collection.description || 'No description provided.'}</p>
                  
                  <button
                    onClick={() => openManageModal(collection)}
                    className="w-full inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="mr-2 h-4 w-4 text-[#C6A24D]" />
                    Manage Designs
                  </button>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
                  Created {new Date(collection.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 font-serif">Create New Collection</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateCollection} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Collection Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D]"
                    placeholder="e.g. Bridal Treasures"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D]"
                    placeholder="Briefly describe this collection..."
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
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
                  className="flex-1 rounded-md border border-transparent bg-[#C6A24D] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] focus:outline-none disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Designs Modal */}
      {isManageModalOpen && selectedCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-serif">Add Designs to {selectedCollection.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{collectionDesigns.length} designs selected</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 bg-gray-50">
               <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search designs by name or category..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#C6A24D] focus:border-[#C6A24D] sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDesigns.map((design) => {
                    const isInCollection = collectionDesigns.includes(design.id);
                    return (
                      <div 
                        key={design.id}
                        onClick={() => toggleDesignInCollection(design.id)}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isInCollection 
                            ? "border-[#C6A24D] bg-[#C6A24D]/5 shadow-sm" 
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                         <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                           {design.image_url ? (
                             <img src={design.image_url} alt="" className="h-full w-full object-cover" />
                           ) : (
                             <div className="h-full w-full flex items-center justify-center">
                               <Package className="h-6 w-6 text-gray-300" />
                             </div>
                           )}
                         </div>
                         <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{design.name}</p>
                            <p className="text-xs text-gray-500 truncate">{design.category}</p>
                         </div>
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                           isInCollection ? "bg-[#C6A24D] border-[#C6A24D]" : "border-gray-200"
                         }`}>
                           {isInCollection && <div className="w-2 h-2 bg-white rounded-full" />}
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
               <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="w-full rounded-md bg-[#1E1E1E] py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-black transition-colors"
                >
                  Done Managing Designs
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
