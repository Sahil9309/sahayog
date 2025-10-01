import React, { useState } from "react";
import { Heart, ArrowRight, Gift, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyContributionsPage = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [progress, setProgress] = useState(0);

  const predefinedAmounts = [
    { value: 100, label: "₹100", description: "Basic Support" },
    { value: 500, label: "₹500", description: "Good Support" },
    { value: 1000, label: "₹1000", description: "Great Support" },
    { value: 2000, label: "₹2000", description: "Amazing Support" },
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    // Animate progress bar
    setProgress(Math.min((amount / 2000) * 100, 100));
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value));
      setProgress(Math.min((parseInt(value) / 2000) * 100, 100));
    }
  };

  const handleContribute = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (amount && amount > 0) {
      navigate("/checkout", { state: { amount } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Contribution
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support amazing projects and help creators bring their ideas to life
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Contribution Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹1000</span>
            <span>₹2000+</span>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Gift className="h-6 w-6 mr-3 text-blue-500" />
            Choose Your Contribution
          </h2>

          {/* Predefined Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => handleAmountSelect(amount.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedAmount === amount.value
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {amount.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {amount.description}
                  </div>
                  {selectedAmount === amount.value && (
                    <Star className="h-5 w-5 text-blue-500 mx-auto mt-2" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or enter a custom amount:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                ₹
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <Users className="h-6 w-6 mr-3" />
            Your Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1,234</div>
              <div className="text-blue-100">Projects Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹5.6M</div>
              <div className="text-blue-100">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">89%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Contribute Button */}
        <div className="text-center">
          <button
            onClick={handleContribute}
            disabled={!selectedAmount && !customAmount}
            className={`inline-flex items-center px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
              selectedAmount || customAmount
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Checkout
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyContributionsPage;
