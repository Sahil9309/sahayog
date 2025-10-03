import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import LazyImage from "../components/LazyImage";
import {
  ArrowLeft,
  Calendar,
  User,
  Target,
  Heart,
  Share2,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  MapPin,
  Users,
} from "lucide-react";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");

  const predefinedAmounts = [100, 500, 1000, 2000];

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError("Failed to fetch event details");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = (amount) => {
    if (!user) {
      toast.error("Please login to contribute");
      return;
    }
    navigate("/checkout", {
      state: {
        amount,
        eventId: event._id,
        eventTitle: event.title,
      },
    });
  };

  const handleImageStar = async (imageId) => {
    if (!user || event.createdBy._id !== user._id) {
      toast.error("Not authorized to modify this event");
      return;
    }

    try {
      await axios.patch(`/api/events/${id}/images/${imageId}/star`);
      await fetchEventDetails(); // Refresh event data
      toast.success("Image star status updated");
    } catch (err) {
      toast.error("Failed to update image");
      console.error("Error updating image:", err);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!user || event.createdBy._id !== user._id) {
      toast.error("Not authorized to modify this event");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await axios.delete(`/api/events/${id}/images/${imageId}`);
      await fetchEventDetails(); // Refresh event data
      toast.success("Image deleted successfully");

      // Adjust selected image index if necessary
      if (selectedImageIndex >= event.images.length - 1) {
        setSelectedImageIndex(Math.max(0, event.images.length - 2));
      }
    } catch (err) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDisplayImages = () => {
    if (!event) return [];

    // Combine new images array with legacy imageUrl for backward compatibility
    const images = [...(event.images || [])];

    // Add legacy image if it exists and isn't already in images array
    if (event.imageUrl && !images.some((img) => img.url === event.imageUrl)) {
      images.unshift({
        _id: "legacy",
        url: event.imageUrl,
        publicId: event.imagePublicId || "",
        isStarred: true,
        order: -1,
        uploadedAt: event.createdAt,
      });
    }

    return images.sort((a, b) => a.order - b.order);
  };

  const nextImage = () => {
    const images = getDisplayImages();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getDisplayImages();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The event you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const displayImages = getDisplayImages();
  const progress = getProgressPercentage(
    event.currentAmount,
    event.amountToRaise,
  );
  const isOwner = user && event.createdBy._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/events")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </button>

            {isOwner && (
              <Link
                to={`/edit-event/${event._id}`}
                className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {displayImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="relative">
                  <LazyImage
                    src={displayImages[selectedImageIndex]?.url}
                    alt={event.title}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />

                  {/* Image Navigation */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Actions (for owner) */}
                  {isOwner &&
                    displayImages[selectedImageIndex]?._id !== "legacy" && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() =>
                            handleImageStar(
                              displayImages[selectedImageIndex]._id,
                            )
                          }
                          className={`p-2 rounded-full transition-colors ${
                            displayImages[selectedImageIndex]?.isStarred
                              ? "bg-yellow-500 text-white"
                              : "bg-white/80 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleImageDelete(
                              displayImages[selectedImageIndex]._id,
                            )
                          }
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                  {/* Image Counter */}
                  {displayImages.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {displayImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {displayImages.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto">
                      {displayImages.map((image, index) => (
                        <button
                          key={image._id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === selectedImageIndex
                              ? "border-teal-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${event.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {image.isStarred && (
                            <div className="absolute top-1 right-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {event.title}
                </h1>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Creator Info */}
              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                {event.createdBy?.avatar ? (
                  <img
                    src={event.createdBy.avatar}
                    alt={event.createdBy.firstName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-lg font-medium mr-4">
                    {event.createdBy?.firstName?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {event.createdBy?.firstName} {event.createdBy?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.createdBy?.username &&
                      `@${event.createdBy.username} • `}
                    Created {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Event
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contribution Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(event.currentAmount)}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {formatCurrency(event.amountToRaise)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  {progress.toFixed(1)}% funded
                </p>
              </div>

              {/* Contribution Buttons */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">
                  Quick Contribute
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleContribute(amount)}
                      className="p-3 border border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-center"
                    >
                      <div className="font-semibold text-gray-900">
                        ₹{amount}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="1"
                  />
                  <button
                    onClick={() =>
                      contributionAmount &&
                      handleContribute(parseInt(contributionAmount))
                    }
                    disabled={
                      !contributionAmount || parseInt(contributionAmount) <= 0
                    }
                    className="px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Contribute
                  </button>
                </div>
              </div>

              {/* Event Stats */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created {new Date(event.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="h-4 w-4 mr-2" />
                  Goal: {formatCurrency(event.amountToRaise)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.isActive ? "Active Campaign" : "Campaign Ended"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            <img
              src={displayImages[selectedImageIndex]?.url}
              alt={event.title}
              className="max-w-full max-h-full object-contain"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
