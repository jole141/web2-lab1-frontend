import React, { FC, useState } from "react";
import styled from "styled-components";
import { colors } from "../../constants/colors";

const ModalContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background-color: ${colors.blackOpacity};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled.div`
  width: 40rem;
  max-height: 30rem;
  height: auto;
  background-color: ${colors.white};
  padding: 2rem;
  border-radius: 0.5rem;
  z-index: 101;
`;

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ show, children }) => {
  return (
    <>
      {show && (
        <ModalContainer>
          <Window>{children}</Window>
        </ModalContainer>
      )}
    </>
  );
};

export default Modal;
