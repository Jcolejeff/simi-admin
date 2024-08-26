import CONSTANTS from 'constant';
import Home from 'pages/external/home';

import SingleBlogExternal from 'pages/inner-pages/single-blog-external';
import { routeTypes, routesInterface } from 'types';
import Login from 'pages/onboarding/Login';

const externalRoute: routeTypes = [
  {
    element: <Login />,
    path: '',
  },

  // {

  // {
  //   element: <Faq />,
  //   path: 'faqs',
  // },
  // {
  //   element: <About />,
  //   path: 'about',
  // },

  //
  // {
  //   element: <PrivacyPolicy />,
  //   path: 'privacy-policy',
  // },
];

export const innerExternalRoutes: routesInterface<string>[] = [
  { element: <SingleBlogExternal />, path: `${CONSTANTS.ROUTES.blogs}/:id` },
];

export default externalRoute;
