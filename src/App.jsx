import {RouterProvider,createBrowserRouter} from "react-router-dom";
import Login from "./page/login/login";
import HomePage from "./page/home/home";
import AddPage from "./page/add/add";
import FoodPage from "./page/food/food";
import Environment from "./page/environment/environment";
import Profile from "./page/profile/profile";

function Koi() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/add",
      element: <AddPage/>,
    },
    {
      path: "/food",
      element: <FoodPage/>,
    },
    {
      path: "/environment",
      element: <Environment/>,
    },
    {
      path: "/profile",
      element: <Profile/>,
    },
  ]);

  return <RouterProvider router={router}/>;
}

export default Koi;