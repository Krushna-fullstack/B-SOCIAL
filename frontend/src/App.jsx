import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import BottomNavbar from "./components/common/BottomNavbar";
import Profile from "./pages/profile/Profile";
import JobPosts from "./components/common/job/JobPosts";
import AllResource from "./components/common/Resources/AllResource";
import AnthropologyYears from "./components/common/Resources/Arts/Anthropology/AnthropologyYears"; 
import EconomicsYears from "./components/common/Resources/Arts/Economics/EconomicsYears";
import EnglishYears from "./components/common/Resources/Arts/English/EnglishYears";
import GeographyYears from "./components/common/Resources/Arts/Geography/GeographyYears";
import HindiYears from "./components/common/Resources/Arts/Hindi/HindiYears";
import HistoryYears from "./components/common/Resources/Arts/History/HistoryYears";
import MusicYears from "./components/common/Resources/Arts/Music/MusicYears";
import PhilosophyYears from "./components/common/Resources/Arts/Philosophy/PhilosophyYears";
import OdiaYears from "./components/common/Resources/Arts/Odia/OdiaYears";
import PoliticalScienceYears from "./components/common/Resources/Arts/Political Science/PoliticalScienceYears";
import PsychologyYears from "./components/common/Resources/Arts/Psychology/PsychologyYears";
import SanskritYears from "./components/common/Resources/Arts/Sanskrit/SanskritYears";
import SociologyYears from "./components/common/Resources/Arts/Sociology/SociologyYears";


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
          element={authUser ? <JobPosts /> : <Navigate to="/" />}
        />
        <Route
          path="/resource"
          element={authUser ? <AllResource /> : <Navigate to="/" />}
        />
        <Route path="/anthropologyyears" element={<AnthropologyYears />} />
        <Route path="/economicsyears" element={<EconomicsYears />} />
        <Route path="/englishyears" element={<EnglishYears />} />
        <Route path="/geographyyears" element={<GeographyYears />} />
        <Route path="/hindiyears" element={<HindiYears/>}/>
        <Route path="/historyyears" element={<HistoryYears/>}/>
        <Route path="/musicyears" element={<MusicYears/>}/>
        <Route path="/philosophyyears" element={<PhilosophyYears/>}/>
        <Route path="/odiayears" element={<OdiaYears/>}/>
        <Route path="/politicalscienceyears" element={<PoliticalScienceYears/>}/>
        <Route path="/psychologyyears" element={<PsychologyYears/>}/>
        <Route path="/sanskrityears" element={<SanskritYears/>}/>
        <Route path="/sociologyyears" element={<SociologyYears/>}/>

      </Routes>
      <Toaster />
      {authUser && <BottomNavbar />}
    </div>
  );
};

export default App;
