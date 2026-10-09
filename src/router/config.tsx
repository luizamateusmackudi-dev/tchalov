import { lazy, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { supabaseActif } from "../lib/supabase";
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

// Comptes désactivés tant que Supabase n'est pas branché : retour à l'accueil
const siComptes = (page: ReactElement) => (supabaseActif ? page : <Navigate to="/" replace />);


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
    element: siComptes(<Lazy><LoginPage /></Lazy>),
  },
  {
    path: "/inscription",
    element: siComptes(<Lazy><SignUpPage /></Lazy>),
  },
  {
    path: "/mon-compte",
    element: siComptes(<Lazy><AccountPage /></Lazy>),
  },
  {
    path: "*",
    element: <Lazy><NotFound /></Lazy>,
  },
];

export default routes;