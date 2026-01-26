"use client";

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from 'react';

import AlertBox from '@components/Alert';
import ModalBox from '@components/Modal';
import useMetadata from '@hooks/metadata';
import { useSession } from 'next-auth/react';


const ContactUs = () => {
  // set title for page
  useMetadata(`Contact Us - Blogotypo`, `Contact with developer for any help, support or query`);

  const { data: session, status } = useSession();

  const [contactForm, setContactForm] = useState(null);

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  // modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    body: '',
    actionBtn: '',
    actionBtnVariant: '',
    confirmAction: () => { }
  });

  // confirmation to submit 
  const handleConfirmation = (e) => {
    e.preventDefault();

    if (!contactForm?.message || !contactForm?.subject) {
      setAlertData((prev) => ({ ...prev, header: "All Field Requied!", variant: "danger" }));
      setShowAlert(true);
      return;
    }

    setModalData({
      title: 'Confirmation',
      body: `Do you really want to send form which has subject: "${contactForm?.subject} ?"`,
      actionBtn: "Confirm",
      actionBtnVariant: "success",
      confirmAction: () => handleSubmit(),
    })
    setShowModal(true);
  }
  // finally submit
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/contact', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (response?.ok) {
        setAlertData((prev) => ({ ...prev, header: data?.msg, variant: "success" }));
        setContactForm(null);
        return;
      }

      setAlertData((prev) => ({ ...prev, header: data?.msg, variant: "danger" }));
    } catch (error) {
      console.log('error while submiting form', error);
      setAlertData((prev) => ({ ...prev, header: 'Internal Server Error', variant: "danger" }));
    } finally {
      setShowModal(false);
      setShowAlert(true);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setContactForm((prev) => ({ ...prev, email: session?.user?.email }));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-purple-600 rounded-full" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleConfirmation} className='flex flex-col gap-4 items-start'>
        <h3 className="montserrat_alternates_font font-bold text-lg md:text-2xl lg:text-3xl">
          Contact Us
        </h3>

        <div className="flex flex-col gap-4 w-full">
          <FloatingLabel
            controlId="name"
            label="Name"
            className='shadow-md'
          >
            <Form.Control
              type="text"
              placeholder="Name"
              value={contactForm?.name}
              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </FloatingLabel>
          {status !== "authenticated" &&
            <FloatingLabel
              controlId="email"
              label="Email"
              className='shadow-md'
            >
              <Form.Control
                type="text"
                placeholder="Email"
                value={contactForm?.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </FloatingLabel>
          }
          <FloatingLabel
            controlId="subject"
            label="Subject"
            className='shadow-md'
          >
            <Form.Control
              type="text"
              placeholder="Subject"
              value={contactForm?.subject}
              onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="message"
            label="Message"
            className='shadow-md'
          >
            <Form.Control
              as="textarea"
              placeholder="Message"
              style={{ height: '100px' }}
              value={contactForm?.message}
              onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
            />
          </FloatingLabel>
        </div>

        <button
          type="submit"
          className={`relative overflow-hidden bg-theme_4 text-theme_1 px-8 py-2 font-semibold rounded-lg hover:text-white transition-all duration-500 group shadow-md`}
        >
          <span
            className="absolute inset-0 bg-theme_5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
          />
          <span className="relative z-10">
            Submit
          </span>
        </button>

      </form>


      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />

      <ModalBox
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalData.title}
        body={modalData.body}
        actionBtn={modalData.actionBtn}
        actionBtnVariant={modalData.actionBtnVariant}
        confirmAction={modalData.confirmAction}
      />
    </>

  )
}

export default ContactUs
