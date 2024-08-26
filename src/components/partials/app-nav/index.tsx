import Icon from 'utils/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/shadcn/dropdown-menu';
import { ItitleLinks, routePathTypes } from 'types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'assets/svg/nfmLogo.svg';
import { Avatar, AvatarFallback, AvatarImage } from 'components/shadcn/ui/avatar';

// import { useWindowSize } from 'usehooks-ts';
import Menu from '../Menu';
import useStore from 'store';
import { firstCharsOfWords } from 'helper';
import CONSTANTS from 'constant';

export type IDropNavTitles = 'Profile' | 'Chat' | 'Settings' | 'Subscription' | 'FAQ' | 'Logout';

interface extendedRoutesInterface extends ItitleLinks<IDropNavTitles, routePathTypes> {
  icons: JSX.Element;
}

interface IDropNavLinks {
  level1: extendedRoutesInterface[];
  level2: extendedRoutesInterface[];
  level3: extendedRoutesInterface[];
}

export const menuLinks: IDropNavLinks = {
  level1: [{ icons: <Icon name='profileIcon' />, link: `profile`, title: `Profile` }],
  level2: [{ icons: <Icon name='settingIcon' />, link: `settings`, title: `Settings` }],
  level3: [{ icons: <Icon name='exitIcon' />, link: `login`, title: `Logout` }],
};

const AppNav = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const { authDetails, loggedIn, setAuthDetails, setLoggedIn, setCurrentUser } = useStore(
    (store) => store,
  );

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };
  const tags = useMemo(() => {
    const chatCount = 2;
    return {
      Chat: chatCount ? (
        <div className='grid h-[20px] w-[20px] place-items-center rounded-[64px] bg-danger-1 text-[12px] leading-[20px] tracking-[0.14px] text-white'>
          {chatCount}
        </div>
      ) : (
        <></>
      ),
    } as Record<IDropNavTitles, JSX.Element>;
  }, []);

  return (
    <>
      <nav
        className={` container sticky left-0 right-0 z-40  h-max w-full max-w-[180.75rem]  border-b border-b-extraColor-borderBottom-3 transition-all duration-300 ease-in-out  md:border-0 md:px-container-base md:pt-[0.75rem]`}
      >
        <div className=' hidden h-full w-full items-center justify-between bg-white  pt-2       md:flex md:px-container-base'>
          <div className='h-[3rem] '>
            <img src={Logo} alt='logo' className='h-full w-[5rem]' />
          </div>
          <div className='relative max-w-[400px] md:w-full  '>
            <div className='rounded-[12px] bg-slate-100/60  px-[1.125rem] py-[0.175rem]  shadow-sm md:w-full'>
              <div className='flex h-full w-full items-center'>
                <Icon name='searchIcon' svgProp={{ className: 'text-primary-9 w-4' }} />
                <div className='flex-grow'>
                  <input
                    className='form-input border-0 bg-inherit placeholder:text-textColor-disabled focus:!ring-0 md:w-full'
                    placeholder='Search'
                    type='text'
                    value={searchInput}
                    onChange={handleSearchInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='flex  items-center gap-[1.125rem]'>
            <button
              onClick={() => {
                navigate(`/app/${CONSTANTS.ROUTES.notifications}`);
              }}
            >
              <Icon name='notificationIcon' />
            </button>
            <button
              onClick={() => {
                navigate(`/app/${CONSTANTS.ROUTES.settings}`);
              }}
            >
              <Icon name='settingIcon' />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`focus-within:outline-0 focus-within:ring-0 focus:ring-0 active:ring-0`}
              >
                <Avatar>
                  <AvatarImage
                    src={authDetails?.photoURL || 'https://github.com/shadcn.png'}
                    alt='user'
                    className='h-full w-full rounded-full object-cover'
                  />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='mr-[1.5rem] w-[14.375rem]  bg-white shadow-5'>
                <DropdownMenuLabel className='flex items-center gap-[0.625rem] !px-[1.25rem] !py-[0.875rem]'>
                  <Avatar>
                    <AvatarImage
                      src={authDetails?.photoURL || 'https://github.com/shadcn.png'}
                      alt='user'
                      className='h-full w-full rounded-full object-cover'
                    />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col text-[14px] tracking-[0.15px]'>
                    <h6 className='font-inter font-[600] text-textColor-primary'>
                      {authDetails?.displayName} {authDetails?.data?.last_name}
                    </h6>
                    <span className='mt-2 text-[12px] font-[400] leading-[14px] tracking-[0.4px] text-textColor-disabled'>
                      Admin User
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='border-b border-b-extraColor-divider' />
                {menuLinks['level1']?.map((i, idx) => (
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/app/${i?.link}`);
                    }}
                    key={idx}
                    className='flex cursor-pointer items-center gap-[0.75rem] !px-[1.25rem] !py-[0.75rem] text-[14px] leading-[21px] tracking-[0.15px] text-textColor-primary'
                  >
                    <div className='flex items-center'>{i?.icons}</div>
                    <div className='flex flex-grow justify-between'>
                      {' '}
                      <span>{i?.title}</span>
                      {tags[i?.title]}
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className='border-b border-b-extraColor-divider' />

                {menuLinks['level3']?.map((i, idx) => (
                  <DropdownMenuItem
                    onClick={() => {
                      setAuthDetails({});
                      setCurrentUser({});
                      setLoggedIn(false);
                    }}
                    key={idx}
                    className='flex cursor-pointer items-center gap-[0.75rem] !px-[1.25rem] !py-[0.75rem] text-[14px] leading-[21px] tracking-[0.15px] text-textColor-primary'
                  >
                    <div className='flex items-center'>{i?.icons}</div>
                    <span>{i?.title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Icon name='notificationIcon' /> */}
          </div>
        </div>
        <div className='flex  w-full items-center justify-between px-container-base py-[.875rem] md:hidden '>
          <div
            className='flex cursor-pointer items-center gap-[0.39rem] md:gap-[0.625rem]'
            onClick={() => navigate(`/`)}
          >
            <div className=''>
              <img src={Logo} alt='logo' className=' w-[3rem]' />
            </div>
          </div>
          <div className='flex items-center'>
            {' '}
            <Menu />{' '}
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppNav;
