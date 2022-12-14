import React from "react";
import { Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { useAuth0 } from "@auth0/auth0-react";
import { Matches } from "./pages/Matches";
import { Comments } from "./pages/Comments";
import Loader from "./components/Loader";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/utakmice" element={<Matches />} />
      <Route path="/komentari/:id" element={<Comments />} />
    </Routes>
  );
}

export default App;
