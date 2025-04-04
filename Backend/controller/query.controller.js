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

