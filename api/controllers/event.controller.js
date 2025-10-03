// controllers/event.controller.js

const Event = require("../models/Event.js");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// POST /events
const createEvent = async (req, res) => {
  try {
    const { title, description, amountToRaise, imageUrl } = req.body;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const eventData = {
      title,
      description,
      amountToRaise,
      tags,
      createdBy: req.user.id,
      images: [],
    };

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(async (file, index) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "sahayog-events",
            resource_type: "image",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          });

          // Clean up temporary file
          fs.unlinkSync(file.path);

          return {
            url: result.secure_url,
            publicId: result.public_id,
            isStarred: index === 0, // First image is starred by default
            order: index,
            uploadedAt: new Date(),
          };
        });

        eventData.images = await Promise.all(uploadPromises);

        // Set legacy fields for backward compatibility (first image)
        if (eventData.images.length > 0) {
          eventData.imageUrl = eventData.images[0].url;
          eventData.imagePublicId = eventData.images[0].publicId;
        }
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        // Clean up temporary files even if upload fails
        if (req.files) {
          req.files.forEach((file) => {
            try {
              fs.unlinkSync(file.path);
            } catch (cleanupError) {
              console.error("Failed to clean up temp file:", cleanupError);
            }
          });
        }
        return res
          .status(422)
          .json({ error: "Image upload failed. Please try again." });
      }
    } else if (req.file) {
      // Handle single file upload (backward compatibility)
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sahayog-events",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        eventData.images = [
          {
            url: result.secure_url,
            publicId: result.public_id,
            isStarred: true,
            order: 0,
            uploadedAt: new Date(),
          },
        ];

        // Set legacy fields
        eventData.imageUrl = result.secure_url;
        eventData.imagePublicId = result.public_id;

        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error("Failed to clean up temp file:", cleanupError);
          }
        }
        return res
          .status(422)
          .json({ error: "Image upload failed. Please try again." });
      }
    } else if (imageUrl) {
      // Use provided image URL (backward compatibility)
      eventData.imageUrl = imageUrl;
      eventData.images = [
        {
          url: imageUrl,
          publicId: "", // No public ID for external URLs
          isStarred: true,
          order: 0,
          uploadedAt: new Date(),
        },
      ];
    }

    const eventDoc = await Event.create(eventData);
    await eventDoc.populate(
      "createdBy",
      "firstName lastName email avatar username",
    );
    res.status(201).json(eventDoc);
  } catch (e) {
    console.error("EVENT CREATION FAILED:", e);

    // Clean up temporary files if they exist
    if (req.files) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error("Failed to clean up temp file:", cleanupError);
        }
      });
    } else if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up temp file:", cleanupError);
      }
    }

    // Provide specific feedback for Mongoose validation errors
    if (e.name === "ValidationError") {
      const messages = Object.values(e.errors).map((val) => val.message);
      return res
        .status(422)
        .json({ error: `Validation Error: ${messages.join(", ")}` });
    }
    // Handle bad JSON in the 'tags' field
    if (e instanceof SyntaxError) {
      return res.status(422).json({ error: "Invalid format for tags." });
    }

    res.status(422).json({ error: e.message });
  }
};

// ... (the rest of the controller functions remain the same)

// GET /events
const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, tags, isActive = true } = req.query;
    const query = { isActive: isActive === "true" };
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    const events = await Event.find(query)
      .populate("createdBy", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Event.countDocuments(query);
    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "firstName lastName email avatar",
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /my-events
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id })
      .populate("createdBy", "firstName lastName email avatar")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUT /events/:id
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this event" });
    }

    const { title, description, amountToRaise, imageUrl } = req.body;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : event.tags;

    const updateData = {
      title: title || event.title,
      description: description || event.description,
      amountToRaise: amountToRaise || event.amountToRaise,
      tags,
    };

    // Handle image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if it exists
        if (event.imagePublicId) {
          await cloudinary.uploader.destroy(event.imagePublicId);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sahayog-events",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        updateData.imageUrl = result.secure_url;
        updateData.imagePublicId = result.public_id;

        // Clean up temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        // Clean up temporary file even if upload fails
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error("Failed to clean up temp file:", cleanupError);
          }
        }
        return res
          .status(422)
          .json({ error: "Image upload failed. Please try again." });
      }
    } else if (imageUrl && imageUrl !== event.imageUrl) {
      // Delete old Cloudinary image if switching to URL
      if (event.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(event.imagePublicId);
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError);
        }
      }
      updateData.imageUrl = imageUrl;
      updateData.imagePublicId = null;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("createdBy", "firstName lastName email avatar");
    res.json(updatedEvent);
  } catch (e) {
    // Clean up temporary file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up temp file:", cleanupError);
      }
    }
    res.status(422).json({ error: e.message });
  }
};

// DELETE /events/:id
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this event" });
    }

    // Delete image from Cloudinary if it exists
    if (event.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(event.imagePublicId);
      } catch (deleteError) {
        console.error("Failed to delete image from Cloudinary:", deleteError);
        // Continue with event deletion even if image deletion fails
      }
    }

    await Event.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PATCH /events/:id/contribute
const contributeToEvent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid contribution amount" });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    event.currentAmount += Number(amount);
    await event.save();
    res.json({
      message: "Donation recorded successfully",
      currentAmount: event.currentAmount,
      progress: (event.currentAmount / event.amountToRaise) * 100,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PATCH /events/:id/images/:imageId/star
const toggleImageStar = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this event" });
    }

    const image = event.images.id(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    image.isStarred = !image.isStarred;
    await event.save();

    res.json({ message: "Image star status updated", image });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /events/:id/images/:imageId
const deleteEventImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this event" });
    }

    const image = event.images.id(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Delete from Cloudinary if it has a public ID
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (deleteError) {
        console.error("Failed to delete image from Cloudinary:", deleteError);
      }
    }

    // Remove image from array
    event.images.pull(imageId);

    // Update legacy fields if this was the primary image
    if (event.imagePublicId === image.publicId) {
      const remainingImages = event.images;
      if (remainingImages.length > 0) {
        event.imageUrl = remainingImages[0].url;
        event.imagePublicId = remainingImages[0].publicId;
      } else {
        event.imageUrl = null;
        event.imagePublicId = null;
      }
    }

    await event.save();
    res.json({ message: "Image deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUT /events/:id/images/reorder
const reorderEventImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageOrder } = req.body; // Array of image IDs in new order

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this event" });
    }

    // Update order for each image
    imageOrder.forEach((imageId, index) => {
      const image = event.images.id(imageId);
      if (image) {
        image.order = index;
      }
    });

    // Sort images by order
    event.images.sort((a, b) => a.order - b.order);

    // Update legacy fields to use first image
    if (event.images.length > 0) {
      event.imageUrl = event.images[0].url;
      event.imagePublicId = event.images[0].publicId;
    }

    await event.save();
    res.json({
      message: "Images reordered successfully",
      images: event.images,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  contributeToEvent,
  toggleImageStar,
  deleteEventImage,
  reorderEventImages,
};
