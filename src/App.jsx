import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error";
import Login from "./routes/login";
import Co2Chart from "./routes/co2";
import ElecChart from "./routes/elec";
import SignUp from "./routes/signup";
import APIKeys from "./routes/apikey";
import BopChart from "./routes/bop";
import ForgotPassword from "./routes/forgotpassword";
import EnvCheck from './components/envcheck';
import LandingPage from './components/LandingPage';
import CustomRequest from "./routes/customrequest";
import EmissionTracker from "./routes/emissiontracker";
import ElecMix from "./routes/elecmix";
import TrackerManager from "./routes/trackermanager";
import CoalReports from "./routes/coalreports";




function App() {
  const router = createBrowserRouter([
    {
      path: "/", 
      element: <LandingPage />, 
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <Root />, 
      errorElement: <ErrorPage />,
      children: [
        {
          path: "EcoData",
          element: <APIKeys />,
        },
        {
          path: "co2",
          element: <Co2Chart />,
        },
        {
          path: "elec",
          element: <ElecChart />,
        },
        {
          path: "bop",
          element: <BopChart />,
        },
        {
          path: "coalreports",
          element: <CoalReports />,
        },
        {
          path: "envcheck",
          element: <EnvCheck />,
        },
        {
          path: "custom-request",
          element: <CustomRequest />,
        },
        {
          path: "emissiontracker",
          element: <EmissionTracker />,
        },
        {
          path: "trackermanager",
          element: <TrackerManager />,
        },
        {
          path: "elecmix",
          element: <ElecMix />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
      errorElement: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
