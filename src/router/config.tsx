import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Home from "../pages/home/page";
import Lazy from "./Lazy";

// Pages secondaires chargées à la demande pour alléger la page d'accueil
const NotFound = lazy(() => import("../pages/NotFound"));
const CheckoutPage = lazy(() => import("../pages/checkout/page"));
const CheckoutSuccessPage = lazy(() => import("../pages/checkout/success"));
const CheckoutCancelPage = lazy(() => import("../pages/checkout/cancel"));
const LoginPage = lazy(() => import("../pages/auth/login"));
const SignUpPage = lazy(() => import("../pages/auth/signup"));
const AccountPage = lazy(() => import("../pages/account/page"));


const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/checkout",
    element: <Lazy><CheckoutPage /></Lazy>,
  },
  {
    path: "/checkout/success",
    element: <Lazy><CheckoutSuccessPage /></Lazy>,
  },
  {
    path: "/checkout/cancel",
    element: <Lazy><CheckoutCancelPage /></Lazy>,
  },
  {
    path: "/connexion",
    element: <Lazy><LoginPage /></Lazy>,
  },
  {
    path: "/inscription",
    element: <Lazy><SignUpPage /></Lazy>,
  },
  {
    path: "/mon-compte",
    element: <Lazy><AccountPage /></Lazy>,
  },
  {
    path: "*",
    element: <Lazy><NotFound /></Lazy>,
  },
];

export default routes;