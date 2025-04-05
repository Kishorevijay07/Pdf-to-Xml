import User from "../model/auth.model.js";
import Query from "../model/query.model.js";
export const previousuploaded = async(req,res)=>{

    try {
        const user = await User.findById(req.user);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const recentFiles = user.files.slice(-5).reverse();
    
        res.status(200).json({ files: recentFiles });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving files", error });
      }
  }
  import fs from "fs";
  import path from "path";
  import moment from "moment";
  
  export const storefile = async (req, res) => {
    try {
      const { fileName, xmlData } = req.body;
      const userId = req.user._id;
  
      const folderPath = path.join("Storedfiles", "xml");
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  
      const filePath = path.join(folderPath, fileName);
  
      fs.writeFileSync(filePath, xmlData, "utf-8");
  
      const fileUrl = `/Storedfiles/xml/${fileName}`; 
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.files.push({
        fileName,
        fileUrl,
        storedAt: moment().format("DD-MM-YYYY, HH:mm"),
      });
  
      await user.save();
  
      res.status(200).json({ message: "File saved successfully", fileName, fileUrl });
    } catch (err) {
      console.error("File store error:", err);
      res.status(500).json({ error: "Failed to store file" });
    }
  };
  
export const getfiles = async (req, res) => {
      try {
          const user = await User.findOne({ _id: req.user._id });
  
          if (!user) {
              return res.status(404).json({ error: "User not found" });
          }
          console.log("user file ",user.files)
          return res.status(200).json({file:user.files});
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
      }
  };

  import { fileURLToPath } from "url";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  export const getparticularfile = async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "../Storedfiles/xml", filename);
  
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).json({ error: "Failed to retrieve the file" });
    }
  };
  

export const deleteFile = async (req, res) => {
  const { fileUrl } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "fileUrl is required" });
  }
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { files: { fileUrl } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(fileUrl)

    const filePath = path.join(__dirname, "..","Storedfiles","xml",path.basename(fileUrl));
    console.log(filePath)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted from local:", filePath);
    } else {
      console.warn("File not found on disk:", filePath);
    }

    res.status(200).json({ message: "File deleted successfully", files: updatedUser.files });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const queryformclient = async (req, res) => {
      try {
          const user = await User.findById(req.user);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
  
          const { query } = req.body;
          if (!query) {
              return res.status(400).json({ message: "Query text cannot be empty" });
          }
  
          const newQuery = new Query({
              userId: user._id, 
              query
          });
          await newQuery.save();
  
          
          user.queries.push(newQuery._id);
          await user.save();
  
          res.status(201).json({ message: "Query submitted successfully", query: newQuery });
      } catch (error) {
          console.error("Query Submission Error:", error);
          res.status(500).json({ message: "Internal Server Error" });
      }
  };
  

export const getquery = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const user = await User.findById(req.user._id).populate("queries");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ queries: user.queries });
    } catch (error) {
        console.error("Error fetching queries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

