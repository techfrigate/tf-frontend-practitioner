import React from 'react';
import { FaRegClock } from 'react-icons/fa';

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-r">
      <div className="flex flex-col items-center bg-white p-12 rounded-3xl shadow-2xl max-w-md space-y-6 transform transition-all hover:scale-105 hover:shadow-3xl">
        <FaRegClock className="text-6xl text-indigo-600 animate-pulse" />
        <h2 className="text-4xl font-bold text-gray-800 text-center leading-tight">
          Coming Soon
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          We're working on something amazing. Stay tuned for exciting updates!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
