import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
]);

export default router;