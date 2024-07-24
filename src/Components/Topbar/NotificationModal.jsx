import React from 'react';

const NotificationModal = () => {
  return (
    <div className="absolute z-20 top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg  py-5 px-7 w-80">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <p className="text-gray-600">You have no new notifications.</p>
    </div>
  );
};

export default NotificationModal;
