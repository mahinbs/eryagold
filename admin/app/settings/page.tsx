import { User, Lock, Store } from "lucide-react";

export default function SettingsManagement() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 font-serif">Platform Settings</h1>
        <p className="mt-2 text-sm text-gray-700">Manage your administrative profile and store preferences.</p>
        
        <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 font-serif">
               <User className="h-5 w-5 text-[#C6A24D]" /> Profile Information
            </h3>
            <div className="mt-5 max-w-xl">
               <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Admin User"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C6A24D] focus:ring-[#C6A24D] sm:text-sm border p-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                      type="email"
                      defaultValue="admin@eryagold.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C6A24D] focus:ring-[#C6A24D] sm:text-sm border p-2 bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#C6A24D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#B59136] focus:outline-none focus:ring-2 focus:ring-[#C6A24D] focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
               </form>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
             <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 font-serif">
               <Store className="h-5 w-5 text-[#C6A24D]" /> Store Preferences
             </h3>
             <div className="mt-5 max-w-xl space-y-4">
               <div className="flex items-center justify-between">
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Enable new user registrations</span>
                    <span className="text-sm text-gray-500">Allow users to register through the mobile app.</span>
                  </span>
                  <button type="button" className="bg-[#C6A24D] relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C6A24D] focus:ring-offset-2">
                     <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
               </div>
               <div className="pt-4 flex items-center justify-between">
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Auto-reply to Inquiries</span>
                    <span className="text-sm text-gray-500">Send automated greeting to new inquiries.</span>
                  </span>
                  <button type="button" className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C6A24D] focus:ring-offset-2">
                     <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
