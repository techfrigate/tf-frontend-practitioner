// NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 text-blue-500 hover:underline">Go Back to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
