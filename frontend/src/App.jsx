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
import AllResource from "./pages/Resources/AllResource";
import AnthropologyYears from "./pages/Resources/Arts/Anthropology/AnthropologyYears";
import ArtsSyllabus from "./pages/Resources/Arts/ArtsSyllabus/ArtsSyllabus";
import EconomicsYears from "./pages/Resources/Arts/Economics/EconomicsYears";
import EnglishYears from "./pages/Resources/Arts/English/EnglishYears";
import GeographyYears from "./pages/Resources/Arts/Geography/GeographyYears";
import HindiYears from "./pages/Resources/Arts/Hindi/HindiYears";
import HistoryYears from "./pages/Resources/Arts/History/HistoryYears";
import MusicYears from "./pages/Resources/Arts/Music/MusicYears";
import OdiaYears from "./pages/Resources/Arts/Odia/OdiaYears";
import PhilosophyYears from "./pages/Resources/Arts/Philosophy/PhilosophyYears";
import PoliticalScienceYears from "./pages/Resources/Arts/Political_Science/PoliticalScienceYears";
import PsychologyYears from "./pages/Resources/Arts/Psychology/PsychologyYears";
import SanskritYears from "./pages/Resources/Arts/Sanskrit/SanskritYears";
import SociologyYears from "./pages/Resources/Arts/Sociology/SociologyYears";
import BotanyYears from "./pages/Resources/Science/Botany/BotanyYears";
import ChemistryYears from "./pages/Resources/Science/Chemistry/ChemistryYears";
import MathematicsYears from "./pages/Resources/Science/Mathematics/MathematicsYears";
import PhysicsYears from "./pages/Resources/Science/Physics/PhysicsYears";
import StatisticsYears from "./pages/Resources/Science/Statistics/StatisticsYears";
import ZoologyYears from "./pages/Resources/Science/Zoology/ZoologyYears";
import CommerceYears from "./pages/Resources/Commerce/CommerceYears";
import BedYears from "./pages/Resources/SF-Regular/BED/BedYears";
import BioTechnologyYears from "./pages/Resources/SF-Regular/Bio_Technology/BioTechnologyYears";
import ComputerScienceYears from "./pages/Resources/SF-Regular/Computer_Science/ComputerScienceYears";
import SocialWorkYears from "./pages/Resources/SF-Regular/Social_Work/SocialWorkYears";

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
          element={authUser ? <AllResource /> : <Navigate to="/" />}
        />

        <Route path="/pg" element={authUser ? <Pg /> : <Navigate to="/" />} />

        <Route
          path="/anthropologyyears"
          element={authUser ? <AnthropologyYears /> : <Navigate to="/" />}
        ></Route>

        <Route
          path="/economicsyears"
          element={authUser ? <EconomicsYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/englishyears"
          element={authUser ? <EnglishYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/geographyyears"
          element={authUser ? <GeographyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/hindiyears"
          element={authUser ? <HindiYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/historyyears"
          element={authUser ? <HistoryYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/musicyears"
          element={authUser ? <MusicYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/odiayears"
          element={authUser ? <OdiaYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/philosophyyears"
          element={authUser ? <PhilosophyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/politicalscience"
          element={authUser ? <PoliticalScienceYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/psychologyyears"
          element={authUser ? <PsychologyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/sanskrityears"
          element={authUser ? <SanskritYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/sociologyyears"
          element={authUser ? <SociologyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/chemistryyears"
          element={authUser ? <ChemistryYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/botanyyears"
          element={authUser ? <BotanyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/mathematicsyears"
          element={authUser ? <MathematicsYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/physicsyears"
          element={authUser ? <PhysicsYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/statisticsyears"
          element={authUser ? <StatisticsYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/zoologyyears"
          element={authUser ? <ZoologyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/commerceyears"
          element={authUser ? <CommerceYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/bedyears"
          element={authUser ? <BedYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/biotechnologyyears"
          element={authUser ? <BioTechnologyYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/computerscienceyears"
          element={authUser ? <ComputerScienceYears /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/socialworkyears"
          element={authUser ? <SocialWorkYears /> : <Navigate to="/" />}
        ></Route>
      </Routes>
      <Toaster />
      {authUser && <BottomNavbar />}
    </div>
  );
};

export default App;
