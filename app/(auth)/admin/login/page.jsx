"use client";

import useMetadata from "@hooks/metadata";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signIn } from "@node_modules/next-auth/react";
import { useRouter } from "@node_modules/next/navigation";
import { useState } from "react";
import { useUI } from "@context/UIContext";

const AdminLogin = () => {
  // set title for page
  useMetadata('Admin Login - Blogotypo', 'Admin login page for blogotypo');

  const router = useRouter();

  const { showAlert } = useUI();

  const userInputs = [
    { name: 'email', type: 'email', placeholder: 'john@gmail.com' },
    { name: 'password', type: 'password', placeholder: 'John_Password' },
  ];

  // store user data
  const [userData, setUserData] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // user data change
  const handleUserDataChange = (e) => setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // return if empty and show msg
    if (!userData?.email || !userData?.password) {
      if (!userData?.email && !userData?.password)
        showAlert("Email & Password Required!", "danger");
      else if (!userData?.email)
        showAlert("Email Required!", "danger");
      else if (!userData?.password)
        showAlert("Password Required!", "danger");

      setIsSubmitting(false);
      return;
    }

    try {
      // next-auth sign in
      const result = await signIn('credentials', {
        redirect: false,
        email: userData?.email,
        password: userData?.password,
        role: "admin"
      });

      if (result.ok) {
        // Redirect or perform actions after successful login
        router.push('/admin/dashboard');
      } else {
        // Handle login error
        let msg;
        if (result.error === 'data and hash arguments required') {
          msg = 'Please sign in using Google or GitHub with provided email ID!';
        }
        if (result.error === "CredentialsSignin") {
          msg = 'Incorrect email and password!';
        }

        showAlert(msg || result?.error, "danger");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log('error while loging', error);
      showAlert("An error occurred while logging in.", "danger");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className='relative min-h-screen w-full flex justify-center items-center'>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src='/assets/videos/background.mp4'
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for better readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/20" />

        {/* Login Box */}
        <div className='relative z-10 bg-theme_1/30 border border-gray-900 rounded-md shadow-lg mx-4 text-base w-full md:w-3/4 lg:w-3/5 md:text-lg md:p-8 max-md:p-4'>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col justify-center items-center"
          >
            <h3 className='text-2xl text-theme_1 playwrite_in_font font-semibold text-center md:text-4xl'>
              Admin Log In
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-6 md:py-4 max-md:py-2 w-full text-theme_1">
              {userInputs?.map((input, index) => (
                <div className='flex flex-col' key={index}>
                  <label htmlFor={input.name}>
                    {input.name.split('_').map(a => (a.charAt(0).toUpperCase() + a.slice(1))).join(' ')}:
                  </label>
                  <input
                    autoComplete={input.name}
                    id={input.name}
                    type={input.type}
                    name={input.name}
                    onChange={handleUserDataChange}
                    className='shadow-md bg-transparent outline-none p-2 rounded-md border border-gray-900 text-theme_1'
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
            </div>
            <button
              type='submit'
              className={`w-fit px-14 md:px-32 py-2 outline-none rounded-md shadow-md bg-theme_1 transition-all duration-300 ease-in-out ${isSubmitting ? 'cursor-not-allowed text-gray-500 bg-theme_1/50' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (<>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Logging In...
                </>)
                : 'Log In'
              }
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdminLogin
