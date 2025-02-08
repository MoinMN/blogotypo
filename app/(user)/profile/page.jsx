"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import AlertBox from "@components/Alert";
import SkeletonBox from '@components/Skeletons/Skeleton';
import ProfileImage from '../_components/ProfileImage';
import useMetadata from '@hooks/metadata';


const Profile = () => {
  // set title for page
  useMetadata('Profile - Blogotypo', `User Profile`);

  const { data: session, update } = useSession();

  const [userData, setUserData] = useState({});
  const [passwords, setPasswords] = useState({
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  // show skeleton
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/get-data");

        if (!response.ok) {
          setAlertData((prev) => ({ ...prev, variant: 'danger', header: 'Failed to fetch user data!' }));
          setShowAlert(true);
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
        setAlertData((prev) => ({ ...prev, variant: 'danger', header: 'Failed to fetch user data!' }));
        setShowAlert(true);
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
    setIsSubmitting(true);

    try {
      if (!userData?.name || !userData?.email) {
        setAlertData((prev) => ({ ...prev, variant: 'danger', header: 'Name & Email Required!' }));
        setShowAlert(true);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/user/update-data', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        setAlertData((prev) => ({ ...prev, variant: 'danger', header: response?.statusText }));
        setIsSubmitting(false);
        return;
      }

      setAlertData((prev) => ({ ...prev, variant: 'success', header: 'Profile updated successfully!' }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertData((prev) => ({ ...prev, variant: 'danger', header: 'Failed to update profile!' }));
    } finally {
      setShowAlert(true);
      setIsSubmitting(false);
    }
  }

  // password data change
  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // password update
  const handleUpdatePassword = async () => {
    setIsSubmitting(true);

    if (!passwords?.new_password || !passwords?.confirm_password) {
      setAlertData((prev) => ({ ...prev, header: "All Fields Required!", variant: "danger" }));
      setShowAlert(true);
      setIsSubmitting(false);
      return;
    }

    if (passwords?.new_password !== passwords?.confirm_password) {
      setAlertData((prev) => ({ ...prev, header: "New Password & Confirm Password Mismatched", variant: "danger" }));
      setShowAlert(true);
      setIsSubmitting(false);
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
          setAlertData((prev) => ({ ...prev, variant: 'success', header: text }));
          setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } else {
          setAlertData((prev) => ({ ...prev, variant: 'danger', header: text }));
        }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertData((prev) => ({ ...prev, variant: 'danger', header: 'Failed to update password!' }));
    } finally {
      setShowAlert(true);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="">
        <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold">
          My Profile
        </h1>
        <div className="flex flex-wrap max-md:gap-2 md:gap-4">
          {/* first column */}
          <div className="w-full lg:w-1/2">
            {/* personal details  */}
            <div className="bg-theme_2 max-md:p-2 md:p-4 max-md:my-2 md:my-4 rounded-lg shadow-md text-base md:text-lg flex flex-col">
              <h3 className="text-lg md:text-xl montserrat_alternates_font font-semibold max-md:my-1 md:my-2">
                {showSkeleton
                  ? <SkeletonBox />
                  : 'Personal Details'
                }
              </h3>
              <div className="flex flex-col flex-wrap max-md:gap-2 md:gap-4 max-md:ml-2 md:ml-4">
                <div className="flex flex-col gap-2 w-full">
                  {showSkeleton
                    ? (
                      <>
                        <SkeletonBox width={200} height={200} className="rounded-xl shadow-md" />
                        <SkeletonBox height={40} />
                      </>
                    )
                    : <ProfileImage imageSrc={userData?.image} />
                  }
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {showSkeleton
                    ?
                    <div className="flex flex-col w-full">
                      <SkeletonBox width={100} />
                      <SkeletonBox height={40} />
                    </div>
                    :
                    <div className="flex flex-col w-full">
                      <label htmlFor="name" className="">Name: </label>
                      <input
                        type="email"
                        name="name"
                        id="name"
                        value={userData?.name}
                        onChange={handleUserDataChange}
                        className="outline-none px-2 py-1 rounded-md text-gray-600"
                      />
                    </div>
                  }
                  {showSkeleton
                    ?
                    <div className="flex flex-col w-full">
                      <SkeletonBox width={100} />
                      <SkeletonBox height={40} />
                    </div>
                    :
                    <div className="flex flex-col w-full">
                      <label htmlFor="email">Email: </label>
                      <input
                        type="text"
                        disabled={true}
                        value={userData?.email}
                        className="outline-none px-2 py-1 bg-theme_1 rounded-md border-1 border-red-500 cursor-not-allowed text-gray-600"
                      />
                    </div>
                  }
                </div>
                {showSkeleton
                  ? <SkeletonBox
                    className="rounded-lg"
                    width={100}
                    height={40}
                    baseColor="#7091E6"
                    highlightColor="#a3b5f3"
                  />
                  : <button
                    onClick={handlePersonalDataSubmit}
                    disabled={isSubmitting}
                    className={`text-theme_1 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out w-fit shadow-md ${isSubmitting ? 'cursor-not-allowed bg-theme_3' : 'bg-theme_4 hover:bg-theme_5'}`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                }
              </div>
            </div>
          </div>

          {/* second column  */}
          <div className="w-full lg:w-5/12">
            {/* change password  */}
            <div className="bg-theme_2 max-md:p-2 md:p-4 max-md:my-2 md:my-4 rounded-lg shadow-md h-fit">
              <h3 className="text-lg md:text-xl montserrat_alternates_font font-semibold max-md:my-1 md:my-2">
                {showSkeleton
                  ? <SkeletonBox />
                  : userData?.password
                    ? 'Change Password'
                    : 'Set Password'
                }
              </h3>
              <div className="flex flex-col flex-wrap text-base md:text-lg max-md:gap-2 md:gap-4 max-md:ml-2 md:ml-4">
                {showSkeleton
                  ?
                  <div className="flex flex-col">
                    <SkeletonBox width={150} />
                    <SkeletonBox height={40} />
                  </div>
                  : userData?.password
                    ?
                    <div className="flex flex-col">
                      <label htmlFor="name" className="">Current Password: </label>
                      <input
                        type="password"
                        name="current_password"
                        id="current_password"
                        className="outline-none px-2 py-1 rounded-md text-gray-600"
                        onChange={handlePasswordChange}
                        value={passwords.current_password}
                      />
                    </div>
                    : ''
                }
                {showSkeleton
                  ?
                  <div className="flex flex-col">
                    <SkeletonBox width={150} />
                    <SkeletonBox height={40} />
                  </div>
                  :
                  <div className="flex flex-col">
                    <label htmlFor="name" className="">New Password: </label>
                    <input
                      type="password"
                      name="new_password"
                      id="new_password"
                      className="outline-none px-2 py-1 rounded-md text-gray-600"
                      onChange={handlePasswordChange}
                      value={passwords.new_password}
                    />
                  </div>
                }

                {showSkeleton
                  ?
                  <div className="flex flex-col">
                    <SkeletonBox width={150} />
                    <SkeletonBox height={40} />
                  </div>
                  :
                  <div className="flex flex-col">
                    <label htmlFor="name" className="">Confirm Password: </label>
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      className="outline-none px-2 py-1 rounded-md text-gray-600"
                      onChange={handlePasswordChange}
                      value={passwords.confirm_password}
                    />
                  </div>
                }

                {showSkeleton
                  ? <SkeletonBox
                    className="rounded-lg"
                    width={100}
                    height={40}
                    baseColor="#7091E6"
                    highlightColor="#a3b5f3"
                  />
                  : <button
                    type="submit"
                    onClick={handleUpdatePassword}
                    disabled={isSubmitting}
                    className={`text-theme_1 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out w-fit shadow-md ${isSubmitting ? 'cursor-not-allowed bg-theme_3' : 'bg-theme_4 hover:bg-theme_5'}`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                }
              </div>
            </div>

          </div>
        </div>
      </div>


      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />
    </>
  )
}

export default Profile
