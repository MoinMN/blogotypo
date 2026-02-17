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
    <>
      <div className='min-h-screen w-full bg-theme_1 flex justify-center items-center'>
        {/* login box */}
        <div className='bg-theme_4 rounded-md shadow-lg mx-4 text-base w-full md:w-3/4 lg:w-3/5 md:text-lg md:p-8 max-md:p-4'>
          <form onSubmit={handleFormSubmit} className="flex flex-col justify-center items-center">
            <h3 className='text-2xl text-theme_1 playwrite_in_font font-semibold text-center md:text-4xl'>
              Log In
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-6 md:py-4 max-md:py-2 w-full">
              {userInputs?.map((input, index) => (
                <div className='flex flex-col' key={index}>
                  <label htmlFor={input.name}>
                    {input.name.split('_').map(a => (a.charAt(0).toUpperCase() + a.slice(1))).join(' ')}:
                  </label>
                  {error[input.name] && (
                    <label className='text-red-700'>
                      {error[input.name]}
                    </label>
                  )}
                  <input
                    autoComplete={input.name}
                    id={input.name}
                    type={input.type}
                    name={input.name}
                    onChange={handleUserDataChange}
                    className='shadow-md bg-theme_1 outline-none p-2 rounded-md text-gray-600'
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

          <p className='flex flex-wrap gap-1 justify-center my-4 text-center'>
            Don't have an account?
            <Link href='/user/register' className='font-semibold text-blue-700'>
              Create Now
            </Link>
          </p>

          <div className="flex justify-center items-center my-4 text-theme_1">
            <hr className='w-1/2' />
            <span className='px-4'>or</span>
            <hr className='w-1/2' />
          </div>

          {/* provider sign in  */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <button onClick={() => signIn('google')} className='bg-theme_1 flex justify-evenly items-center rounded-md gap-2 px-2 py-1 md:gap-4 md:px-4 md:py-2'>
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google Provider Image"
                width={40}
              />
              <span className=''>
                Sign in with Google
              </span>
            </button>

            <button onClick={() => signIn('github')} className='bg-theme_1 flex justify-evenly items-center rounded-md gap-2 px-2 py-1 md:gap-4 md:px-4 md:py-2'>
              <img
                src="https://authjs.dev/img/providers/github.svg"
                alt="Google Provider Image"
                width={40}
              />
              <span className=''>
                Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
