import { MessageSquareReply, Filter } from "lucide-react";
import { getAllInquiries } from "../../supabase/api";

export const dynamic = "force-dynamic";

export default async function InquiriesManagement() {
  const inquiries = await getAllInquiries();

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 font-serif">Client Inquiries</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage incoming requests and direct messages regarding your custom designs.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C6A24D] focus:ring-offset-2 sm:w-auto"
            >
              <Filter className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-[#FAF9F6]">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Related Design</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Reply</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {inquiries && inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {(inq.profiles as any)?.full_name || 'Anonymous'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{inq.subject}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[#C6A24D] font-medium">
                          {(inq.designs as any)?.name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            inq.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            inq.status === 'replied' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button className="text-[#C6A24D] hover:text-[#B59136] flex items-center justify-end gap-1 ml-auto">
                              <MessageSquareReply className="h-4 w-4" /> Reply
                            </button>
                        </td>
                      </tr>
                    ))}
                    {(!inquiries || inquiries.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                          No inquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
