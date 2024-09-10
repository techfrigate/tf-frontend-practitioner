import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router

const UnauthorizedModal = () => {
  const navigate = useNavigate();

  useEffect(() => {

      const timer = setTimeout(() => {
        // window.location.href =  "http://localhost:3002"
      }, 5000);
      return () => clearTimeout(timer);
  }, [navigate]);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-[400px] w-full p-6 h-full max-h-[200px]">
      <div className="text-center flex flex-col justify-center items-center  h-full w-full">
        <h2 className="text-2xl font-bold text-[#5ad6bb]">Unauthorized</h2>
        <p className="mt-4 text-gray-600">
          Your session has expired. Redirecting to login page in 5 seconds...
        </p>
      </div>
    </div>
  </div>
  );
};

export default UnauthorizedModal;
