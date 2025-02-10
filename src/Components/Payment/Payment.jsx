import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppointment } from '../../Store/appointmentSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Payment = ({setShowPayment}) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash');
const{appointment} =  useSelector(state=>state.appointment)
 const navigate =  useNavigate()

const dispatch=   useDispatch();

const handlePayment = async()=>{
  const {_id, bookingStatus:{_id:bookId,...rest}} =  appointment
  const paymentStatus =  "completed"
  const transactionId = "done32424kn"

  const body = {
    bookingStatus:{
      booked:new Date()
    },
    paymentStatus,
    transactionId
  }
  try {
    await dispatch(updateAppointment({_id,body})).unwrap()
 setShowPayment(false)
 navigate("/worklist")
    toast.success("Appointment Booked Successfully!")
  } catch (error) {
    toast.error(error)
  }

 
}

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Select a Payment Method</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              value="POS" 
              checked={paymentMethod === 'POS'} 
              onChange={() => setPaymentMethod('POS')} 
              className="mr-2" 
            />
            POS (Pay with Debit / Credit / ATM Cards)
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              value="Cash" 
              checked={paymentMethod === 'Cash'} 
              onChange={() => setPaymentMethod('Cash')} 
              className="mr-2" 
            />
            Cash
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              value="UPI" 
              checked={paymentMethod === 'UPI'} 
              onChange={() => setPaymentMethod('UPI')} 
              className="mr-2" 
            />
            Other UPI Apps
          </label>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Service: Appointment-Online</h2>
          <div className="flex justify-between mb-2">
            <span>Base Price</span>
            <span>₹ 600</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST(18%)</span>
            <span>₹ 108</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total Amount</span>
            <span>₹ 708</span>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Amount *</label>
            <input 
              type="text" 
              value="708" 
              readOnly 
              className="p-2 border rounded-md bg-gray-200" 
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <button className="bg-gray-500 text-white py-2 px-6 rounded-md transition transform hover:scale-105 hover:bg-gray-600 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button className="bg-[#00A182] text-white py-2 px-6 rounded-md transition transform hover:scale-105 hover:bg-[#008a6c] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A182]" onClick={handlePayment}>
            Add Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
