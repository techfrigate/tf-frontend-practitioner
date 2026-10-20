import React, { useEffect, useRef } from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-[1.5px] flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-80"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Sign Out</h3>
        <p className="mb-4">Are you sure you want to sign out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-brand-600 rounded-lg text-white hover:bg-brand-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
