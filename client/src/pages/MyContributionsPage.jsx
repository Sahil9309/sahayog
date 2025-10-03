import React, { useState, useEffect, useContext } from "react";
import {
  Heart,
  ArrowRight,
  Gift,
  Users,
  Star,
  Calendar,
  Target,
  Receipt,
  Eye,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

const MyContributionsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("contribute");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [progress, setProgress] = useState(0);

  // Contribution tracking state
  const [contributions, setContributions] = useState([]);
  const [contributionStats, setContributionStats] = useState({
    totalContributed: 0,
    totalContributions: 0,
    uniqueEventsSupported: 0,
  });
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [
    { value: 100, label: "₹100", description: "Basic Support" },
    { value: 500, label: "₹500", description: "Good Support" },
    { value: 1000, label: "₹1000", description: "Great Support" },
    { value: 2000, label: "₹2000", description: "Amazing Support" },
  ];

  useEffect(() => {
    if (user && activeTab === "history") {
      fetchContributions();
      fetchContributionStats();
    }
  }, [user, activeTab]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/contributions/my");
      setContributions(response.data.contributions);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast.error("Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  const fetchContributionStats = async () => {
    try {
      const response = await axios.get("/api/contributions/stats");
      setContributionStats(response.data);
    } catch (error) {
      console.error("Error fetching contribution stats:", error);
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            My Contributions
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your contributions.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Contributions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support amazing projects and track your contribution history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("contribute")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "contribute"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Gift className="h-4 w-4 inline mr-2" />
              Make Contribution
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Receipt className="h-4 w-4 inline mr-2" />
              Contribution History
            </button>
          </div>
        </div>

        {/* Contribution Tab */}
        {activeTab === "contribute" && (
          <>
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
          </>
        )}

        {/* Contribution History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Contributed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(contributionStats.totalContributed)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Contributions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contributionStats.totalContributions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Events Supported
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contributionStats.uniqueEventsSupported}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contributions List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Contributions
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading contributions...</p>
                </div>
              ) : contributions.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No contributions yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start supporting amazing projects today!
                  </p>
                  <button
                    onClick={() => setActiveTab("contribute")}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Make Your First Contribution
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contributions.map((contribution) => (
                    <div
                      key={contribution._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {contribution.eventId?.images?.[0]?.url ||
                          contribution.eventId?.imageUrl ? (
                            <img
                              src={
                                contribution.eventId.images?.[0]?.url ||
                                contribution.eventId.imageUrl
                              }
                              alt={contribution.eventId.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Heart className="h-8 w-8 text-teal-600" />
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {contribution.eventId?.title || "Event"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(contribution.amount)} •{" "}
                              {new Date(
                                contribution.createdAt,
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice: {contribution.invoiceNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              contribution.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : contribution.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {contribution.status}
                          </span>

                          {contribution.eventId && (
                            <Link
                              to={`/events/${contribution.eventId._id}`}
                              className="text-teal-600 hover:text-teal-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContributionsPage;
