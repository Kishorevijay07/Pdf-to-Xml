// models/User.js
import mongoose from "mongoose";
import moment from "moment";

const FileSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  storedAt: {
    type: String,
    default: () => moment().format("DD-MM-YYYY, HH:mm")
  }
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  files: [FileSchema],
  queries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query"
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
