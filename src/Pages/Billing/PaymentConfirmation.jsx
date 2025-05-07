import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReceiptIndianRupee, ArrowLeft, Printer } from 'lucide-react';
import BillPDF from './BillPDF';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const billing = location.state?.billing;

  if (!billing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No billing information found</h2>
          <button 
            onClick={() => navigate('/billing')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#00A182] text-white rounded-md hover:bg-[#008a6c]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Billing
          </button>
        </div>
      </div>
    );
  }

  const {
    billId,
    patientName,
    doctorName,
    services = [],
    totalAmount = 0,
    gst = 0,
    doctorFees = 0,
    dueAmount = 0,
    status
  } = billing;
console.log(billing)
  const totalWithGST = totalAmount + gst + doctorFees;
  const paidAmount = totalWithGST - dueAmount;

  const formattedBills = services && services.length > 0 
    ? services.map(service => ({
        serviceType: 'Medical Service',
        name: service.name,
        amount: (service.price * service.quantity).toLocaleString()
      }))
    : [];

  return (
    <div className="customScrollbar max-h-full w-full bg-gray-100 p-6">
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <ReceiptIndianRupee className="w-8 h-8 text-[#00A182]" />
              <h1 className="text-2xl font-bold text-gray-800">Payment Confirmation</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status ? 'Paid' : 'Partially Paid'}
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bill ID</h3>
                <p className="mt-1 text-lg font-semibold">{billId || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                <p className="mt-1 text-lg font-semibold">{patientName || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor Name</h3>
                <p className="mt-1 text-lg font-semibold">{doctorName || 'N/A'}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              {services && services.length > 0 ? (
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{service.name} × {service.quantity}</span>
                      <span className="font-medium">₹{(service.price * service.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No services found</p>
              )}
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Doctor Fees</span>
                  <span>₹{doctorFees.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalWithGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Paid Amount</span>
                    <span>₹{paidAmount.toFixed(2)}</span>
                  </div>
                  {dueAmount > 0 && (
                    <div className="flex justify-between text-red-600 font-medium">
                      <span>Due Amount</span>
                      <span>₹{dueAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button 
                onClick={() => navigate('/billing')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Billing
              </button>
              <BillPDF
                hospitalLogo="https://thumbs.dreamstime.com/b/hospital-logo-icon-hospital-logo-icon-135146804.jpg"
                bills={formattedBills}
                totalAmount={totalAmount}
                gst={gst}
                doctorFees={doctorFees}
                finalAmount={totalWithGST}
              />
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center px-6 py-2 bg-[#00A182] text-white rounded-md hover:bg-[#008a6c]"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;