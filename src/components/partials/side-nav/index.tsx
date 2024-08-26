import CONSTANTS from 'constant';
import usePlan from 'hooks/business-logic/usePlan';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from 'store';
import { ItitleLinks, planTypes, routePathTypes } from 'types';
import Icon from 'utils/Icon';
import { cn } from 'lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type ISideNavTitles =
  | 'Blogs'
  | 'General Forums'
  | 'Professional Forums'
  | 'Behind The Scenes'
  | 'Assets and Templates'
  | 'CV Profile'
  | 'Consultancy'
  | 'Advertise a Service'
  | 'Online Training'
  | 'Master Classes'
  | 'Bi-annual Bootcamps'
  | 'Dashboard'
  | 'Users'
  | 'Orders'
  | 'Products'
  | 'Categories'
  | 'Flash Sales'
  | 'Coupons'
  | 'Settings'
  | 'Reports'
  | 'Settings'
  | 'Food Bundles'
  | 'Farm Off-Take'
  | 'FAQ'
  | 'Wallets'
  | 'Toggle Page'
  | 'Delivery Fees';

interface extendedRouteInterface extends ItitleLinks<ISideNavTitles, routePathTypes> {
  icons: JSX.Element;
}

interface ISideNavLinks {
  discussions: extendedRouteInterface[];
}

export const sideNavLinks: extendedRouteInterface[] = [
  {
    link: 'dashboard',
    title: 'Dashboard',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 22.75,
          className: 'text-current',
        }}
        name='dashboardIcon'
      />
    ),
  },
  {
    link: 'users',
    title: 'Users',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 22.75,
          className: 'text-current',
        }}
        name='Users'
      />
    ),
  },
  {
    link: 'wallets',
    title: 'Wallets',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 22.75,
          className: 'text-current',
        }}
        name='CouponsIcon'
      />
    ),
  },

  {
    link: 'orders',
    title: 'Orders',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 20.75,
          className: 'text-current',
        }}
        name='OrderIcon'
      />
    ),
  },
  {
    link: 'products',
    title: 'Products',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 17.75,
          className: 'text-current',
        }}
        name='ProductIcon'
      />
    ),
  },
  {
    link: 'categories',
    title: 'Categories',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 22.75,
          className: 'text-current',
        }}
        name='CategoryIcon'
      />
    ),
  },
  // {
  //   link: 'flash-sales',
  //   title: 'Flash Sales',
  //   icons: (
  //     <Icon
  //       svgProp={{
  //         width: 22.75,
  //         height: 20.75,
  //         className: 'text-current',
  //       }}
  //       name='FlashSaleIcon'
  //     />
  //   ),
  // },
  // {
  //   link: 'food-bundles',
  //   title: 'Food Bundles',

  //   icons: (
  //     <Icon
  //       svgProp={{
  //         width: 22.75,
  //         height: 20.75,
  //         className: 'text-current',
  //       }}
  //       name='FoodBundleIcon'
  //     />
  //   ),
  // },
  {
    link: 'blogs',
    title: 'Blogs',

    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 20.75,
          className: 'text-current',
        }}
        name='billing'
      />
    ),
  },
  {
    link: 'coupons',
    title: 'Coupons',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 20.75,
          className: 'text-current',
        }}
        name='CouponsIcon'
      />
    ),
  },
  {
    link: 'faq',
    title: 'FAQ',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 20.75,
          className: 'text-current',
        }}
        name='Categories'
      />
    ),
  },
  {
    link: 'settings',
    title: 'Settings',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 20.75,
          className: 'text-current',
        }}
        name='SettingWhite'
      />
    ),
  },
  // {
  //   link: 'farm-offtake',
  //   title: 'Farm Off-Take',

  //   icons: (
  //     <Icon
  //       svgProp={{
  //         width: 22.75,
  //         height: 20.75,
  //         className: 'text-current',
  //       }}
  //       name='FoodBundleIcon'
  //     />
  //   ),
  // },
  {
    link: 'toggle',
    title: 'Toggle Page',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 17.75,
          className: 'text-current',
        }}
        name='ProductIcon'
      />
    ),
  },
  {
    link: 'delivery-fee',
    title: 'Delivery Fees',
    icons: (
      <Icon
        svgProp={{
          width: 22.75,
          height: 22.75,
          className: 'text-current',
        }}
        name='CouponsIcon'
      />
    ),
  },
];

const SideNav = () => {
  const [navOpen, setNavOpen] = useState(true);
  const currentUserPlan = useStore((state) => state.plan);
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div
      className={`sticky bottom-0 top-0 ${
        navOpen ? ` w-[200px] xl:w-[260px]` : `w-[70px]`
      } bg relative flex h-full flex-col bg-primary-3 py-[1.65rem] shadow-3 transition-[width] duration-300 ease-in-out`}
    >
      <button
        onClick={() => setNavOpen((prev) => !prev)}
        className='absolute -right-[11px] top-[2rem] z-10 h-[17px] w-[22px] rounded-[5px] bg-primary-1 ring-[7px] ring-primary-13/80'
      >
        <div className='flex h-full w-full items-center justify-center'>
          {navOpen ? (
            <ArrowLeft className='fill-white text-white' size={12} color='#fff' />
          ) : (
            <ArrowRight className='fill-white text-white' size={12} color='#fff' />
          )}
        </div>
      </button>
      <div className='pb-[2.5rem]'>
        <div
          // onClick={() => navigate(`/app/dashboard`)}
          className='flex cursor-pointer items-center gap-[0.625rem] px-[1rem]'
        >
          <h4
            className={cn(
              ` text-[16px] font-[600] leading-[20px] tracking-[0.15px] text-white   md:font-[700] md:leading-[24px] ${
                navOpen ? `opacity-100 md:px-4 md:text-[22px]` : `opacity-100  md:text-[10px]`
              }  transition-all duration-300 ease-in-out`,
            )}
          >
            Menu
          </h4>
        </div>
      </div>
      <div className='sideNavScroll flex flex-grow flex-col gap-[1.125rem] overflow-y-auto overflow-x-hidden bg-primary-1 pb-3'>
        <div className=' flex flex-col gap-2'>
          {sideNavLinks?.map((i, idx) => (
            <div className='' key={idx}>
              <div
                onClick={() => navigate(`/app/${i?.link}`)}
                className={`flex cursor-pointer items-center  gap-[0.625rem] px-4 py-[0.8rem] text-white  hover:bg-primary-light  2xl:py-2
              
                ${
                  location?.pathname === `/app/${i?.link}`
                    ? `bg-white font-semibold !text-black shadow-md`
                    : ``
                }
                group
                transition duration-300`}
              >
                <div className='flex items-center'>{i?.icons}</div>
                <h6
                  className={`whitespace-nowrap text-[13px] font-[600] leading-[24px]  tracking-[0.15px]
              ${navOpen ? `opacity-100` : `scale-0 opacity-0`}
              duration-300`}
                >
                  {i?.title}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`flex flex-col gap-4 px-[1rem] py-4
              ${navOpen ? `opacity-100` : `scale-0 opacity-0`}
              transition-all duration-300 ease-in-out`}
      >
        <button>
          <div className='flex items-center gap-4 text-white'>
            <Icon
              svgProp={{
                width: 22.75,
                height: 22.75,
              }}
              name='LogOut'
            />
            <h6
              className={`whitespace-nowrap text-[13px] font-[600] leading-[24px] tracking-[0.15px]  text-white
              ${navOpen ? `opacity-100` : `scale-0 opacity-0`}
              duration-300`}
            >
              Log out
            </h6>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
