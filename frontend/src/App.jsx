import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import BottomNavbar from "./components/common/BottomNavbar";
import Profile from "./pages/profile/Profile";
import Notices from "./components/common/Notice/Notices";
import LoadingSpinner from "./components/common/LoadingSpinner";

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
import BotanyYears from "./components/common/Resources/Science/Botany/BotanyYears";
import ChemistryYears from "./components/common/Resources/Science/Chemistry/ChemistryYears";
import MathematicsYears from "./components/common/Resources/Science/Mathematics/MathematicsYears";
import PhysicsYears from "./components/common/Resources/Science/Physics/PhysicsYears";
import ZoologyYears from "./components/common/Resources/Science/Zoology/ZoologyYears";
import StatisticsYears from "./components/common/Resources/Science/Statistics/StatisticsYears";
import CommerceYears from "./components/common/Resources/Commerce/CommerceYears";
import BedYears from "./components/common/Resources/SF-Regular/BED/BedYears";
import BioTechnologyYears from "./components/common/Resources/SF-Regular/Bio Technology/BioTechnologyYears";
import SocialWorkYears from "./components/common/Resources/SF-Regular/Social Work/SocialWorkYears";
import ComputerScienceYears from "./components/common/Resources/SF-Regular/Computer Science/ComputerScienceYears";
import ItmYears from "./components/common/Resources/SF_PPP/BSC ITM/ItmYears";
import ImbaYears from "./components/common/Resources/SF_PPP/IMBA/ImbaYears";
import ImcaYears from "./components/common/Resources/SF_PPP/IMCA/ImcaYears";
import BioinformaticsYears from "./components/common/Resources/SF_PPP/IMSC BI/BioinformaticsYears";
import EtcYears from "./components/common/Resources/SF_PPP/IMSC ETC/EtcYears";
import LawYears from "./components/common/Resources/SF_PPP/LAW/LawYears";
import PmirYears from "./components/common/Resources/SF_PPP/MA PMIR/PmirYears";
import MajmcYears from "./components/common/Resources/SF_PPP/MAJMC/MajmcYears";
import MathmYears from "./components/common/Resources/SF_PPP/MATHM/MathmYears";
import MbaAbYears from "./components/common/Resources/SF_PPP/MBA AB/MbaAbYears";
import McfcYears from "./components/common/Resources/SF_PPP/MCFC/McfcYears";
import Pg from "./components/common/Pg/Pg";
import Jobs from "./components/common/Job/Jobs";

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

        <Route path="/anthropologyyears" element={<AnthropologyYears />} />
        <Route path="/economicsyears" element={<EconomicsYears />} />
        <Route path="/englishyears" element={<EnglishYears />} />
        <Route path="/geographyyears" element={<GeographyYears />} />
        <Route path="/hindiyears" element={<HindiYears />} />
        <Route path="/historyyears" element={<HistoryYears />} />
        <Route path="/musicyears" element={<MusicYears />} />
        <Route path="/philosophyyears" element={<PhilosophyYears />} />
        <Route path="/odiayears" element={<OdiaYears />} />
        <Route
          path="/politicalscienceyears"
          element={<PoliticalScienceYears />}
        />
        <Route path="/psychologyyears" element={<PsychologyYears />} />
        <Route path="/sanskrityears" element={<SanskritYears />} />
        <Route path="/sociologyyears" element={<SociologyYears />} />
        <Route path="botanyyears" element={<BotanyYears />} />
        <Route path="/chemistryyears" element={<ChemistryYears />} />
        <Route path="/mathematicsyears" element={<MathematicsYears />} />
        <Route path="/physicsyears" element={<PhysicsYears />} />
        <Route path="/zoologyyears" element={<ZoologyYears />} />
        <Route path="/statisticsyears" element={<StatisticsYears />} />
        <Route path="/commerceyears" element={<CommerceYears />} />
        <Route path="/bedyears" element={<BedYears />} />
        <Route path="/biotechnologyyears" element={<BioTechnologyYears />} />
        <Route
          path="/computerscienceyears"
          element={<ComputerScienceYears />}
        />
        <Route path="/socialworkyears" element={<SocialWorkYears />} />
        <Route path="/itmyears" element={<ItmYears />} />
        <Route path="/imbaYears" element={<ImbaYears />} />
        <Route path="/imcayears" element={<ImcaYears />} />
        <Route path="/bioinformaticsyears" element={<BioinformaticsYears />} />
        <Route path="/etcyears" element={<EtcYears />} />
        <Route path="/lawyears" element={<LawYears />} />
        <Route path="/pmiryears" element={<PmirYears />} />
        <Route path="/majmcyears" element={<MajmcYears />} />
        <Route path="/mathmyears" element={<MathmYears />} />
        <Route path="/mbaabyears" element={<MbaAbYears />} />
        <Route path="/mcfcyears" element={<McfcYears />} />
      </Routes>
      <Toaster />
      {authUser && <BottomNavbar />}
    </div>
  );
};

export default App;
