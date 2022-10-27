import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../../constants/colors";
import { CustomButtonSecondary, Input } from "../../pages/Matches";
import { useAuth0 } from "@auth0/auth0-react";
import { convertTimestampToDate, isUserAdmin } from "../../utils";
import Loader from "../Loader";
import {
  deleteComment,
  deleteCommentAdmin,
  updateComment,
} from "../../api/api";

const CommentContainer = styled.div`
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

const Text = styled.div`
  font-size: 0.9rem;
  color: ${colors.dark};
  margin-bottom: 0.5rem;
`;

interface CommentProps {
  id: number;
  owner: string;
  text: string;
  getComments: (id: string) => Promise<void>;
  matchId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  datetime: string;
}

export const Comment: FC<CommentProps> = ({
  id,
  owner,
  text,
  getComments,
  matchId,
  setIsLoading,
  datetime,
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [commentText, setCommentText] = React.useState(text);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState("");

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const editComment = async () => {
    setEditMode(false);
    setIsLoading(true);
    await updateComment(id.toString(), commentText, accessToken);
    await getComments(matchId);
    setIsLoading(false);
  };

  const removeComment = async () => {
    setEditMode(false);
    setIsLoading(true);
    await deleteComment(id.toString(), accessToken);
    await getComments(matchId);
    setIsLoading(false);
  };

  const removeCommentAdmin = async () => {
    setEditMode(false);
    setIsLoading(true);
    await deleteCommentAdmin(id.toString(), accessToken);
    await getComments(matchId);
    setIsLoading(false);
  };

  const getUserInfo = async () => {
    setIsAdmin(isUserAdmin(user?.name!));
  };

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  return (
    <CommentContainer>
      <Owner>{`${owner}  ${convertTimestampToDate(datetime)}`}</Owner>
      {!editMode ? (
        <Text>{text}</Text>
      ) : (
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: "90%" }}
        />
      )}
      {user && user.name === owner && editMode && (
        <CustomButtonSecondary onClick={editComment}>
          Spremi
        </CustomButtonSecondary>
      )}
      {user && user.name === owner && !editMode && (
        <span>
          <CustomButtonSecondary onClick={() => setEditMode(true)}>
            Uredi
          </CustomButtonSecondary>
          <CustomButtonSecondary onClick={removeComment}>
            Izbriši
          </CustomButtonSecondary>
        </span>
      )}
      {user && isAdmin && !editMode && user.name !== owner && (
        <CustomButtonSecondary onClick={removeCommentAdmin}>
          Izbriši
        </CustomButtonSecondary>
      )}
    </CommentContainer>
  );
};

export default Comment;
