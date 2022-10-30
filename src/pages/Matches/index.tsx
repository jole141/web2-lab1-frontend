import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { createMatch, getFinishedMatches, getMatches } from "../../api/api";
import styled from "styled-components";
import { Match } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { colors } from "../../constants/colors";
import { NavButton } from "../Homepage";
import { convertTimestampToDate, isUserAdmin } from "../../utils";
import Modal from "../../components/Modal";
import { CLUBS } from "../../constants/clubs";

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

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Info = styled.p`
  font-size: 0.8rem;
  font-style: italic;
  margin-bottom: 0.5rem;
  color: ${colors.dark};
  font-weight: 600;
`;

export const CustomButton = styled.button`
  background-color: ${colors.dark};
  border-radius: 10px;
  color: ${colors.darkWhite};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  width: 16rem;
  margin: 1rem;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${colors.grey};
  }
`;

export const CustomButtonSecondary = styled.button`
  background-color: ${colors.white};
  border-radius: 10px;
  color: ${colors.dark};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  width: 16rem;
  margin: 1rem;
  border: none;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${colors.dark};

  &:hover {
    background-color: ${colors.darkWhite};
  }
`;

const ClubList = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  flex-wrap: wrap;
`;

const Club = styled.div`
  margin: 0.5rem;
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 20rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

export const Matches: FC = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>();
  const [finishedMatches, setFinishedMatches] = useState<Match[]>();

  const [homeClub, setHomeClub] = useState("");
  const [awayClub, setAwayClub] = useState("");
  const [date, setDate] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const addMatch = async () => {
    setShowModal(false);
    setIsLoading(true);
    await createMatch(homeClub, awayClub, date, accessToken);
    setIsLoading(false);
    setDate("");
    setHomeClub("");
    setAwayClub("");
    await getInfo();
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  const getInfo = async () => {
    setIsLoading(true);
    const response1 = await getMatches();
    const response2 = await getFinishedMatches();
    setMatches(response1);
    setFinishedMatches(response2);
    setIsLoading(false);
  };

  const getUserInfo = async () => {
    setIsAdmin(isUserAdmin(user?.name!));
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Modal show={showModal}>
        <h3>Dodaj utakmicu</h3>
        <ClubList>
          {CLUBS.map((club) => (
            <Club key={club.id}>{`${club.id}. ${club.name}  `}</Club>
          ))}
        </ClubList>
        <Form>
          <Input
            value={homeClub}
            onChange={(e) => setHomeClub(e.target.value)}
            placeholder="Unesite ID domaćina"
          />
          <Input
            value={awayClub}
            onChange={(e) => setAwayClub(e.target.value)}
            placeholder="Unesite ID gosta"
          />
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="datetime-local"
          />
          <span>
            <CustomButton onClick={() => addMatch()}>Dodaj</CustomButton>
            <CustomButtonSecondary onClick={() => setShowModal(false)}>
              Cancle
            </CustomButtonSecondary>
          </span>
        </Form>
      </Modal>
      <Header />
      <Container>
        <NavButton onClick={() => navigate("/")}>Pregled tablice</NavButton>
        <Title>Nadolazeće utakmice</Title>
        {user && (
          <Info>INFO: Pritisnite na utakmicu kako biste vidjeli komentare</Info>
        )}
        {isAdmin && (
          <CustomButton onClick={() => setShowModal(true)}>
            Unesi utakmicu
          </CustomButton>
        )}
        <MatchesTable>
          {matches ? (
            matches.map((match) => (
              <>
                <MatchInfo
                  key={match.match_id}
                  onClick={() => {
                    if (user) navigate(`/komentari/${match.match_id}`);
                  }}
                >
                  <p>{match.team0}</p>

                  <p>{`${match.score_point_0 || "-"} : ${
                    match.score_point_1 || "-"
                  }`}</p>

                  <p>{match.team1}</p>
                  <MatchDate>{convertTimestampToDate(match.date)}</MatchDate>
                </MatchInfo>
              </>
            ))
          ) : (
            <p>Nema nadolazećih utakmica</p>
          )}
        </MatchesTable>
        <Title>Odigrane utakmice</Title>
        {user && (
          <Info>INFO: Pritisnite na utakmicu kako biste vidjeli komentare</Info>
        )}
        <MatchesTable>
          {finishedMatches ? (
            finishedMatches.map((match) => (
              <MatchInfo
                key={match.match_id}
                onClick={() => {
                  if (user) navigate(`/komentari/${match.match_id}`);
                }}
              >
                <p>{match.team0}</p>
                <p>{`${match.score_point_0 || "-"} : ${
                  match.score_point_1 || "-"
                }`}</p>
                <p>{match.team1}</p>
                <MatchDate>{convertTimestampToDate(match.date)}</MatchDate>
              </MatchInfo>
            ))
          ) : (
            <p>Nema odigranih utakmica</p>
          )}
        </MatchesTable>
      </Container>
    </>
  );
};
