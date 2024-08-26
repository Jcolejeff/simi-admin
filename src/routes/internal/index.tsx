import CONSTANTS from 'constant';
import Orders from 'pages/app/orders';
import Users from 'pages/app/users';
import Products from 'pages/app/products';
import CreateCoupon from 'pages/app/create-coupon';
import FoodBundles from 'pages/app/food-bundles';
import FlashSales from 'pages/app/flash-sales';
import Dashboard from 'pages/app/dashboard';
import Categories from 'pages/app/categories';
import Notifications from 'pages/app/notifications';
import TogglePage from 'pages/app/toggle-page';
import Coupons from 'pages/app/coupons';
import UserProfile from 'pages/app/user-profile';
import Settings from 'pages/app/settings';
import FAQPage from 'pages/app/faq';
import DeliveryFeePage from 'pages/app/delivery-fee';
import FarmOfftake from 'pages/app/farm-offtake';
import SingleBlog from 'pages/inner-pages/single-blog';
import WalletsPage from 'pages/app/wallets';
import SinglePatient from 'pages/inner-pages/single-patient';
import { routeTypes, routesInterface } from 'types';
import CreateCategory from 'pages/app/create-category';
import CreateSubCategory from 'pages/app/create-subCategory';
import CreateNewProduct from 'pages/app/create-new-product';
import CreateFoodBundle from 'pages/app/create-food-bundle';
import CreateFlashSale from 'pages/app/create-flash-sale';
import CreateFAQ from 'pages/app/create-faq';
import CreateDeliveryFee from 'pages/app/create-delivery-fee';
import CreateFarmOfftake from 'pages/app/create-farm-offtake';
import AllBlogs from 'pages/app/blogs';
import CreateBlog from 'pages/app/create-blog';

const internalRoute: routeTypes = [
  {
    element: <AllBlogs />,
    path: 'dashboard',
  },
  {
    element: <CreateCategory />,
    path: 'create-category',
  },
  {
    element: <CreateSubCategory />,
    path: 'create-sub-category',
  },
  {
    element: <Categories />,
    path: 'categories',
  },
  {
    element: <Users />,
    path: 'users',
  },
  {
    element: <Users />,
    path: 'users',
  },
  {
    element: <TogglePage />,
    path: 'toggle',
  },
  {
    element: <WalletsPage />,
    path: 'wallets',
  },
  {
    element: <UserProfile />,
    path: 'profile',
  },

  {
    element: <Orders />,
    path: 'orders',
  },
  {
    element: <FlashSales />,
    path: 'flash-sales',
  },
  {
    element: <Products />,
    path: 'products',
  },
  {
    element: <AllBlogs />,
    path: 'blogs',
  },
  {
    element: <CreateCoupon />,
    path: 'create-coupon',
  },
  {
    element: <FoodBundles />,
    path: 'food-bundles',
  },
  {
    element: <Settings />,
    path: 'settings',
  },

  {
    element: <CreateFoodBundle />,
    path: 'create-food-bundle',
  },
  {
    element: <CreateBlog />,
    path: 'create-blog',
  },
  {
    element: <CreateFlashSale />,
    path: 'create-flash-sale',
  },

  {
    element: <Notifications />,
    path: 'notifications',
  },

  {
    element: <Coupons />,
    path: 'coupons',
  },
  {
    element: <CreateNewProduct />,
    path: 'create-new-product',
  },
  {
    element: <FarmOfftake />,
    path: 'farm-offtake',
  },
  {
    element: <CreateFarmOfftake />,
    path: 'create-farm-offtake',
  },
  {
    element: <FAQPage />,
    path: 'faq',
  },
  {
    element: <CreateFAQ />,
    path: 'create-faq',
  },
  {
    element: <DeliveryFeePage />,
    path: 'delivery-fee',
  },
  {
    element: <CreateDeliveryFee />,
    path: 'create-delivery-fee',
  },
];

export const innerInternalRoutes: routesInterface<string>[] = [
  { element: <SingleBlog />, path: `${CONSTANTS.ROUTES.blogs}/:id` },
];

export default internalRoute;
