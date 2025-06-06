import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    feedback: { 
        type: String,
        required: true 
    },
    rating: {
        type: Number, 
        min: 1,
        max: 5, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
