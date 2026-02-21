"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUI } from '@context/UIContext';
import Link from 'next/link';

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
    if (userData?.email) {
      // call and store masked email
      setMaskedEmail(handleEmailMasked());
    }
  }, [userData?.email]);

  return (
    <form
      onSubmit={handleOtpSubmit}
      className="w-full flex flex-col items-center space-y-8"
    >
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          OTP Verification
        </h2>
        <p className="text-gray-300 mt-3 text-sm">
          Enter the 6-digit code sent to
        </p>
        <p className="text-green-400 font-medium text-sm mt-1">
          {maskedEmail}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <input
            key={num}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpInputValues[`otpInput${num}`]}
            onChange={handleOtpInputChange}
            name={`otpInput${num}`}
            ref={otpInputRefs[`otpInput${num}`]}
            className="w-12 h-14 text-center text-xl font-semibold 
                     bg-white/20 text-white 
                     border border-white/30 
                     rounded-lg 
                     focus:outline-none 
                     focus:ring-2 focus:ring-white/40 
                     transition duration-300"
          />
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full max-w-xs py-3 rounded-lg font-semibold text-white transition duration-300 ${isSubmitting
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
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="text-center mt-4">
        <Link
          href="/dashboard"
          className="text-gray-600 text-sm hover:text-gray-800 cursor-pointer transition no-underline hover:underline"
        >
          Continue as Guest
        </Link>
      </div>
    </form>

  )
}

export default OtpInputBox
