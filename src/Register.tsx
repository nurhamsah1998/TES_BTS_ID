/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AXIOS from "./axios";
import { useNavigate } from "react-router-dom";

interface REGISTER_PAYLOAD {
  password: string;
  username: string;
  email: string;
}
function Register() {
  const nav = useNavigate();
  const [request, setRequest] = useState<REGISTER_PAYLOAD>({
    email: "",
    password: "",
    username: "",
  });
  const handleSubmit = async (i: any) => {
    i.preventDefault();
    try {
      await AXIOS.post("/register", { ...request });
      nav("/register");
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
        <label style={{ marginTop: "10px" }}>Email</label>
        <input
          onChange={(i) =>
            setRequest((prev: any) => ({ ...prev, email: i.target.value }))
          }
          value={request.email}
          type="email"
        />
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
