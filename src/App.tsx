import React from "react";
import { Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>LOADING</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/callback" element={<></>} />
    </Routes>
  );
}

export default App;
