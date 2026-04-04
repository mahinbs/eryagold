import { Users, Package, MessageSquareText, TrendingUp } from "lucide-react";
import { getStats } from "../supabase/api";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { designCount, userCount, inquiryCount } = await getStats();

  const stats = [
    { name: "Total Designs", stat: designCount?.toString() || "0", icon: Package, change: "0", changeType: "increase" },
    { name: "Total Registered Users", stat: userCount?.toString() || "0", icon: Users, change: "0", changeType: "increase" },
    { name: "Open Inquiries", stat: inquiryCount?.toString() || "0", icon: MessageSquareText, change: "0", changeType: "increase" },
    { name: "Engagement Rate", stat: "0%", icon: TrendingUp, change: "0%", changeType: "increase" },
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 font-serif">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back. Here is what is happening with your store today.</p>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6 border border-gray-100"
            >
              <dt>
                <div className="absolute rounded-md bg-[#FAF9F6] border border-[#E6D6A8] p-3 text-[#C6A24D]">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 font-serif">{item.stat}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.changeType === "increase" ? "+" : "-"}
                  {item.change}
                </p>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-100">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#C6A24D] hover:text-[#B59136]">
                      View all<span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>

        {/* Mock Chart or Recent Activity Area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white flex flex-col rounded-lg shadow border border-gray-100 min-h-[400px]">
             <div className="px-6 py-5 border-b border-gray-100">
               <h3 className="text-base font-medium leading-6 text-gray-900 font-serif">Recent Inquiries</h3>
             </div>
             <div className="p-6 flex-1 flex flex-col justify-center items-center text-gray-500">
                <MessageSquareText className="h-12 w-12 text-[#E6D6A8] mb-4" />
                <p>No new inquiries in the last 24 hours.</p>
             </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-100">
             <div className="px-6 py-5 border-b border-gray-100">
               <h3 className="text-base font-medium leading-6 text-gray-900 font-serif">Fast Selling Categories</h3>
             </div>
             <div className="p-6">
               <ul className="space-y-4">
                 <li className="flex justify-between items-center text-sm">
                   <span className="text-gray-700 font-medium">Necklaces</span>
                   <span className="text-green-600 font-semibold">+14%</span>
                 </li>
                 <li className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                   <span className="text-gray-700 font-medium">Bespoke Rings</span>
                   <span className="text-green-600 font-semibold">+8%</span>
                 </li>
                 <li className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                   <span className="text-gray-700 font-medium">Bracelets</span>
                   <span className="text-red-600 font-semibold">-2%</span>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
