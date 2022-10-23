import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { getMatches } from "../../api/api";
import styled from "styled-components";
import { Match } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { colors } from "../../constants/colors";
import { NavButton } from "../Homepage";
import { convertTimestampToDate } from "../../utils";

const MatchesTable = styled.div`
  width: 40rem;
  margin: 2rem auto;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 0.5rem 2rem;

  &:hover {
    background-color: ${colors.white};
  }
`;

const MatchStatus = styled.div<{ status: boolean }>`
  position: absolute;
  color: ${(props) => (props.status ? colors.success : colors.error)};
  font-weight: 600;
  font-size: 0.7rem;
  right: 50%;
  top: 80%;
  transform: translate(50%, -50%);
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

export const Matches: FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await getMatches();
      setMatches(response);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <Container>
        <NavButton onClick={() => navigate("/")}>Pregled tablice</NavButton>
        <MatchesTable>
          {matches &&
            matches.map((match) => (
              <MatchInfo
                key={match.match_id}
                onClick={() => navigate(`/komentari/${match.match_id}`)}
              >
                <p>{match.team0}</p>
                <p>{`${match.score_point_0} : ${match.score_point_1}`}</p>
                <p>{match.team1}</p>
                <MatchStatus status={!match.finished}>
                  {match.finished ? "ZAVRŠENO" : "U TIJEKU"}
                </MatchStatus>
                <MatchDate>{convertTimestampToDate(match.date)}</MatchDate>
              </MatchInfo>
            ))}
        </MatchesTable>
      </Container>
    </>
  );
};
