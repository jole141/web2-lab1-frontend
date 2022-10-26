import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { addScore, getMatchById, updateResults } from "../../api/api";
import styled from "styled-components";
import { Match } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { colors } from "../../constants/colors";
import { NavButton } from "../Homepage";
import { convertTimestampToDate, isUserAdmin } from "../../utils";
import { CustomButton, CustomButtonSecondary } from "../Matches";

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

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.8rem;
`;

const Owner = styled.div`
  font-weight: 600;
  font-size: 0.8rem;
  color: ${colors.dark};
  margin-bottom: 0.5rem;
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
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  let { id } = useParams();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [match, setMatch] = useState<Match>();
  const [isAdmin, setIsAdmin] = useState(false);

  const [homeScore, setHomeScore] = useState("0");
  const [awayScore, setAwayScore] = useState("0");
  const [editMode, setEditMode] = useState(false);

  const getUserInfo = async () => {
    const response = await isUserAdmin(accessToken);
    setIsAdmin(response);
  };

  const getMatchInfo = async (id: string) => {
    setIsLoading(true);
    const response = await getMatchById(id);
    if (response.score_point_0) setHomeScore(response.score_point_0.toString());
    if (response.score_point_1) setAwayScore(response.score_point_1.toString());
    setMatch(response);
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
    if (accessToken) {
      getUserInfo();
    }
  }, [accessToken]);

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
          <h3>Komentari</h3>
          <CommentsContainer>
            <Comment>
              <Owner>test@mail.com</Owner>
              <div>
                Ovo je testni komentar i ovo je najgluplji labos na svijetu.
                Umirem dok ga radim. Ak ne dobijem sve bodove strgat cu ruke i
                noge profesorima
              </div>
            </Comment>
            <Comment>
              <Owner>smrdljivi.joza@mail.com</Owner>
              <div>
                Oj diname oj diname oj diname oj diname oj diname oj diname oj
              </div>
            </Comment>
          </CommentsContainer>
        </MatchesTable>
      </Container>
    </>
  );
};
