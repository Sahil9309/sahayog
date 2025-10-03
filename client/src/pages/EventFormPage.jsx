import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 1. Import useParams
import axios from "axios";
import { UserContext } from "../context/UserContext.js";
import {
  Upload,
  X,
  Plus,
  Target,
  FileText,
  Tag,
  Link as LinkIcon,
  Image,
  Star,
} from "lucide-react";

const EventFormPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams(); // 2. Get the event ID from the URL if it exists

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amountToRaise: "",
    tags: [],
    imageFiles: [],
    imageUrls: [], // Changed to support multiple URLs
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [favoriteImageIndex, setFavoriteImageIndex] = useState(0);

  // 3. New useEffect to fetch event data when in "edit" mode
  useEffect(() => {
    if (!id) {
      // If there's no ID, we are in "create" mode, so do nothing.
      return;
    }

    // If there is an ID, fetch the existing event data.
    axios
      .get(`/api/events/${id}`)
      .then((response) => {
        const { title, description, amountToRaise, tags, imageUrl } =
          response.data;
        setFormData({
          title,
          description,
          amountToRaise,
          tags: tags || [],
          imageUrls: [], // Reset URLs for editing
          imageFiles: [], // We don't pre-fill file inputs
        });

        // Set the image previews from existing images
        const existingImages = response.data.images || [];
        if (existingImages.length > 0) {
          setImagePreviews(
            existingImages.map((img, index) => ({
              url: img.url,
              isExisting: true,
              id: img._id,
              isStarred: img.isStarred,
              order: img.order || index,
            })),
          );
          // Set favorite image index based on starred image
          const starredIndex = existingImages.findIndex((img) => img.isStarred);
          setFavoriteImageIndex(starredIndex >= 0 ? starredIndex : 0);
        } else if (imageUrl) {
          setImagePreviews([
            {
              url: imageUrl,
              isExisting: true,
              id: "legacy",
              isStarred: true,
              order: 0,
            },
          ]);
          setFavoriteImageIndex(0);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch event data:", err);
        setError("Could not load event data for editing.");
      });
  }, [id]);

  // Redirect if user is not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError("Some images are larger than 5MB. Please choose smaller files.");
      return;
    }

    // Limit total number of images
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 10) {
      setError("Maximum 10 images allowed per event");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imageUrls: [], // Clear URLs when uploading files
    }));

    // Generate previews for new files
    const newPreviews = [];
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          url: reader.result,
          isExisting: false,
          file,
          isStarred: imagePreviews.length === 0 && index === 0, // First image is starred if no existing images
          order: imagePreviews.length + index,
        });
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          // Set favorite to first new image if no existing images
          if (imagePreviews.length === 0) {
            setFavoriteImageIndex(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageUrl = () => {
    const url = currentImageUrl.trim();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    // Check if URL already exists
    if (imagePreviews.some((preview) => preview.url === url)) {
      setError("This image URL has already been added");
      return;
    }

    // Limit total number of images
    if (imagePreviews.length >= 10) {
      setError("Maximum 10 images allowed per event");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, url],
      imageFiles: [], // Clear files when adding URLs
    }));

    const newPreview = {
      url,
      isExisting: false,
      isUrl: true,
      isStarred: imagePreviews.length === 0, // First image is starred
      order: imagePreviews.length,
    };

    setImagePreviews((prev) => [...prev, newPreview]);
    setCurrentImageUrl("");

    // Set favorite to first image if no existing images
    if (imagePreviews.length === 0) {
      setFavoriteImageIndex(0);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];

    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // Remove from form data if it's a new file
    if (!imageToRemove.isExisting && imageToRemove.file) {
      setFormData((prev) => ({
        ...prev,
        imageFiles: prev.imageFiles.filter(
          (file) => file !== imageToRemove.file,
        ),
      }));
    }

    // Remove from URLs if it's a URL-based image
    if (imageToRemove.isUrl) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((url) => url !== imageToRemove.url),
      }));
    }

    // Adjust favorite index if necessary
    if (favoriteImageIndex === index) {
      setFavoriteImageIndex(0); // Reset to first image
    } else if (favoriteImageIndex > index) {
      setFavoriteImageIndex(favoriteImageIndex - 1);
    }
  };

  const markAsFavorite = (index) => {
    setFavoriteImageIndex(index);
    setImagePreviews((prev) =>
      prev.map((preview, i) => ({
        ...preview,
        isStarred: i === index,
      })),
    );
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.amountToRaise || formData.amountToRaise <= 0) {
      setError("Please enter a valid amount to raise");
      return false;
    }
    return true;
  };

  // 4. Update handleSubmit to handle both create (POST) and edit (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("amountToRaise", formData.amountToRaise);
    submitData.append("tags", JSON.stringify(formData.tags));

    // Append multiple image files
    if (formData.imageFiles && formData.imageFiles.length > 0) {
      formData.imageFiles.forEach((file) => {
        submitData.append("images", file);
      });
    }

    // Append multiple image URLs
    if (formData.imageUrls && formData.imageUrls.length > 0) {
      formData.imageUrls.forEach((url) => {
        submitData.append("imageUrl", url);
      });
    }

    // Send favorite image index
    submitData.append("favoriteImageIndex", favoriteImageIndex);

    try {
      if (id) {
        // If ID exists, we are updating an existing event
        await axios.put(`/api/events/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Otherwise, we are creating a new event
        await axios.post("/api/events", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/my-campaigns"); // Redirect after success
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to ${id ? "update" : "create"} event`,
      );
      console.error(`Error ${id ? "updating" : "creating"} event:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            {/* 5. Dynamically change title based on mode */}
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-gray-600 mt-1">
              {id
                ? "Update the details of your campaign."
                : "Share your cause and rally community support"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {/* Form fields remain the same */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="amountToRaise"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Target className="h-4 w-4 mr-2" />
                Fundraising Goal (INR) *
              </label>
              <input
                type="number"
                id="amountToRaise"
                name="amountToRaise"
                value={formData.amountToRaise}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1"
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add tags and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-teal-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <Image className="h-4 w-4 mr-2" />
                Event Image
              </label>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="imageUpload"
                    className="block text-sm text-gray-600 mb-2"
                  >
                    Upload Image File
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple images (max 10, 5MB each)
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm text-gray-600 mb-2"
                  >
                    Add Image URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        id="imageUrl"
                        value={currentImageUrl}
                        onChange={(e) => setCurrentImageUrl(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addImageUrl())
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Preview ({imagePreviews.length} image
                      {imagePreviews.length > 1 ? "s" : ""}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div
                            className={`relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                              favoriteImageIndex === index
                                ? "border-yellow-400"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={preview.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Action buttons - Always visible on mobile, hover on desktop */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => markAsFavorite(index)}
                                className={`p-1 rounded-full transition-colors ${
                                  favoriteImageIndex === index
                                    ? "bg-yellow-500 text-white"
                                    : "bg-white/80 text-gray-600 hover:bg-yellow-100"
                                }`}
                                title="Mark as favorite"
                              >
                                <Star className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Status badges */}
                            <div className="absolute bottom-2 left-2 flex gap-1">
                              {preview.isExisting && (
                                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                  Existing
                                </div>
                              )}
                              {favoriteImageIndex === index && (
                                <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Favorite
                                </div>
                              )}
                              {preview.isUrl && (
                                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                                  URL
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {/* 6. Dynamically change button text based on mode */}
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : id ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventFormPage;
