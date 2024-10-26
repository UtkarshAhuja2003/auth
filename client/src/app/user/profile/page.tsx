"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { EmailVerificationBanner } from "@/components/common/Banner";
import Sidebar from "@/components/Profile/Sidebar";
import { EditableUser } from "@/interfaces/common";
import EditableField from "@/components/Profile/EditableField";
import UpdatePassword from "@/components/Profile/UpdatePassword";
import { getCurrentUser, updateProfile } from "@/api/user";
import { useBanner } from "@/hooks/useBanner";
import Banner from "@/components/common/Banner";
import { User } from "@/interfaces/user";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const UserProfile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { banner, showBanner, closeBanner } = useBanner();

  const [userData, setUserData] = useState<EditableUser>({
    name: { value: "", cacheValue: "", isEditing: false },
    email: { value: "", cacheValue: "", isEditing: false },
    emailVerified: { value: true, cacheValue: false, isEditing: false }
  });

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      router.replace("/user/login");
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const response = await getCurrentUser();
    if (!response.success) {
      showBanner("error", response.message);
      return;
    };
    const { name, email, emailVerified } = response.user;
    setUserData((prevData) => {
      return {
        ...prevData,
        ["name" as keyof EditableUser]: {
          ...prevData.name,
          value: name,
        },
        ["email" as keyof EditableUser]: {
          ...prevData.email,
          value: email
        },
        ["emailVerified" as keyof EditableUser]: {
          ...prevData.emailVerified,
          value: emailVerified
        }
      }
    });
  }

  const handleProfileUpdate = async (user: User) => {
    const response = await updateProfile(user);
    if (!response.success) {
      showBanner("error", response.message);
      return false;
    }
    getUserData();
    showBanner("success", response.message);
    return true;
  }

  const handleEditToggle = async (
    field: keyof typeof userData,
    action: "edit" | "save" | "cancel",
    newValue?: string | boolean
  ) => {
    if (action === "save" && newValue !== undefined) {
      const updatedUser = { [field]: newValue } as User;
      
      const isUpdateSuccessful = await handleProfileUpdate(updatedUser);
      if (isUpdateSuccessful) {
        setUserData((prev) => ({
          ...prev,
          [field]: { value: newValue, cacheValue: "", isEditing: false },
        }));
      }
    } else {
      setUserData((prev) => {
        const currentField = prev[field];

        if (action === "edit") {
          return { ...prev, [field]: { ...currentField, cacheValue: currentField?.value, isEditing: true } };
        } else if (action === "cancel") {
          return { ...prev, [field]: { ...currentField, cacheValue: "", isEditing: false } };
        }
        return prev;
      });
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      const currentField = prev[name as keyof EditableUser];
      return {
        ...prev,
        [name as keyof EditableUser]: {
          ...currentField,
          cacheValue: value,
        },
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {banner.isVisible && banner.type && <Banner message={banner.message} onClose={closeBanner} type={banner.type} />}
      <EmailVerificationBanner isEmailVerified={userData.emailVerified?.value || false} />

      <div className="flex flex-1">
        <Sidebar
          user={{
            name: userData.name?.value || "",
            email: userData.email?.value || ""
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex-1 p-8 lg:pl-72">
          <div className="lg:hidden mb-6">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
            </button>
          </div>

          {activeTab === "details" && (
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">User Details</h2>
              <EditableField
                field="name"
                label="Full Name"
                inputProps={{
                  name: "name",
                  placeholder: "Enter your full name",
                  type: "text",
                  value: userData.name?.cacheValue || "",
                  onChange: handleChange
                }}
                userData={userData}
                handleEditToggle={handleEditToggle}
              />
            </div>
          )}

          {activeTab === "account" && (
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Account</h2>

              <EditableField
                field="email"
                label="Email Address"
                inputProps={{
                  name: "email",
                  placeholder: "Enter your email",
                  type: "email",
                  value: userData.email?.value || "",
                  onChange: handleChange
                }}
                userData={userData}
                handleEditToggle={handleEditToggle}
              />
              <UpdatePassword />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
