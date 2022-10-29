import React, { FC } from "react";
import styled from "styled-components";
import { colors } from "../../constants/colors";

const LoaderContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background-color: ${colors.dark};
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  border: 0.5rem solid ${colors.white};
  border-top: 0.5rem solid ${colors.grey};
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  opacity: 1;
`;

export const Loader: FC = () => {
  return (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  );
};

export default Loader;
