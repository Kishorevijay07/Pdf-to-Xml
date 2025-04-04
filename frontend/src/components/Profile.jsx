import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { baseUrl } from "../urls/Constant.js"; 
import LoadingSpinner from "./LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const queryClient = useQueryClient();


	const {mutate:logout,isPending} = useMutation({
		mutationFn : async() =>{
			try {
				const res = await fetch(`${baseUrl}/api/auth/logout`,{
					method : "POST",
					credentials : "include",
					headers:{
						"Content-Type" : "application/json",
						"Accept" : "application/json"
					},
					body : JSON.stringify()
				})
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.Error || "Something went wrong")
				}
			} catch (error) {
				throw error;
			}
		},
		onSuccess :() =>{
			toast.success("Logout Successfully")
			const authUser=queryClient.invalidateQueries({
				queryKey : ["authUser"]
			})
      if(!authUser){
        <Navigate to = "/login"/>
      }
		},

		onError:()=>{
			toast.error("Logout Unsucessfully")
		}
	});
	
 
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  const authUser = queryClient.getQueryData(["authUser"]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">

      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold">{authUser.username}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{authUser.email}</p>
          <p className="text-xs text-gray-500">65Kg | 1.61m | 26.6 IMC | A RH+</p>
        </div>
      </header>

   
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          onClick={handleLogout}
          disabled={isPending}
        >
          {isPending ? <LoadingSpinner/> : "Logout"}
        </button>
      </div>

<section className="mt-6 bg-white p-4 rounded-xl shadow-md">
  <h3 className="text-lg font-semibold">History</h3>

  {authUser?.files?.length > 0 ? (
    <>
      <div className="flex space-x-2 mt-2">
        <p>Total Count of {authUser.files.length}</p>
      </div>

      <div className="mt-4 space-y-4">
        {authUser.files.map((file, index) => (

          <div
            key={index}
            className="p-4 bg-gray-100 rounded-xl flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{file.filename || "Unknown Condition"}</h4>
            </div>
            <span
              className={`px-3 py-1 text-white rounded-full text-xs ${
                file.status === "Current"
                  ? "bg-green-500"
                  : file.status === "Intermittent"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              {file.status || "Unknown"}
            </span>
            <div className="flex space-x-2">
              <button className="text-blue-500">
                <FaEdit />
              </button>
              <button className="text-red-500">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p className="text-sm text-gray-500 mt-2">No history available</p>
  )}
</section>

    </div>
  );
};

export default Profile;
