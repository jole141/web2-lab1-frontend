import React, { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "../auth/AuthButton";
import styled from "styled-components";
import { colors } from "../../constants/colors";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 4rem;
  background-color: ${colors.dark};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.white};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

export const Header: FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      prompt: "login",
      screen_hint: "signup",
      appState: {
        returnTo: "/",
      },
    });
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      prompt: "login",
      appState: {
        returnTo: "/",
      },
    });
  };

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    <HeaderContainer>
      <Title>HNL Rezultati</Title>
      {!isAuthenticated ? (
        <span>
          <AuthButton label="Sign Up" onClick={handleSignUp} />
          <AuthButton
            color={colors.white}
            backgroundColor={colors.primary}
            label="Login"
            onClick={handleLogin}
          />
        </span>
      ) : (
        <>
          <AuthButton
            color={colors.white}
            backgroundColor={colors.error}
            label="Log Out"
            onClick={handleLogout}
          />
        </>
      )}
    </HeaderContainer>
  );
};

export default Header;
