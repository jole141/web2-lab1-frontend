import React, { FC, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../../components/Header";

export const Homepage: FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = React.useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <>
      <Header />
      <div>{accessToken}</div>
    </>
  );
};
