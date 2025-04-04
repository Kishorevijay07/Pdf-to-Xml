import Feedback from "../model/feedback.model.js";
import User from "../model/auth.model.js";

export const postFeedback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { feedback, rating } = req.body;

    if (!feedback || !rating) {
      return res
        .status(400)
        .json({ message: "Feedback and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

   
    const newFeedback = new Feedback({
      userId: req.user._id,
      feedback,
      rating,
    });

    await newFeedback.save();

    const user = await User.findById(req.user._id);
    user.feedbacks = user.feedbacks || [];
    user.feedbacks.push(newFeedback._id);
    await user.save();

    res
      .status(201)
      .json({
        message: "Feedback submitted successfully",
        feedback: newFeedback,
      });
  } catch (error) {
    console.error("Feedback Submission Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate(
      "userId",
      "username email"
    );

    if (!feedbacks.length) {
      return res.status(404).json({ message: "No feedback found" });
    }

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
