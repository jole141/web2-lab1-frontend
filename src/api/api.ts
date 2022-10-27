import axios from "axios";
import { Club, IComment, Match } from "../types";

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

export const createComment = async (
  id: string,
  comment: string,
  token: string
): Promise<void> => {
  await axios.post(
    `${process.env.REACT_APP_API_SERVER_URL}/comments`,
    {
      matchId: parseInt(id, 10),
      comment: comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateComment = async (
  id: string,
  comment: string,
  token: string
): Promise<void> => {
  await axios.put(
    `${process.env.REACT_APP_API_SERVER_URL}/comments/edit/${id}`,
    {
      comment: comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteComment = async (
  id: string,
  token: string
): Promise<void> => {
  await axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/comments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCommentAdmin = async (
  id: string,
  token: string
): Promise<void> => {
  await axios.delete(
    `${process.env.REACT_APP_API_SERVER_URL}/comments/admin/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCommentsApi = async (id: string): Promise<IComment[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER_URL}/comments/${id}`
  );
  return response.data;
};
