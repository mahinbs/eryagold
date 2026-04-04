"use client";

import { useState, useEffect } from "react";
import { Shield, MoreVertical, Edit, Trash2, X, Loader2, User } from "lucide-react";
import { getAllUsers, updateUserProfile, deleteUserProfile } from "../../supabase/api";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(selectedUser.id, { role: selectedUser.role });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the profile for "${name || 'this user'}"? This action cannot be undone.`)) return;
    
    try {
      await deleteUserProfile(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user profile.");
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Registered Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage client profiles and administrative access for the Erya Gold ecosystem.
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-[#C6A24D] animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">Loading user directory...</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-[#FAF9F6]">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Profile</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Registered</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right font-semibold text-sm text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#E6D6A8] flex items-center justify-center border border-[#C6A24D]/20">
                                  <span className="font-medium text-[#1E1E1E] leading-none uppercase">
                                    {user.full_name ? user.full_name.split(" ").map((n: string) => n[0]).join("") : '?'}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</div>
                                </div>
                              </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-400 mt-1">{user.phone || 'No phone'}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                             {user.role === 'admin' ? (
                               <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10 bg-purple-50">
                                 <Shield className="h-3.5 w-3.5" /> Admin
                               </span>
                             ) : (
                               <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10 bg-gray-50">
                                 Client
                               </span>
                             )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-light">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                             <div className="flex justify-end items-center gap-4">
                               <button 
                                 onClick={() => {
                                   setSelectedUser(user);
                                   setIsEditModalOpen(true);
                                 }}
                                 className="text-[#C6A24D] hover:text-[#B59136] transition-colors flex items-center gap-1"
                               >
                                 <Edit className="h-4 w-4" /> Edit
                               </button>
                               <button 
                                 onClick={() => handleDeleteUser(user.id, user.full_name)}
                                 className="text-red-400 hover:text-red-600 transition-colors"
                               >
                                 <Trash2 className="h-4 w-4" />
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

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 font-serif">Manage User Access</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateRole} className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#FAF9F6] rounded-lg">
                   <div className="h-12 w-12 rounded-full bg-[#E6D6A8] flex items-center justify-center border border-[#C6A24D]/20">
                      <span className="text-lg font-medium uppercase">{selectedUser.full_name?.[0] || '?'}</span>
                   </div>
                   <div>
                      <p className="font-medium text-gray-900">{selectedUser.full_name || 'Unnamed User'}</p>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] text-sm"
                  >
                    <option value="client">Client (Standard Mobile Access)</option>
                    <option value="admin">Administrator (Full Backend Access)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-md border border-transparent bg-[#1E1E1E] py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
