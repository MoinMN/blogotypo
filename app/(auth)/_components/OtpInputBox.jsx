"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUI } from '@context/UIContext';

const OtpInputBox = ({ userData, setUserData }) => {
  const router = useRouter();

  const { showAlert } = useUI();

  // for masked email
  const [maskedEmail, setMaskedEmail] = useState("");

  const [otpInputValues, setOtpInputValues] = useState({
    otpInput1: '',
    otpInput2: '',
    otpInput3: '',
    otpInput4: '',
    otpInput5: '',
    otpInput6: '',
  });

  // Create refs for each input field
  const otpInputRefs = {
    otpInput1: useRef(null),
    otpInput2: useRef(null),
    otpInput3: useRef(null),
    otpInput4: useRef(null),
    otpInput5: useRef(null),
    otpInput6: useRef(null),
  };

  // check is submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // on input change
  const handleOtpInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow the first character (if it's a digit) and clear the rest
    if (/^\d?$/.test(value)) {
      setOtpInputValues((prev) => ({ ...prev, [name]: value.charAt(0) }));
    }

    // Move to the next input if current is filled
    if (value.length === 1) {
      const nextInput = `otpInput${parseInt(name.replace('otpInput', '')) + 1}`;
      if (otpInputRefs[nextInput]) {
        otpInputRefs[nextInput].current.focus();
      }
    }

    // Handle backspace
    if (value === '' && e.nativeEvent.inputType === 'deleteContentBackward') {
      const prevInput = `otpInput${parseInt(name.replace('otpInput', '')) - 1}`;
      if (otpInputRefs[prevInput]) {
        otpInputRefs[prevInput].current.focus();
      }
    }
  }

  // submit otp
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // if any one also empty then return
    if (!otpInputValues?.otpInput1 || !otpInputValues?.otpInput2 || !otpInputValues?.otpInput3 || !otpInputValues?.otpInput4 || !otpInputValues?.otpInput5 || !otpInputValues?.otpInput6) {
      showAlert("Invalid OTP!", "danger", "top-right");
      setIsSubmitting(false);
      return;
    }

    // collect all number in one var
    const userOtp = Number(otpInputValues?.otpInput1 + otpInputValues?.otpInput2 + otpInputValues?.otpInput3 + otpInputValues?.otpInput4 + otpInputValues?.otpInput5 + otpInputValues?.otpInput6);
    setUserData((prev) => ({ ...prev, otp: userOtp }));

    try {
      // above setUserData is not sending updated otp
      const updatedUserData = { ...userData, otp: userOtp };
      const response = await fetch('/api/auth/credentials/register', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(updatedUserData)
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/user/login');
        showAlert(data?.msg || "User verified!", "success", "top-right");
      } else {
        showAlert(data?.msg || "failed to verify user!", "danger", "top-right");
      }
    } catch (error) {
      showAlert("Internal Server Error!", "danger", "top-right");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // masked email function resturn masked email
  const handleEmailMasked = () => {
    const [name, domain] = userData?.email?.split("@");
    if (name.length <= 2) return `****@${domain}`;
    return `${name.slice(0, 2)}****@${domain}`;
  }

  useEffect(() => {
    if (email) {
      // call and store masked email
      setMaskedEmail(handleEmailMasked());
    }
  }, [email]);

  return (
    <>
      {/* opt box */}
      <form
        onSubmit={handleOtpSubmit}
        className="bg-theme_4 rounded-md shadow-lg p-4 mx-6 text-base w-full md:w-3/4 lg:w-3/5 md:text-lg md:p-8 flex-col flex justify-center items-center"
      >
        <h3 className='text-2xl text-theme_1 playwrite_in_font font-semibold text-center md:text-4xl'>
          OTP Verification
        </h3>
        <p className='text-center pt-8 text-green-700'>
          Check Inbox of {maskedEmail}!
        </p>
        <div className="py-6 px-3 flex gap-12 max-sm:gap-4 max-lg:gap-8 md:py-4">
          {/* Render input fields */}
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <input
              key={num}
              type="text"
              className='w-11 max-sm:w-8 max-sm:p-3 sm:p-4 outline-none bg-theme_1 rounded-lg text-gray-600'
              value={otpInputValues[`otpInput${num}`]}
              onChange={handleOtpInputChange}
              name={`otpInput${num}`}
              ref={otpInputRefs[`otpInput${num}`]}
              maxLength={1}
            />
          ))}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-fit px-8 py-2 md:px-10 outline-none rounded-md shadow-md bg-theme_1 transition-all duration-300 ease-in-out ${isSubmitting ? 'cursor-not-allowed text-gray-500 bg-theme_1/50' : ''}`}
        >
          {isSubmitting
            ? (<>
              <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Submitting...
            </>)
            : 'Submit'
          }
        </button>
      </form>
    </>
  )
}

export default OtpInputBox
