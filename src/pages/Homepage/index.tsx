import React, { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";
import { getClubTable } from "../../api/api";
import styled from "styled-components";
import { Club } from "../../types";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { colors } from "../../constants/colors";

const Table = styled.div`
  width: 40rem;
  margin: 2rem auto;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-weight: 600;
  border-bottom: 2px solid #ccc;
`;

const Cell = styled.div`
  width: 4rem;
  text-align: center;
`;

export const NavButton = styled.button`
  background-color: ${colors.primary};
  border-radius: 10px;
  color: ${colors.darkWhite};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  width: 40rem;
  margin: 1rem;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${colors.primaryDarker};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Homepage: FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clubs, setClubs] = useState<Club[]>();

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
      const clubs = await getClubTable();
      setClubs(clubs);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      <Container>
        <NavButton onClick={() => navigate("/utakmice")}>
          Pregled utakmica
        </NavButton>
        <Table>
          <HeaderRow>
            <Cell>Klub</Cell>
            <Cell>Bodovi</Cell>
            <Cell>Pobjeda</Cell>
            <Cell>Gubitci</Cell>
            <Cell>Izjednačeno</Cell>
            <Cell>Golovi</Cell>
          </HeaderRow>
          {clubs &&
            clubs.map((club) => (
              <Row key={club.fc_id}>
                <Cell>{club.name}</Cell>
                <Cell>{club.points}</Cell>
                <Cell>{club.victories}</Cell>
                <Cell>{club.losses}</Cell>
                <Cell>{club.tied}</Cell>
                <Cell>{club.scored_points}</Cell>
              </Row>
            ))}
        </Table>
      </Container>
    </>
  );
};
