// routes/event.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer"); // 1. Import multer
const {
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
} = require("../controllers/event.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

// 2. Configure multer to save uploaded files to an 'uploads' directory
//    (Make sure you have a folder named 'uploads' in your project's root)
const upload = multer({ dest: "uploads/" });

// Public routes
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.patch("/events/:id/contribute", contributeToEvent);

// Protected routes (require authentication)
// Support both single and multiple file uploads
router.post(
  "/events",
  authenticateToken,
  upload.array("images", 10), // Allow up to 10 images
  createEvent,
);

router.get("/my-events", authenticateToken, getMyEvents);
router.put(
  "/events/:id",
  authenticateToken,
  upload.array("images", 10), // Allow up to 10 images for updates
  updateEvent,
);
router.delete("/events/:id", authenticateToken, deleteEvent);

// Image management routes
router.patch(
  "/events/:id/images/:imageId/star",
  authenticateToken,
  toggleImageStar,
);
router.delete(
  "/events/:id/images/:imageId",
  authenticateToken,
  deleteEventImage,
);
router.put("/events/:id/images/reorder", authenticateToken, reorderEventImages);

module.exports = router;
