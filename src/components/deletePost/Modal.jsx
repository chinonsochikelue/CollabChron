// components/Modal.js
"use client";

import { useEffect, useRef } from "react";

const Modal = ({ onClose, children }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Close modal on `Esc` key press
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  // Focus trapping
  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    modalRef.current.focus();

    return () => {
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative transform transition-transform duration-300 scale-95 focus:outline-none"
        tabIndex="-1"
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
