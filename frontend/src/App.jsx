import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import BottomNavbar from "./components/common/BottomNavbar";
import Profile from "./pages/profile/Profile";
import LoadingSpinner from "./components/common/LoadingSpinner";

import Jobs from "./pages/jobs/Jobs";
import Pg from "./pages/Pg/Pg";
import Notices from "./pages/Notice/Notices";
import ResourcesList from "./pages/Resources/ResourcesList";
import DocsPage from "./pages/Resources/DocsPage";
import ChatbotMain from "./pages/chatbot/ChatbotMain";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/auth/me");
        const data = await res.json();

        if (data.error) {
          return null;
        }

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  return (
    <div className="">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/jobs"
          element={authUser ? <Jobs /> : <Navigate to="/" />}
        />
        <Route
          path="/notices"
          element={authUser ? <Notices /> : <Navigate to="/" />}
        />
        <Route
          path="/resource"
          element={authUser ? <ResourcesList /> : <Navigate to="/" />}
        />
        <Route
          path="/docs/:department/:honor"
          element={authUser ? <DocsPage /> : <Navigate to="/" />}
        />
        <Route path="/pg" element={authUser ? <Pg /> : <Navigate to="/" />} />
        <Route
          path="/elite"
          element={authUser ? <ChatbotMain /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
      {authUser && <BottomNavbar />}
    </div>
  );
};

export default App;
