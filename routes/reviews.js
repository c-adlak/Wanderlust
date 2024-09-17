const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewscontroller = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  saveRedirectUrl,
  isReviewAuthor,
} = require("../middleware.js");
// reviews
//post Route
router.post(
  "/",
  isLoggedIn,
  saveRedirectUrl,
  validateReview,
  wrapAsync(reviewscontroller.createReview)
);

// delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  saveRedirectUrl,
  isReviewAuthor,
  wrapAsync(reviewscontroller.destoryReview)
);

module.exports = router;
