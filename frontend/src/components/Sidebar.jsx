import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const SidebarPreviousUploads = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const latestFiles = authUser?.files?.slice(-5).reverse(); // get last 5 and show newest first

  return (
    <div className="w-40 bg-red-500 text-white h-auto min-h-full p-4 fixed">
      <h2 className="text-lg font-semibold mb-4">Previous Uploads</h2>
      <ul>
        {(!latestFiles || latestFiles.length === 0) ? (
          <p className="text-gray-300 text-sm">No files found</p>
        ) : (
          latestFiles.map((upload, index) => (
            <li
              key={index}
              onClick={() => navigate("/result", { state: { fileName: upload.fileName } })}
              className="cursor-pointer p-2 hover:bg-gray-700 rounded text-sm truncate"
              title={upload.fileName}
            >
              {upload.fileName}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SidebarPreviousUploads;
