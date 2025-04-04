import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast"; // ✅ Import toast
import LoadingSpinner from "./LoadingSpinner";
import { baseUrl } from "../urls/Constant.js";
import { useQuery } from '@tanstack/react-query';
const CreateAccouont = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();
  const { mutate: signup, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, username, password }) => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/signup`, { // ✅ Use BaseUrl
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ email, username, password }),
        });
  
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message);
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("User created successfully and Signing In");
  
      // ✅ Invalidate authUser query so it refetches the updated data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
  
      // ✅ Access authUser from cache after invalidating the query
      const authUser = queryClient.getQueryData(["authUser"]);
      console.log("Auth username:", authUser?.email);
    },
    onError: (error) => {
      console.error("Mutation Error:", error.message);
    },
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData.username); // ✅ Fixed "fullname" to "name"
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-gray-100 rounded-3xl shadow-xl p-8 md:p-16 flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left side: Form */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">Sign up</h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your name here"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email ID</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email ID here"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password here"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" id="agree" className="accent-blue-600" />
              <label htmlFor="agree">
                By signing up, you agree to receive updates and special offers.
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-full transition duration-300"
            >
              {isPending ? <LoadingSpinner /> : "Sign Up"}
            </button>
            {isError && (
              <p className="text-red-500">{error?.message || "An error occurred"}</p>
            )}
          </form>
        </div>

        {/* Right side: Image/Illustration */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <img
            src="https://img.freepik.com/free-photo/sign-up-form-button-graphic-concept_53876-123684.jpg?ga=GA1.1.1975930296.1714817444&semt=ais_hybrid"
            alt="signup illustration"
            className="w-80 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAccouont;
