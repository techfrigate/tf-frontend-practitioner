import React from 'react';

const NotificationModal = () => {
  return (
    <div className="absolute z-40 top-12 right-0 w-80 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-lg">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <p className="text-gray-600">You have no new notifications.</p>
    </div>
  );
};

export default NotificationModal;
