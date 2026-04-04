"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = ["/login", "/register", "/verify-otp"].includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6A24D]"></div>
      </div>
    );
  }

  // If on auth page, don't show the dashboard layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Protect the dashboard
  if (!user || role !== "admin") {
    // If user is logged in but NOT an admin, they should probably logout or see an error
    // For now, let's just show a simple unauthorized message or redirect to login
    if (user && role !== "admin") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6]">
          <h1 className="text-2xl font-serif text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-8">Administrators only section.</p>
          <button 
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      );
    }
    return null; // Will redirect in useEffect
  }

  // Normal Dashboard layout
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    </div>
  );
}
