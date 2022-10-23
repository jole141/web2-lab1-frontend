import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { getMatchById } from "../../api/api";
import styled from "styled-components";
import { Match } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
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

export const Comments: FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  let { id } = useParams();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [match, setMatch] = useState<Match>();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    (async () => {
      if (id) {
        setIsLoading(true);
        const response = await getMatchById(id);
        setMatch(response);
        setIsLoading(false);
      }
    })();
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
        <MatchesTable>
          {match && (
            <MatchInfo>
              <p>{match.team0}</p>
              <p>{`${match.score_point_0} : ${match.score_point_1}`}</p>
              <p>{match.team1}</p>
              <MatchStatus status={!match.finished}>
                {match.finished ? "ZAVRŠENO" : "U TIJEKU"}
              </MatchStatus>
              <MatchDate>{convertTimestampToDate(match.date)}</MatchDate>
            </MatchInfo>
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
