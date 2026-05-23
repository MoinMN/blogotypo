"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import useMetadata from '@hooks/metadata';
import { useUI } from '@context/UIContext';


const Login = () => {
  // set title for page
  useMetadata('User Login - Blogotypo', 'User login page for blogotypo');

  const { showAlert } = useUI();

  const userInputs = [
    { name: 'email', type: 'email', placeholder: 'john@gmail.com' },
    { name: 'password', type: 'password', placeholder: 'John_Password' },
  ];

  const searchParams = useSearchParams();
  const router = useRouter();

  // store user data
  const [userData, setUserData] = useState({});
  // input error
  const [error, setError] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // user data change 
  const handleUserDataChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // clear error for that input name
    setError((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  // submit form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // return if any one is also empty
    if (!userData?.email || !userData?.password) {
      if (!userData?.email) setError((prev) => ({ ...prev, email: 'Email Required!' }))
      if (!userData?.password) setError((prev) => ({ ...prev, password: 'Password Required!' }))
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: userData?.email,
        password: userData?.password,
        role: "user",
      });

      if (result.ok) {
        const callbackUrl = searchParams.get('callback') || '/dashboard';
        // Redirect or perform actions after successful login
        router.push(callbackUrl);
      } else {
        // Handle login error
        let msg;
        if (result.error === 'data and hash arguments required') {
          msg = 'Please sign in using Google or GitHub with provided email ID!';
        }
        if (result.error === "CredentialsSignin") {
          msg = 'Incorrect email and password!';
        }

        showAlert(msg || result?.error, "danger", "top-right");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login Error:', error);
      showAlert("An error occurred while logging in.", "danger", "top-right");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme_3 via-theme_4 to-theme_5 flex justify-center items-center px-4">

      {/* Card */}
      <div className="w-full max-w-2xl bg-gray-100100100/10 backdrop-blur-xl border bgragray-100100100100-gray-100/20 shadow-2xl rounded-2xl p-6 md:p-10">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-200 mt-2 text-sm md:text-base">
            Sign in to manage your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">

          <div className="grid sm:grid-cols-2 gap-3 md:gap-5">
            {userInputs?.map((input, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <label
                  htmlFor={input.name}
                  className="text-sm font-medium text-gray-200"
                >
                  {input.name
                    .split("_")
                    .map(a => a.charAt(0).toUpperCase() + a.slice(1))
                    .join(" ")}
                </label>

                {error[input.name] && (
                  <span className="text-red-500 text-sm">
                    {error[input.name]}
                  </span>
                )}

                <input
                  autoComplete={input.name}
                  id={input.name}
                  type={input.type}
                  name={input.name}
                  onChange={handleUserDataChange}
                  placeholder={input.placeholder}
                  className="bg-gray-100/20 text-gray-100 placeholder-gray-300 border border-gray-100/20 focus:border-gray-100 focus:ring-2 focus:ring-gray-100/30 outline-none px-4 py-2.5 rounded-lg transition duration-300"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold text-gray-100 transition duration-300 ${isSubmitting
              ? "bg-gray-100100/10 cursor-not-allowed"
              : "bg-gray-100/20 hover:bg-gray-100/30 backdrop-blur-md"
              }`}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-gray-100/20"></div>
          <span className="px-4 text-gray-200 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-100/20"></div>
        </div>

        {/* Provider Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">

          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 bg-gray-100 text-black font-medium rounded-lg py-2.5 hover:scale-105 transition duration-300"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google"
              width={22}
            />
            Sign in with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-3 bg-gray-100 text-black font-medium rounded-lg py-2.5 hover:scale-105 transition duration-300"
          >
            <img
              src="https://authjs.dev/img/providers/github.svg"
              alt="GitHub"
              width={22}
            />
            Sign in with GitHub
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-200 text-sm mt-8">
          Don't have an account?{" "}
          <Link
            href="/user/register"
            className="text-gray-100 font-semibold no-underline hover:underline"
          >
            Create Now
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link
            href="/dashboard"
            className="text-gray-600 text-sm hover:text-gray-800 cursor-pointer transition no-underline hover:underline"
          >
            Continue as Guest
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
