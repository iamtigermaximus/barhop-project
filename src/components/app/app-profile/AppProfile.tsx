"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleNavigation = (path: string, buttonName: string) => {
    setIsLoading(buttonName);
    router.push(path);
  };

  const handleLogout = () => {
    setIsLoading("logout");
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 pb-24">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold">
            {session?.user?.name || "User"}
          </h1>
          <p className="text-gray-400">{session?.user?.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("/app/my-crawls", "my-crawls")}
            disabled={isLoading === "my-crawls"}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">My Crawls</h3>
                <p className="text-blue-100 text-sm">
                  View and manage your bar crawls
                </p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
            {isLoading === "my-crawls" && (
              <div className="text-center mt-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleNavigation("/app/vip/wallet", "vip-passes")}
            disabled={isLoading === "vip-passes"}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-400 disabled:to-purple-500 text-white p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">My VIP Passes</h3>
                <p className="text-purple-100 text-sm">
                  Manage your VIP passes and discounts
                </p>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
            {isLoading === "vip-passes" && (
              <div className="text-center mt-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleNavigation("/app/crawl-planner", "plan-crawl")}
            disabled={isLoading === "plan-crawl"}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Plan New Crawl</h3>
                <p className="text-green-100 text-sm">
                  Create a new bar crawl adventure
                </p>
              </div>
              <div className="text-2xl">✨</div>
            </div>
            {isLoading === "plan-crawl" && (
              <div className="text-center mt-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleNavigation("/app/bars", "explore-bars")}
            disabled={isLoading === "explore-bars"}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Explore Bars</h3>
                <p className="text-orange-100 text-sm">
                  Discover new bars and venues
                </p>
              </div>
              <div className="text-2xl">🍻</div>
            </div>
            {isLoading === "explore-bars" && (
              <div className="text-center mt-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        </div>

        {/* Account Section */}
        <div className="mt-8 bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-4">Account</h3>

          <button
            onClick={() => handleNavigation("/app/user-profile", "settings")}
            disabled={isLoading === "settings"}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
          >
            <span>Profile Settings</span>
            <span>⚙️</span>
          </button>

          <button
            onClick={() => handleNavigation("/app/support", "support")}
            disabled={isLoading === "support"}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
          >
            <span>Help & Support</span>
            <span>💬</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading === "logout"}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white p-4 rounded-xl mt-8 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Log Out</h3>
              <p className="text-red-100 text-sm">Sign out of your account</p>
            </div>
            <div className="text-2xl">🚪</div>
          </div>
          {isLoading === "logout" && (
            <div className="text-center mt-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
