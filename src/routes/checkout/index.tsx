import ForgotPassword from 'pages/onboarding/ForgotPassword';
import Login from 'pages/onboarding/Login';
import ResetPassword from 'pages/onboarding/ResetPassword';
import SignUp from 'pages/onboarding/SignUp';
import VerifyEmail from 'pages/onboarding/VerifyEmail';
import { routeTypes } from 'types';

const checkOutRoutes: routeTypes = [
  {
    element: <Login />,
    path: 'login',
  },
  {
    element: <SignUp />,
    path: 'create-account',
  },

  {
    element: <ForgotPassword />,
    path: 'forgot-password',
  },
  {
    element: <ResetPassword />,
    path: 'reset-password',
  },
  {
    element: <VerifyEmail />,
    path: 'verify-email',
  },
];

export default checkOutRoutes;
