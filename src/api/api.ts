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

export const getFinishedMatches = async (): Promise<Match[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/matches/results`
  );
  return response.data;
};

export const getMatchById = async (id: string): Promise<Match> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/matches/${id}`
  );
  return response.data;
};

export const createMatch = async (
  id1: string,
  id2: string,
  date: string,
  token: string
): Promise<void> => {
  await axios.post(
    `${process.env.REACT_APP_API_SERVER_URL}/matches`,
    {
      fc0Id: id1,
      fc1Id: id2,
      date: date,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const addScore = async (
  id: string,
  score0: string,
  score1: string,
  token: string
): Promise<void> => {
  await axios.put(
    `${process.env.REACT_APP_API_SERVER_URL}/matches/results/${id}`,
    {
      score0: parseInt(score0, 10),
      score1: parseInt(score1, 10),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateResults = async (
  id: string,
  score0: string,
  score1: string,
  token: string
): Promise<void> => {
  await axios.put(
    `${process.env.REACT_APP_API_SERVER_URL}/matches/results/update/${id}`,
    {
      score0: parseInt(score0, 10),
      score1: parseInt(score1, 10),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
