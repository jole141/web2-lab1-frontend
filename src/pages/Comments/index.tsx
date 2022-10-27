import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import {
  addScore,
  createComment,
  getCommentsApi,
  getMatchById,
  updateResults,
} from "../../api/api";
import styled from "styled-components";
import { IComment, Match } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { colors } from "../../constants/colors";
import { NavButton } from "../Homepage";
import { convertTimestampToDate, isUserAdmin } from "../../utils";
import { CustomButton, CustomButtonSecondary, Input } from "../Matches";
import Comment from "../../components/Comment";

const MatchesTable = styled.div`
  width: 40rem;
  margin: 2rem auto;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
  position: relative;
`;

const MatchDate = styled.div`
  position: absolute;
  color: ${colors.dark};
  font-weight: 600;
  font-size: 0.7rem;
  right: 50%;
  top: 5%;
  transform: translateX(50%);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentsContainer = styled.div`
  width: 40rem;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
`;

const NumberInput = styled.input`
  width: 1.6rem;
  height: 1.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 1rem;
  margin: 0.5rem;
`;

export const Comments: FC = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  let { id } = useParams();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [match, setMatch] = useState<Match>();
  const [isAdmin, setIsAdmin] = useState(false);

  const [homeScore, setHomeScore] = useState("0");
  const [awayScore, setAwayScore] = useState("0");
  const [editMode, setEditMode] = useState(false);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<IComment[]>([]);

  const getUserInfo = async () => {
    setIsAdmin(isUserAdmin(user?.name!));
  };

  const addComment = async () => {
    setIsLoading(true);
    if (id) {
      await createComment(id, comment, accessToken);
      await getComments(id);
    }
    setComment("");
    setIsLoading(false);
  };

  const getMatchInfo = async (id: string) => {
    setIsLoading(true);
    const response = await getMatchById(id);
    if (response.score_point_0) setHomeScore(response.score_point_0.toString());
    if (response.score_point_1) setAwayScore(response.score_point_1.toString());
    setMatch(response);
    setIsLoading(false);
  };

  const getComments = async (id: string) => {
    setIsLoading(true);
    const response = await getCommentsApi(id);
    setComments(response);
    setIsLoading(false);
  };

  const addResult = async () => {
    setEditMode(false);
    setIsLoading(true);
    if (match && match?.score_point_0 === null) {
      console.log("add");
      await addScore(
        match.match_id.toString(),
        homeScore,
        awayScore,
        accessToken
      );
    } else if (match) {
      await updateResults(
        match.match_id.toString(),
        homeScore,
        awayScore,
        accessToken
      );
    }
    setIsLoading(false);
    if (id) getMatchInfo(id);
  };

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (id) {
      getMatchInfo(id);
      getComments(id);
    }
  }, [id]);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <Container>
        <NavButton onClick={() => navigate("/")}>Pregled tablice</NavButton>
        <NavButton onClick={() => navigate("/utakmice")}>
          Pregled utakmica
        </NavButton>
        {isAdmin && (
          <CustomButtonSecondary
            style={{ width: "40rem" }}
            onClick={() => setEditMode(true)}
          >
            Unesi rezultat
          </CustomButtonSecondary>
        )}
        <MatchesTable>
          {match && (
            <>
              <MatchInfo>
                <p>{match.team0}</p>
                {!editMode ? (
                  <p>{`${match.score_point_0 || "-"} : ${
                    match.score_point_1 || "-"
                  }`}</p>
                ) : (
                  <span>
                    <NumberInput
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                    />
                    :
                    <NumberInput
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                    />
                  </span>
                )}
                <p>{match.team1}</p>
                <MatchDate>{convertTimestampToDate(match.date)}</MatchDate>
              </MatchInfo>
              {editMode && isAdmin && (
                <CustomButton onClick={addResult}>Unesi</CustomButton>
              )}
            </>
          )}
          {isAuthenticated && (
            <>
              <h3>Komentari</h3>
              <CommentsContainer>
                <span>
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: "76%" }}
                  />
                  <CustomButton
                    style={{ width: "12%", padding: "0.5rem" }}
                    onClick={addComment}
                  >
                    Pošalji
                  </CustomButton>
                </span>
                {comments &&
                  comments.map((comment: any) => (
                    <Comment
                      key={comment.comment_id}
                      id={comment.comment_id}
                      matchId={comment.match_id.toString()}
                      getComments={getComments}
                      owner={comment.email}
                      text={comment.comment}
                      setIsLoading={setIsLoading}
                      datetime={comment.datetime}
                    />
                  ))}
              </CommentsContainer>
            </>
          )}
        </MatchesTable>
      </Container>
    </>
  );
};
