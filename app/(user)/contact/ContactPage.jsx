"use client";

import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "@context/UIContext";

const ContactPage = () => {
  const { data: session, status } = useSession();
  const { showAlert, showModal } = useUI();

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // confirmation to submit
  const handleConfirmation = (e) => {
    e.preventDefault();

    if (!contactForm?.message || !contactForm?.subject) {
      showAlert("All Field Requied!", "danger");
      return;
    }

    showModal({
      title: "Confirmation",
      body: `Do you really want to send form which has subject: "${contactForm?.subject} ?"`,
      actionBtn: "Confirm",
      actionBtnVariant: "success",
      confirmAction: async () => await handleSubmit(),
    });
  };

  // finally submit
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/user/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response?.ok) {
        showAlert(data?.msg || "Contact details submitted!", "success");
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        return;
      }

      showAlert(data?.msg || "Error while submutting form!", "danger");
    } catch (error) {
      console.log("error while submiting form", error);
      showAlert("Internal Server Error", "danger");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setContactForm((prev) => ({
        ...prev,
        email: session?.user?.email,
      }));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-indigo-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-5 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div
          className="
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full
        bg-indigo-50 dark:bg-indigo-500/[0.08]
        border border-indigo-100 dark:border-indigo-500/20
        text-indigo-600 dark:text-indigo-300
        text-[10px] sm:text-xs font-semibold
        tracking-[0.18em] uppercase
        mb-3 md:mb-4
      "
        >
          Get In Touch
        </div>

        <h1
          className="
        text-2xl sm:text-3xl md:text-5xl
        font-bold tracking-tight
        text-gray-900 dark:text-gray-100
        leading-tight
        montserrat_alternates_font
      "
        >
          Contact Us
        </h1>

        <p
          className="
        mt-3 max-w-2xl
        text-sm sm:text-base
        text-gray-500 dark:text-gray-400
        leading-relaxed
      "
        >
          Have a question, suggestion, feedback, or facing an issue?
          Fill out the form below and we’ll get back to you as soon as possible.
        </p>
      </div>

      {/* Form Card */}
      <div
        className="
      rounded-2xl md:rounded-3xl
      border border-gray-200 dark:border-gray-100/[0.08]
      bg-gray-100 dark:bg-[#0f172a]
      shadow-sm
      p-4 sm:p-5 md:p-8
    "
      >
        <form
          onSubmit={handleConfirmation}
          className="flex flex-col gap-5 md:gap-6"
        >
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="
              mb-2 block text-sm font-medium
              text-gray-700 dark:text-gray-300
            "
              >
                Name
              </label>

              <Form.Control
                id="name"
                type="text"
                placeholder="Enter your name"
                value={contactForm?.name || ""}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="
              rounded-xl md:rounded-2xl
              !py-3 !px-4
              text-sm md:text-base
              !bg-gray-50 dark:!bg-gray-100/[0.04]
              !text-gray-900 dark:!text-gray-100
              !border-gray-200 dark:!border-gray-100/[0.08]
              placeholder:!text-gray-400 dark:placeholder:!text-gray-500
              focus:!border-indigo-500
              focus:!ring-2 focus:!ring-indigo-500/20
              shadow-none
            "
              />
            </div>

            {/* Email */}
            {status !== "authenticated" && (
              <div>
                <label
                  htmlFor="email"
                  className="
                mb-2 block text-sm font-medium
                text-gray-700 dark:text-gray-300
              "
                >
                  Email
                </label>

                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={contactForm?.email || ""}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="
                rounded-xl md:rounded-2xl
                !py-3 !px-4
                text-sm md:text-base
                !bg-gray-50 dark:!bg-gray-100/[0.04]
                !text-gray-900 dark:!text-gray-100
                !border-gray-200 dark:!border-gray-100/[0.08]
                placeholder:!text-gray-400 dark:placeholder:!text-gray-500
                focus:!border-indigo-500
                focus:!ring-2 focus:!ring-indigo-500/20
                shadow-none
              "
                />
              </div>
            )}

            {/* Subject */}
            <div className="md:col-span-2">
              <label
                htmlFor="subject"
                className="
              mb-2 block text-sm font-medium
              text-gray-700 dark:text-gray-300
            "
              >
                Subject
              </label>

              <Form.Control
                id="subject"
                type="text"
                placeholder="Enter subject"
                value={contactForm?.subject || ""}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                className="
              rounded-xl md:rounded-2xl
              !py-3 !px-4
              text-sm md:text-base
              !bg-gray-50 dark:!bg-gray-100/[0.04]
              !text-gray-900 dark:!text-gray-100
              !border-gray-200 dark:!border-gray-100/[0.08]
              placeholder:!text-gray-400 dark:placeholder:!text-gray-500
              focus:!border-indigo-500
              focus:!ring-2 focus:!ring-indigo-500/20
              shadow-none
            "
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label
                htmlFor="message"
                className="
              mb-2 block text-sm font-medium
              text-gray-700 dark:text-gray-300
            "
              >
                Message
              </label>

              <Form.Control
                id="message"
                as="textarea"
                placeholder="Write your message..."
                value={contactForm?.message || ""}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                style={{
                  minHeight: "160px",
                  resize: "none",
                }}
                className="
              rounded-xl md:rounded-2xl
              !py-3 !px-4
              text-sm md:text-base
              !bg-gray-50 dark:!bg-gray-100/[0.04]
              !text-gray-900 dark:!text-gray-100
              !border-gray-200 dark:!border-gray-100/[0.08]
              placeholder:!text-gray-400 dark:placeholder:!text-gray-500
              focus:!border-indigo-500
              focus:!ring-2 focus:!ring-indigo-500/20
              shadow-none
            "
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-stretch sm:justify-end">
            <button
              type="submit"
              className="
            w-full sm:w-auto
            relative overflow-hidden
            px-6 sm:px-8 py-3
            rounded-xl md:rounded-2xl
            bg-indigo-600 hover:bg-indigo-500
            dark:bg-indigo-500 dark:hover:bg-indigo-400
            text-gray-100
            font-semibold
            text-sm md:text-base
            shadow-lg shadow-indigo-500/20
            transition-all duration-300
            hover:scale-[1.02]
            active:scale-[0.98]
          "
            >
              <span className="relative z-10">
                Submit Message
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage
