import { useRoutes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
}

export default Router;
