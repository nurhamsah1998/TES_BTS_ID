/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AXIOS from "./axios";
import { useNavigate } from "react-router-dom";

interface LOGIN_PAYLOAD {
  password: string;
  username: string;
}
function Login() {
  const nav = useNavigate();
  const [request, setRequest] = useState<LOGIN_PAYLOAD>({
    password: "",
    username: "",
  });
  const handleSubmit = async (i: any) => {
    i.preventDefault();
    try {
      const res = await AXIOS.post("/login", { ...request });
      localStorage.setItem("TOKEN", res?.data?.data?.token || "");
      localStorage.setItem("USER", request.username || "");
      nav("/");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("TOKEN")) {
      nav("/");
    }
  }, []);
  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "50%",
        }}
        onSubmit={handleSubmit}
      >
        <label style={{ marginTop: "10px" }}>Username</label>
        <input
          onChange={(i) =>
            setRequest((prev: any) => ({ ...prev, username: i.target.value }))
          }
          value={request.username}
          type="text"
        />
        <label style={{ marginTop: "10px" }}>Password</label>
        <input
          onChange={(i) =>
            setRequest((prev: any) => ({ ...prev, password: i.target.value }))
          }
          value={request.password}
          type="password"
        />
        <button style={{ marginTop: "10px" }} type="submit">
          Login
        </button>
      </form>
      <button
        onClick={() => nav("/register")}
        style={{ marginTop: "10px" }}
        type="submit"
      >
        Register
      </button>
    </div>
  );
}

export default Login;
