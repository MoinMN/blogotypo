"use client";

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import Alert from '@components/Alert';
import OtpInputBox from '@app/(auth)/_components/OtpInputBox';
import useMetadata from '@hooks/metadata';

const Register = () => {
  // set title for page
  useMetadata('User Register - Blogotypo', 'User register page for blogotypo');

  const userInputs = [
    { name: 'name', type: 'text', placeholder: 'John Parker' },
    { name: 'email', type: 'email', placeholder: 'john@gmail.com' },
    { name: 'password', type: 'password', placeholder: 'John_Password' },
    { name: 'confirm_password', type: 'password', placeholder: 'John_Password' },
  ];

  const router = useRouter();

  // store user data
  const [userData, setUserData] = useState({
    role: 'user',
    otp: Math.floor(100000 + Math.random() * 900000),
  });
  // input error
  const [error, setError] = useState({});
  // detect otp verification
  const [startOtpVerification, setStartOtpVerification] = useState(false);
  // email is verified
  const [isVerified, setIsVerified] = useState(false);
  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
    content: ''
  });
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
        const response = await fetch('/api/send-mail/otp-verification', {
          method: 'POST',
          'Content-Type': 'application/json',
          body: JSON.stringify({ to: userData?.email, otp: userData?.otp })
        });

        // otp send alert
        response.text().then((text) => {
          if (response.ok) {
            setAlertData((prev) => ({ ...prev, header: text, variant: 'success' }));
            // starting otp verification 
            setStartOtpVerification(true);
          } else {
            setAlertData((prev) => ({ ...prev, header: text, variant: 'danger' }));
          }
        });
      } catch (error) {
        setAlertData((prev) => ({ ...prev, header: 'Internal Server Error!', variant: 'danger' }));
        console.log(error);
      } finally {
        setShowAlert(true);
        setIsSubmitting(false);
      }
    }
  }

  useEffect(() => {
    const createUser = async () => {
      if (isVerified) {
        // user register route
        try {
          const response = await fetch('/api/auth/credentials/register', {
            method: 'POST',
            'Content-Type': 'application/json',
            body: JSON.stringify(userData),
          });

          response.text().then(text => {
            if (response.ok) {
              router.push('/user/login');
            } else {
              setAlertData((prev) => ({ ...prev, header: text, variant: 'danger' }));
              setShowAlert(true);
              if (response.status === 400) {
                setStartOtpVerification(false);
              }
            }
          });
        } catch (error) {
          console.log(error);
          setAlertData((prev) => ({ ...prev, header: 'Internal Server Error!', variant: 'danger' }));
          setShowAlert(true);
        }
      }
    }
    createUser();

    // if isVerified changed
  }, [isVerified]);



  return (
    <>
      <div className='min-h-screen w-full bg-theme_1 flex justify-center items-center'>
        {/* sign up box */}
        <div className={`${startOtpVerification ? 'hidden' : 'block'} bg-theme_4 rounded-md shadow-lg md:p-8 max-md:p-4 mx-4 text-base w-full md:w-3/4 lg:w-3/5 md:text-lg`}>
          <form onSubmit={handleFormSubmit} className="flex flex-col justify-center items-center">
            <h3 className='text-2xl text-theme_1 playwrite_in_font font-semibold text-center md:text-4xl'>
              Sign Up
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-6 md:py-4 max-md:py-2 w-full">
              {
                userInputs?.map((input, index) => (
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
                ))
              }
            </div>


            <button
              type='submit'
              className={`w-fit px-14 md:px-32 py-2 outline-none rounded-md shadow-md bg-theme_1 transition-all duration-300 ease-in-out ${isSubmitting ? 'cursor-not-allowed text-gray-500 bg-theme_1/50' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (<>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Creating...
                </>)
                : 'Create'
              }
            </button>

            <span className="text-xs md:text-sm text-white py-1 text-center">
              By creating account you are accepting Terms & Conditions of Blogotypo.
            </span>
          </form>

          <p className='flex flex-wrap gap-1 justify-center text-center mt-4'>
            Already have an account?
            <Link href='/user/login' className='font-semibold text-blue-700'>
              Log in
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

        {/* otp input box */}
        {startOtpVerification
          ? <OtpInputBox
            actualOtp={userData?.otp}
            setIsVerified={setIsVerified}
            email={userData?.email}
          />
          : ''
        }
      </div>

      <Alert
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={'top-right'}
      />
    </>
  )
}

export default Register