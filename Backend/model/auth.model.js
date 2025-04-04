import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    files: [
        {
          fileUrl: { 
            type: String, 
            required: true 
        },
          fileName: { 
            type: String,
            required: true 
        }, 
        },
      ],
      queries: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Query" 
    }]
},
{ timestamps: true}
);

const User = mongoose.model("User",UserSchema);
export default User;