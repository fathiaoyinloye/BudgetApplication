import {createBrowserRouter} from "react-router";
import Login from "../auth/login/Login";
import LandingPage from "../landingPage/LandingPage";
import SignUp from "../auth/signUp/SignUp";
import Dashboard from "../dashboard/Dashboard";
import Budget from "../budget/Budget";

  const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>

    },



    {
        path: "/",
        element: <LandingPage/>
    },
    {
        path:"/landingpage",
        element: <LandingPage/>

    },

    {path:"/signup", element: <SignUp/>},
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/budget", element: <Budget /> }



])


export default router;