"use client";

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

const AlertBox = ({ show, setShow, variant, dismissible, header, position }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      // Cleanup the timer on component unmount or when show changes
      return () => clearTimeout(timer);
    }

  }, [show, setShow]);

  if (!show) return null;

  // Determine position classes based on the `position` prop
  const positionClasses = {
    'top-right': 'top-5 right-5',
    'top-right-with-space': 'my-2 top-16 md:top-28 right-0 md:right-5',
    'top-left': 'top-5 left-5',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
  };

  return (
    <div className={`fixed z-50 py-2 px-3 opacity-80 transition-all duration-300 ease-in-out ${positionClasses[position] || 'top-5 right-5'}`}>
      <Alert
        variant={variant}
        onClose={() => setShow(false)}
        dismissible={dismissible}
      >
        <span className="text-sm md:text-base">
          {header}
        </span>
      </Alert>
    </div>
  );
};

export default AlertBox;
