import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "../pages/Header";
import Sidebar from "./Sidebar.jsx";

import { baseUrl } from "../urls/Constant.js"; 

const QueryPage = () => {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: queries, isLoading } = useQuery({
    queryKey: ["UserQueries"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/user/getquery`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch queries");
      const data = await res.json();
      return data?.queries || [];
    },
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (queryText) => {
      const res = await fetch(`${baseUrl}/api/user/query`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error submitting query");
      return data;
    },
    onSuccess: () => {
      setQuery("");
      queryClient.invalidateQueries(["UserQueries"]);
    },
    onError: (error) => {
      alert(error.message || "Error submitting query");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    mutation.mutate(query);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4 text-center">Submit Your Query</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
              placeholder="Enter your query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              {mutation.isLoading ? "Submitting..." : "Submit Query"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-6">
          <h3 className="text-lg font-semibold mb-3">Previous Queries</h3>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : queries.length === 0 ? (
            <p className="text-gray-500">No queries submitted yet.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {queries
                .slice()
                .reverse()
                .map((q, index) => (
                  <li key={index} className="border-b pb-2">
                    {q.query}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
