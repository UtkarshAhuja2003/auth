"use client";

import { FiSettings, FiLogOut } from "react-icons/fi";
import { logoutUser } from "@/api/user";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: { email: string; name: string };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
}

const Sidebar = ({
  user,
  activeTab,
  setActiveTab,
  sidebarOpen,
}: SidebarProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutUser();
    if (!response.success) {
      alert(response.message);
      return;
    }
    router.replace('/user/login');
  };

  return (
    <div
      className={`w-64 bg-white p-6 shadow-md sidebar transition-transform transform fixed lg:relative z-50 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:w-64`}
    >
      <div className="flex items-center space-x-3 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <nav className="space-y-6">
        <button
          className={`w-full flex items-center text-gray-700 hover:text-blue-500 ${
            activeTab === "details" ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab("details")}
        >
          User Details
        </button>

        <button
          className={`w-full flex items-center text-gray-700 hover:text-blue-500 ${
            activeTab === "account" ? "font-bold" : ""
          }`}
          onClick={() => setActiveTab("account")}
        >
          <FiSettings className="mr-3" /> Account
        </button>

        <button
          className="w-full flex items-center text-gray-700 hover:text-red-500"
          onClick={handleLogout}
        >
          <FiLogOut className="mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
