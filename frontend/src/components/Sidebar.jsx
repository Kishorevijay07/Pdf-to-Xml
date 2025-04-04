import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const SidebarPreviousUploads = ({  }) => {
  const navigate = useNavigate();
  const previousUploads=[]

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return (
    <div className="w-40 bg-red-100 text-white h-auto min-h-full p-4 fixed ">
      <h2 className="text-lg font-semibold mb-4">Previous Uploads</h2>
     <ul>
         {previousUploads.length === 0 ? (
          <p className="text-gray-400">no</p>
        ) : (
          previousUploads.map((upload, index) => (
            <li
              key={index}
              onClick={() => navigate("/result", { state: { text: upload.text } })}
              className="cursor-pointer p-2 hover:bg-gray-700 rounded"
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
