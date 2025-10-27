import React from "react";
import Login from "./components/Login";
import Curriculum from "./components/Curriculum";

function App() {
  const userDataRaw = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const logged = !!userDataRaw;

  return logged ? <Curriculum /> : <Login />;
}

export default App;
