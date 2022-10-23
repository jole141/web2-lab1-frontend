import axios from "axios";
import { Club, Match } from "../types";

export const getClubTable = async (): Promise<Club[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/clubs`
  );
  return response.data;
};

export const getMatches = async (): Promise<Match[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/matches`
  );
  return response.data;
};

export const getMatchById = async (id: string): Promise<Match> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/matches/${id}`
  );
  return response.data;
};
