import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedModal = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const SignIn_URL  = process.env.REACT_APP_SIGNIN_URL

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const timer = setTimeout(() => {
      window.location.href = SignIn_URL;
    }, 5000);

     
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-[400px] w-full p-6 h-full max-h-[200px]">
        <div className="text-center flex flex-col justify-center items-center  h-full w-full">
          <h2 className="text-2xl font-bold text-[#5ad6bb]">Unauthorized</h2>
          <p className="mt-4 text-gray-600">
            Your session has expired. Redirecting to login page in {countdown}{" "}
            second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;
