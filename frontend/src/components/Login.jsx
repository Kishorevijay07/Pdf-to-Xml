import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { baseUrl } from "../urls/Constant.js"; // ✅ Ensure baseUrl is imported

const Login = () => {
  const queryClient = useQueryClient();

  // ✅ State for Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Mutation for Login
  const { mutate: login, isError, error, isLoading } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); 
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      toast.error(error.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }
    login(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        <div className="w-1/2 p-10 hidden md:flex flex-col justify-center bg-gray-100">
          <h1 className="text-5xl font-bold text-gray-800">
            <span className="text-red-600">Login</span> Design
          </h1>
          <p className="text-gray-600 mt-4">
            that Mix <span className="text-red-600 font-semibold">Creativity</span> with{" "}
            <span className="text-red-600 font-semibold">Convenience</span>
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-white p-10">
          <h2 className="text-2xl font-bold text-gray-800">Hello!</h2>
          <p className="text-gray-500">We are really happy to see you again!</p>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Sign In"}
            </button>
          </form>
          {isError && <p className="text-red-500 text-center mt-2">{error?.message}</p>}
          <div className="text-center text-gray-500 mt-4">or SignUp here</div>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/create-account">
              <button className="w-[200px] h-10 bg-gray-100 hover:bg-gray-400 rounded-lg flex items-center justify-center">
                Create an Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
