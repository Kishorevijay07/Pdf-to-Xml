import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {

    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
  return (
    <div>
    
            <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
      
          <h1 className="text-xl font-bold text-red-600">PDF<span className="text-green-600">2</span><span className="text-gray-700">XML</span></h1>
          <div className="flex gap-4">

            <a href="/" className="text-gray-700 hover:text-red-600">Home</a>
            <a href="/helpandsupport" className="text-gray-700 hover:text-red-600">Help & Support</a>
            <a href="/feedback" className="text-gray-700 hover:text-red-600">FeedBack</a>
            {!authUser && <a href="/login" className="text-gray-700 hover:text-red-600">Login</a>}
            <a href="/profile" className="text-gray-700 hover:text-red-600">Profile</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
