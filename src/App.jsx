import {RouterProvider,createBrowserRouter} from "react-router-dom";
import Login from "./page/login/login";
import HomePage from "./page/home/home";
import AddPage from "./page/add/add";
import FoodPage from "./page/food/food";
import Environment from "./page/environment/environment";
import Viewpond from "./page/view/viewpond";
import Viewproduct from "./page/viewproduct/viewproduct";
import Cart from "./page/cart/cart";

import Contact from "./page/contact/contact";
import News from "./page/news/news";


import Profile from "./page/profile/profile";
import Mykoi from "./page/mykoi/mykoi";
import List from "./page/list/list";


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
      path: "/view",
      element: <Viewpond/>,
    },
    {
      path: "/viewproduct",
      element: <Viewproduct/>,
    },
    {
      path: "/cart",
      element: <Cart/>,
    },
    {

      path: "/contact",
      element: <Contact/>,
    },
    {
      path: "/news",
      element: <News/>,
<<<<<<< HEAD
=======

      path: "/profile",
      element: <Profile/>,
>>>>>>> ff8a571c10acfe3dd98fa37507ee8b063b1b3021
    },
    {
      path: "/mykoi",
      element: <Mykoi/>,
    },
    {
      path: "/list",
      element: <List/>,
<<<<<<< HEAD
    },
    {
      path: "/profile",
      element: <Profile/>,
=======

>>>>>>> ff8a571c10acfe3dd98fa37507ee8b063b1b3021
    },
  ]);

  return <RouterProvider router={router}/>;
}

export default Koi;