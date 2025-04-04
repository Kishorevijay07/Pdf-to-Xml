import mongoose from "mongoose";

const querySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    query: String,
    createdAt: { type: Date, default: Date.now }
})

const Query = mongoose.model("Query",querySchema);
export default Query;