import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const baseUrl = "http://localhost:3000";

const Feedback = () => {
  const [rating, setRating] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: async (newFeedback) => {
      const res = await fetch(`${baseUrl}/api/all/feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFeedback),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit feedback");
      return data;
    },
    onSuccess: () => {
      alert("Feedback submitted! 🎉");
      setRating(null);
      setSuggestion("");
      queryClient.invalidateQueries(["AllFeedback"]);
    },
    onError: (error) => {
      alert(error.message || "Error submitting feedback");
    },
  });

  const handleSubmit = () => {
    if (!rating) return;
    feedbackMutation.mutate({
      rating,
      feedback: suggestion,
    });
  };

  const { data: AllFeedback, isLoading, isError } = useQuery({
    queryKey: ["AllFeedback"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/all/getfeedback`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch feedback");
      return data;
    },
    retry: false,
  });

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">

      <div className="p-6 shadow-lg bg-white rounded-2xl border">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Give Your Feedback</h2>

          <div className="flex space-x-3 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`p-2 text-3xl ${
                  rating === value ? "text-blue-600 scale-110" : "text-gray-400"
                } transition`}
                onClick={() => setRating(value)}
              >
                {["😠", "😞", "😐", "😊", "😍"][value - 1]}
              </button>
            ))}
          </div>

          <textarea
            className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-blue-500"
            rows="3"
            placeholder="Other suggestions..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
          <button
            className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
            onClick={handleSubmit}
            disabled={!rating || feedbackMutation.isLoading}
          >
            {feedbackMutation.isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

{isLoading ? (
  <p className="text-center text-gray-500">Loading feedback...</p>
) : isError ? (
  <p className="text-center text-red-500">Error loading feedback</p>
) : AllFeedback?.feedbacks?.length > 0 ? (
  <div className="p-6 shadow-lg bg-white rounded-2xl border">
    <h3 className="text-lg font-semibold mb-4 text-center">All Feedback</h3>
    <div className="space-y-3">
      {AllFeedback.feedbacks
        .slice() 
        .reverse() 
        .map((feedback) => (
          <div key={feedback._id} className="p-3 border rounded-lg bg-gray-50">
            <p className="text-xl">
              {["😠", "😞", "😐", "😊", "😍"][feedback.rating - 1]}
            </p>
            {feedback.feedback && (
              <p className="text-sm text-gray-700 mt-1">"{feedback.feedback}"</p>
            )}
          </div>
        ))}
    </div>
  </div>
) : (
  <p className="text-center text-gray-400">No feedback yet</p>
)}
    </div>
  );
};

export default Feedback;
