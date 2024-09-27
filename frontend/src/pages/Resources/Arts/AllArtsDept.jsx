import React from 'react'
import AnthropolgyHons from './Anthropology/AnthropolgyHons'
import EconomicsHons from './Economics/EconomicsHons'
import EnglishHons from './English/EnglishHons'
import GeographyHons from './Geography/GeographyHons'
import HindiHons from './Hindi/HindiHons'
import HistoryHons from './History/HistoryHons'
import MusicHons from './Music/MusicHons'
import OdiaHons from './Odia/OdiaHons'
import PhilosophyHons from './Philosophy/PhilosophyHons'
import PoliticalScienceHons from './Political_Science/PoliticalScienceHons'
import PsychologyHons from './Psychology/PsychologyHons'
import SanskritHons from './Sanskrit/SanskritHons'
import SociologyHons from './Sociology/SociologyHons'
import ArtsSyllabus from './ArtsSyllabus/ArtsSyllabus'



const AllArtsDept = () => {
  return (
    <div>
      <ArtsSyllabus/>
      <AnthropolgyHons/>
      <EconomicsHons/>
      <EnglishHons/>
      <GeographyHons/>
      <HindiHons/>
      <HistoryHons/>
      <MusicHons/>
      <OdiaHons/>
      <PhilosophyHons/>
      <PoliticalScienceHons/>
      <PsychologyHons/>
      <SanskritHons/>
      <SociologyHons/>
    </div>
  )
}

export default AllArtsDept