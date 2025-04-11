// schemaTypes/index.js
import { editorial } from "./editorial";
import { homePage } from "./homePage";
import { missionPage } from "./missionPage";
import { scoreExplanation } from './scoreExplanation';
import weeklyPowerRanking from './weeklyPowerRanking'
import politicianRankingEntry from './politicianRankingEntry'
import blockContent from './blockContent';
import methodology from './methodology'

export const schemaTypes = [
  editorial, 
  homePage, 
  missionPage, 
  scoreExplanation,
  weeklyPowerRanking,
  blockContent,
  methodology,
  politicianRankingEntry
];