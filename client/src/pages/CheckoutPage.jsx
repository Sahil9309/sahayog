import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  Mail,
  CheckCircle,
  Download,
  ArrowLeft,
  Receipt,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, eventId, eventTitle } = location.state || { amount: 0 };

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const generateInvoiceNumber = () => {
    return `INV-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  };

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      const invoice = {
        invoiceNumber: generateInvoiceNumber(),
        amount: amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        email: email,
        status: "Paid",
        transactionId: `TXN-${Date.now()}`,
        paymentMethod: "Credit Card",
        description: `Contribution to ${eventTitle || "Sahayog Platform"}`,
      };

      try {
        // Record contribution in database
        if (eventId) {
          await axios.post("/api/contributions", {
            eventId,
            amount,
            email,
            transactionId: invoice.transactionId,
            invoiceNumber: invoice.invoiceNumber,
            paymentMethod: "Credit Card",
          });
        }

        setInvoiceData(invoice);
        setIsSuccess(true);

        // Send email invoice
        try {
          await axios.post("/api/send-invoice", invoice);
          toast.success(
            "Contribution recorded and invoice sent to your email!",
          );
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          toast.success("Contribution recorded successfully!");
        }
      } catch (error) {
        console.error("Contribution recording failed:", error);
        toast.error("Payment processing failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };

  const downloadInvoice = () => {
    if (!invoiceData) return;

    const invoiceContent = `
SAHAYOG PLATFORM - INVOICE

Invoice Number: ${invoiceData.invoiceNumber}
Date: ${invoiceData.date}
Time: ${invoiceData.time}
Transaction ID: ${invoiceData.transactionId}

Bill To:
${invoiceData.email}

Description: ${invoiceData.description}
Amount: ₹${invoiceData.amount}
Payment Method: ${invoiceData.paymentMethod}
Status: ${invoiceData.status}

Thank you for your contribution to Sahayog Platform!
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceData.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your contribution of ₹{amount}. Your support means a
              lot!
            </p>

            {/* Invoice Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Invoice Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Invoice:</span>
                  <span className="ml-2 font-medium">
                    {invoiceData?.invoiceNumber}
                  </span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">{invoiceData?.date}</span>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 font-medium">
                    ₹{invoiceData?.amount}
                  </span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Transaction:</span>
                  <span className="ml-2 font-medium">
                    {invoiceData?.transactionId}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadInvoice}
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              A copy of this invoice has been sent to {invoiceData?.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contribution
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your contribution of ₹{amount}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-blue-500" />
              Payment Details
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
            >
              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Invoice will be sent to this email
                </p>
              </div>

              {/* Mock Payment Fields */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="4111 1111 1111 1111"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="12/25"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="123"
                    disabled
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !email}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                } text-white`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${amount}`
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo. No actual payment will be processed.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Contribution Amount</span>
                <span className="font-semibold">₹{amount}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold text-green-600">₹0</span>
              </div>

              <div className="flex justify-between items-center py-3 text-lg font-bold">
                <span>Total</span>
                <span>₹{amount}</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Your Contribution Includes:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Digital receipt via email
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Contribution tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Project updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Community recognition
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
