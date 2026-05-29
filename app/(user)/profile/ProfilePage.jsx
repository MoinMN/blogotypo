"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import SkeletonBox from '@components/Skeletons/Skeleton';
import ProfileImage from '../_components/ProfileImage';
import { useUI } from '@context/UIContext';

const ProfilePage = () => {
  const { data: session, update } = useSession();

  const { showAlert } = useUI();

  const [userData, setUserData] = useState({});
  const [passwords, setPasswords] = useState({
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // show skeleton
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/get-data");

        if (!response.ok) {
          showAlert("Failed to fetch user data!", "danger");
          return;
        }

        const data = await response.json();
        // store user data
        setUserData(data.user);
        // store email on passwords lists
        setPasswords((prev) => ({ ...prev, email: data?.user?.email }));

        // update session data
        await update({
          user: {
            ...session?.user,
            name: data?.user?.name,
          }
        });

      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Failed to fetch user data!", "danger");
      } finally {
        setShowSkeleton(false);
      }
    };
    fetchUserData();
  }, []);

  // personal detail data change
  const handleUserDataChange = (e) => {
    // check for switch data change
    if (e.target.name === 'two_step_auth') {
      setUserData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
      // save on server immediately
      handlePersonalDataSubmit();
      return;
    }

    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // update personal details
  const handlePersonalDataSubmit = async () => {
    setIsProfileSubmitting(true);

    try {
      if (!userData?.name || !userData?.email) {
        showAlert("Name & Email Required!", "danger");
        setIsProfileSubmitting(false);
        return;
      }

      const response = await fetch('/api/user/update-data', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        showAlert(response?.statusText || "Failed to update user data!", "danger");
        setIsProfileSubmitting(false);
        return;
      }

      showAlert("Profile updated successfully!", "success");
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert("Failed to update profile!", "danger");
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  // password data change
  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // password update
  const handleUpdatePassword = async () => {
    setIsPasswordSubmitting(true);

    if (!passwords?.new_password || !passwords?.confirm_password) {
      showAlert("All Fields Required!", "danger");
      setIsPasswordSubmitting(false);
      return;
    }

    if (passwords?.new_password !== passwords?.confirm_password) {
      showAlert("New Password & Confirm Password Mismatched", "danger");
      setIsPasswordSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(passwords)
      });

      response.text().then(text => {
        if (response?.ok) {
          showAlert(text || "Password updated successfully!", "success");
          setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } else {
          showAlert(text || "Failed to update password!", "danger");
        }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      showAlert("Internal Server Error!", "danger");
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 md:mb-5">
          <div
            className="
        inline-flex items-center gap-2
        px-2.5 py-1 rounded-full
        bg-indigo-50 dark:bg-indigo-500/[0.08]
        border border-indigo-100 dark:border-indigo-500/20
        text-indigo-600 dark:text-indigo-300
        text-[10px] font-semibold tracking-[0.16em] uppercase
        mb-2
      "
          >
            Account Settings
          </div>

          <h1
            className="
        text-2xl md:text-3xl
        font-bold tracking-tight
        text-gray-900 dark:text-gray-100
        montserrat_alternates_font
      "
          >
            My Profile
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 md:gap-4">

          {/* Left */}
          <div className="xl:col-span-7">
            <div
              className="
          rounded-2xl
          border border-gray-200 dark:border-gray-100/[0.08]
          bg-gray-100 dark:bg-[#0f172a]
          shadow-sm
          p-3 md:p-4
        "
            >
              {/* Title */}
              <div className="mb-3">
                <h3
                  className="
              text-base md:text-xl
              font-semibold
              text-gray-900 dark:text-gray-100
              montserrat_alternates_font
            "
                >
                  {showSkeleton
                    ? <SkeletonBox width={160} height={24} />
                    : "Personal Details"
                  }
                </h3>
              </div>

              <div className="flex flex-col gap-4">

                {/* Profile */}
                <div>
                  {showSkeleton ? (
                    <>
                      <SkeletonBox
                        width={140}
                        height={140}
                        className="rounded-2xl"
                      />
                    </>
                  ) : (
                    <ProfileImage imageSrc={userData?.image} />
                  )}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-3">

                  {/* Name */}
                  {showSkeleton ? (
                    <div className="flex flex-col gap-1">
                      <SkeletonBox width={90} />
                      <SkeletonBox height={42} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="name"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userData?.name}
                        onChange={handleUserDataChange}
                        className="
                    w-full
                    rounded-xl
                    border border-gray-200 dark:border-gray-100/[0.08]
                    bg-gray-50 dark:bg-gray-100/[0.04]
                    px-3 py-2.5
                    text-sm md:text-base
                    text-gray-800 dark:text-gray-100
                    outline-none
                    transition-all duration-200
                    focus:border-indigo-500
                  "
                      />
                    </div>
                  )}

                  {/* Email */}
                  {showSkeleton ? (
                    <div className="flex flex-col gap-1">
                      <SkeletonBox width={90} />
                      <SkeletonBox height={42} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="email"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </label>

                      <input
                        type="text"
                        disabled
                        value={userData?.email}
                        className="
                    w-full
                    rounded-xl
                    border border-red-200 dark:border-red-500/20
                    bg-red-50 dark:bg-red-500/[0.06]
                    px-3 py-2.5
                    text-sm md:text-base
                    text-gray-500 dark:text-gray-400
                    cursor-not-allowed
                    outline-none
                  "
                      />
                    </div>
                  )}
                </div>

                {/* Button */}
                <div>
                  {showSkeleton ? (
                    <SkeletonBox width={120} height={42} />
                  ) : (
                    <button
                      onClick={handlePersonalDataSubmit}
                      disabled={isProfileSubmitting}
                      className={`
                  px-5 py-2.5 rounded-xl
                  text-sm font-medium text-gray-100
                  transition-all duration-300
                  ${isProfileSubmitting
                          ? "cursor-not-allowed bg-indigo-300 dark:bg-indigo-400/40"
                          : "bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        }
                `}
                    >
                      {isProfileSubmitting ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="xl:col-span-5">
            <div
              className="
          rounded-2xl
          border border-gray-200 dark:border-gray-100/[0.08]
          bg-gray-100 dark:bg-[#0f172a]
          shadow-sm
          p-3 md:p-4
        "
            >
              {/* Title */}
              <div className="mb-3">
                <h3
                  className="
              text-base md:text-xl
              font-semibold
              text-gray-900 dark:text-gray-100
              montserrat_alternates_font
            "
                >
                  {showSkeleton
                    ? <SkeletonBox width={160} height={24} />
                    : userData?.password
                      ? "Change Password"
                      : "Set Password"
                  }
                </h3>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-3">

                {/* Current */}
                {showSkeleton ? (
                  <div className="flex flex-col gap-1">
                    <SkeletonBox width={120} />
                    <SkeletonBox height={42} />
                  </div>
                ) : userData?.password ? (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="current_password"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="current_password"
                      id="current_password"
                      value={passwords.current_password}
                      onChange={handlePasswordChange}
                      className="
                  w-full
                  rounded-xl
                  border border-gray-200 dark:border-gray-100/[0.08]
                  bg-gray-50 dark:bg-gray-100/[0.04]
                  px-3 py-2.5
                  text-sm md:text-base
                  text-gray-800 dark:text-gray-100
                  outline-none
                  focus:border-indigo-500
                "
                    />
                  </div>
                ) : null}

                {/* New */}
                {showSkeleton ? (
                  <div className="flex flex-col gap-1">
                    <SkeletonBox width={120} />
                    <SkeletonBox height={42} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="new_password"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </label>

                    <input
                      type="password"
                      name="new_password"
                      id="new_password"
                      value={passwords.new_password}
                      onChange={handlePasswordChange}
                      className="
                  w-full
                  rounded-xl
                  border border-gray-200 dark:border-gray-100/[0.08]
                  bg-gray-50 dark:bg-gray-100/[0.04]
                  px-3 py-2.5
                  text-sm md:text-base
                  text-gray-800 dark:text-gray-100
                  outline-none
                  focus:border-indigo-500
                "
                    />
                  </div>
                )}

                {/* Confirm */}
                {showSkeleton ? (
                  <div className="flex flex-col gap-1">
                    <SkeletonBox width={120} />
                    <SkeletonBox height={42} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="confirm_password"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      value={passwords.confirm_password}
                      onChange={handlePasswordChange}
                      className="
                  w-full
                  rounded-xl
                  border border-gray-200 dark:border-gray-100/[0.08]
                  bg-gray-50 dark:bg-gray-100/[0.04]
                  px-3 py-2.5
                  text-sm md:text-base
                  text-gray-800 dark:text-gray-100
                  outline-none
                  focus:border-indigo-500
                "
                    />
                  </div>
                )}

                {/* Button */}
                <div className="pt-1">
                  {showSkeleton ? (
                    <SkeletonBox width={120} height={42} />
                  ) : (
                    <button
                      type="submit"
                      onClick={handleUpdatePassword}
                      disabled={isPasswordSubmitting}
                      className={`
                  px-5 py-2.5 rounded-xl
                  text-sm font-medium text-gray-100
                  transition-all duration-300
                  ${isPasswordSubmitting
                          ? "cursor-not-allowed bg-indigo-300 dark:bg-indigo-400/40"
                          : "bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        }
                `}
                    >
                      {isPasswordSubmitting ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
