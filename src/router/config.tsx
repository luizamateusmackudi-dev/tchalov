import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import CheckoutPage from "../pages/checkout/page";
import CheckoutSuccessPage from "../pages/checkout/success";
import CheckoutCancelPage from "../pages/checkout/cancel";
import LoginPage from "../pages/auth/login";
import SignUpPage from "../pages/auth/signup";
import AccountPage from "../pages/account/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/checkout/success",
    element: <CheckoutSuccessPage />,
  },
  {
    path: "/checkout/cancel",
    element: <CheckoutCancelPage />,
  },
  {
    path: "/connexion",
    element: <LoginPage />,
  },
  {
    path: "/inscription",
    element: <SignUpPage />,
  },
  {
    path: "/mon-compte",
    element: <AccountPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;