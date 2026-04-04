import { Send, BellPlus, CheckCircle2 } from "lucide-react";
import { createClient } from "../../supabase/server";

export const dynamic = "force-dynamic";

export default async function NotificationsManagement() {
  const supabase = await createClient();
  const { data: history } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Push Notifications</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create and manage automated or manual announcements sent directly to user devices.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Notification Form */}
          <div className="col-span-1 lg:col-span-1 border border-gray-200 bg-white rounded-lg shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <BellPlus className="h-5 w-5 text-[#C6A24D]" />
                New Notification
              </h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#C6A24D] focus:outline-none focus:ring-[#C6A24D] sm:text-sm border bg-white">
                  <option>All Registered Users</option>
                  <option>Recent Inquirers</option>
                  <option>VIP Clients</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g. New Heritage Drop"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C6A24D] focus:ring-[#C6A24D] sm:text-sm border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Type your message here..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C6A24D] focus:ring-[#C6A24D] sm:text-sm border p-2"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] focus:outline-none focus:ring-2 focus:ring-[#C6A24D] focus:ring-offset-2"
                >
                  <Send className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="col-span-1 lg:col-span-2">
            <div className="border border-gray-200 bg-white rounded-lg shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200">
                 <h2 className="text-lg font-medium text-gray-900">Push History</h2>
              </div>
              <ul role="list" className="divide-y divide-gray-200">
                {history && history.map((item) => (
                  <li key={item.id} className="p-5 hover:bg-[#FAF9F6] transition-colors">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.body}</p>
                          <div className="mt-3 flex items-center gap-3">
                             <span className="text-xs font-medium bg-[#E6D6A8]/30 text-[#A68A3D] px-2 py-0.5 rounded-full border border-[#E6D6A8]">
                               Audience: {item.audience}
                             </span>
                             <span className="text-xs text-gray-400 font-medium">
                               {new Date(item.created_at).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-green-700 bg-green-50 ring-1 ring-inset ring-green-600/20">
                             <CheckCircle2 className="h-3 w-3" /> {item.status}
                          </span>
                        </div>
                     </div>
                  </li>
                ))}
                {(!history || history.length === 0) && (
                  <li className="p-10 text-center text-sm text-gray-500">
                    No push history found.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
