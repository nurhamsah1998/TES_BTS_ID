import { useEffect } from "react";
import Router from "./Router";
import { useNavigate } from "react-router-dom";

function App() {
  const nav = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("TOKEN")) {
      nav("/login");
    }
  }, []);
  return <Router />;
}

export default App;
