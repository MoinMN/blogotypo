"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import OtpInputBox from '@app/(auth)/_components/OtpInputBox';
import useMetadata from '@hooks/metadata';
import { useUI } from '@context/UIContext';

const Register = () => {
  // set title for page
  useMetadata('User Register - Blogotypo', 'User register page for blogotypo');

  const { showAlert } = useUI();

  const userInputs = [
    { name: 'name', type: 'text', placeholder: 'John Parker' },
    { name: 'email', type: 'email', placeholder: 'john@gmail.com' },
    { name: 'password', type: 'password', placeholder: 'John_Password' },
    { name: 'confirm_password', type: 'password', placeholder: 'John_Password' },
  ];

  // store user data
  const [userData, setUserData] = useState({});
  // input error
  const [error, setError] = useState({});
  // detect otp verification
  const [startOtpVerification, setStartOtpVerification] = useState(false);

  // to disable submit button
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

    // return if user data is empty
    if (!userData?.name || !userData?.email || !userData?.password || !userData?.confirm_password) {
      if (!userData?.name) setError((prev) => ({ ...prev, name: 'Name Required!' }))
      if (!userData?.email) setError((prev) => ({ ...prev, email: 'Email Required!' }))
      if (!userData?.password) setError((prev) => ({ ...prev, password: 'Password Required!' }))
      if (!userData?.confirm_password) setError((prev) => ({ ...prev, confirm_password: 'Confirm Password Required!' }))
      setIsSubmitting(false);
      return;
    }

    if (userData?.password !== userData?.confirm_password) {
      setError({ ...error, confirm_password: "Confirm password mis-matched!" });
      setIsSubmitting(false);
      return;
    }

    if (!startOtpVerification) {
      // otp verify route
      try {
        const response = await fetch('/api/auth/otp/generate', {
          method: 'POST',
          'Content-Type': 'application/json',
          body: JSON.stringify({ email: userData?.email })
        });
        const data = await response.json();

        if (response.ok) {
          showAlert(data?.msg, "success", "top-right");
          // starting otp verification 
          setStartOtpVerification(true);
        } else {
          showAlert(data?.msg, "danger", "top-right");
        }
      } catch (error) {
        showAlert("Internal Server Error!", "danger", "top-right");
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme_3 via-theme_4 to-theme_5 flex justify-center items-center px-4">

      {/* SIGN UP CARD */}
      {!startOtpVerification && (
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 md:px-10 md:py-6 transition-all duration-500">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Create Account
            </h1>
            <p className="text-gray-200 mt-2 text-sm md:text-base">
              Join Blogotypo and start sharing your ideas
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">

            <div className="grid sm:grid-cols-2 gap-2">
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
                    className="bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 outline-none px-4 py-2.5 rounded-lg transition duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${isSubmitting
                ? "bg-white/10 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30 backdrop-blur-md"
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
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-xs md:text-sm text-gray-200 text-center">
              By creating an account, you agree to Blogotypo’s{` `}
              <Link className='text-gray-200 underline font-bold' href="/docs/term-and-conditions" target="_blanck">
                Terms & Conditions.
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="px-4 text-gray-200 text-sm">OR</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Provider Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">

            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center gap-3 bg-white text-black font-medium rounded-lg py-2.5 hover:scale-105 transition duration-300"
            >
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google"
                width={22}
              />
              Sign up with Google
            </button>

            <button
              onClick={() => signIn("github")}
              className="flex items-center justify-center gap-3 text-black bg-white font-medium rounded-lg py-2.5 hover:scale-105 transition duration-300"
            >
              <img
                src="https://authjs.dev/img/providers/github.svg"
                alt="GitHub"
                width={22}
              />
              Sign up with GitHub
            </button>

          </div>

          {/* Footer */}
          <p className="text-center text-gray-200 text-sm mt-8">
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="text-white font-semibold hover:underline"
            >
              Log in
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
      )}

      {/* OTP BOX */}
      {startOtpVerification && (
        <OtpInputBox
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </div>
  )
}

export default Register