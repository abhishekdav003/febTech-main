import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";

const FORM_ACTION_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLScvPggXL6sdSvu3eeEx8TmGwXdbV-ZBdME18f5w437auA00wg/formResponse?pli=1";

const ENTRY_IDS = {
  name: "entry.1393499013",
  email: "entry.1556130701",
  phone: "entry.1366914006",
  service: "entry.532933575",
  message: "entry.1597515378",
};

const SERVICES = [
  "Website Development",
  "Software Development",
  "SEO",
  "Payment Gateway",
  "Graphic Design",
  "SMM",
  "E-Commerce Website",
  "E-Commerce Management",
];

const PopUpContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const iframeRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Show popup after delay on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isClosed) {
        setIsVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isClosed]);

  // Handle close
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setIsClosed(true);
  }, []);

  // Handle form submission
  const onSubmit = useCallback((data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = FORM_ACTION_URL;
    form.target = "hidden_iframe";
    form.style.display = "none";

    const fields = [
      { name: ENTRY_IDS.name, value: data.fullName },
      { name: ENTRY_IDS.email, value: data.email },
      { name: ENTRY_IDS.phone, value: data.phone },
      { name: ENTRY_IDS.service, value: data.service },
      { name: ENTRY_IDS.message, value: data.message },
    ];

    fields.forEach(({ name, value }) => {
      const input = document.createElement("input");
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      reset();
      document.body.removeChild(form);

      setTimeout(() => {
        handleClose();
      }, 2500);
    }, 1500);
  }, [reset, handleClose]);

  const inputClasses =
    "w-full py-2.5 pl-10 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80";

  return (
    <>
      <iframe
        name="hidden_iframe"
        title="Form submission frame"
        style={{ display: "none" }}
        ref={iframeRef}
      />

      <AnimatePresence>
        {isVisible && !isClosed && (
          <motion.div
            className="fixed bottom-5 right-3 md:right-6 lg:right-10 z-50"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative w-80 rounded-2xl bg-gradient-to-br from-white to-blue-50/50 shadow-2xl backdrop-blur-xl border border-blue-100 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-green-400" />

              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-all duration-200 hover:rotate-90"
                aria-label="Close popup"
              >
                <MdClose size={18} />
              </button>

              <div className="p-5 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <BsChatDotsFill size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Enquire Now
                    </h2>
                    <p className="text-xs text-gray-500">
                      We'll get back to you shortly
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3"
                      >
                        <svg
                          className="w-8 h-8 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-lg font-semibold text-gray-800">
                        Thank You!
                      </p>
                      <p className="text-sm text-gray-500">
                        Your enquiry has been submitted
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="space-y-1">
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                      <input
                        {...register("fullName", { required: "Full name is required" })}
                        className={inputClasses}
                        placeholder="Full Name"
                        autoComplete="name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 pl-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter valid 10-digit number",
                          },
                        })}
                        className={inputClasses}
                        placeholder="Phone Number"
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 pl-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email",
                          },
                        })}
                        className={inputClasses}
                        placeholder="Email Address"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                      <select
                        {...register("service", { required: "Please select a service" })}
                        className={`${inputClasses} cursor-pointer`}
                      >
                        <option value="">Select Service</option>
                        {SERVICES.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.service && (
                      <p className="text-xs text-red-500 pl-1">{errors.service.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <textarea
                      {...register("message", { required: "Message is required" })}
                      className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 resize-none"
                      placeholder="Your Message"
                      rows="2"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 pl-1">{errors.message.message}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-white text-sm transition-all duration-200 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <IoSend size={14} /> Submit Enquiry
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PopUpContact;