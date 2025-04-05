import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Pdfupload from "./components/Pdfupload";
import Profile from './components/Profile.jsx';
import Login from "./components/Login";
import QueryPage from "./components/QueryPage.jsx";
import CreateAccount from "./components/CreateAccount.jsx"
import Feedback from "./components/Feedback.jsx";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { baseUrl } from "./urls/Constant.js";
import ResultPage from "./components/ResultPage.jsx"

const App = () => {

  
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }
  
        const data = await res.json();
        console.log("Auth user:", data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });
   
  const { data: Userfiles} = useQuery({
    queryKey: ["Userfiles"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/getfiles`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }
  
        const data = await res.json();
        console.log("User Files:", data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });
  

if(isLoading){
  return(
    <div className='flex justify-center items-center h-screen'>
      <LoadingSpinner size='x-lg'/>
    </div>
  )
}

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Navbar */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Pdfupload />} />
          <Route path="/create-account" element={!authUser ? <CreateAccount/> : <Navigate to = "/"/>} />
          <Route path="/helpandsupport" element={<QueryPage/>} />
          <Route path="/result" element={<ResultPage/>}/>
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to ="/login"/>} /> 
          <Route path="/login" element={!authUser ? <Login /> :<Navigate to="/"/>} />
          <Route path="/feedback" element = {<Feedback/>}/>
        </Routes>
        {/* Footer */}
        <footer className="bg-gray-100 text-center p-4 mt-16">
          <p className="text-gray-600">© 2025 PDFPRO. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;