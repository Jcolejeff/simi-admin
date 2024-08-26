import { useLocation, useNavigate } from 'react-router-dom';
import { ItitleLinks, routePathTypes } from 'types';
import Icon from 'utils/Icon';
import Menu from '../Menu';
import CONSTANTS from 'constant';
import BgTransitionSpan from 'components/animation/bg-transitions-span';
import CoolUnderline from 'components/animation/cool-underline';
import useStore from 'store';
import SearchComboBox from 'components/general/SearchComboBox';

export type navTitleTypes = 'Home' | 'Pricing' | 'Blogs' | 'FAQs' | 'About Us';

export const navLinks: ItitleLinks<navTitleTypes, routePathTypes>[] = [
  {
    link: '',
    title: 'Home',
  },
];

export const ExternalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loggedIn } = useStore((store) => store);

  return (
    <nav className='container sticky left-0 right-0 top-0 z-10 w-full border-b border-extraColor-borderBottom-3 bg-white px-container-base md:border-0 lg:px-container-lg'>
      <div className='flex  w-full items-center justify-between py-[1.375rem] transition-all duration-300 ease-in-out md:border-b md:border-extraColor-borderBottom-1 md:py-[1.5rem] md:pt-[2rem]'>
        <div className='flex items-center gap-[6rem]'>
          <div className='flex cursor-pointer items-center gap-2' onClick={() => navigate(`/`)}>
            <Icon
              name='nfmLogo'
              svgProp={{ className: 'w-[28px] h-[28px] md:w-[30px] md:h-[30px]' }}
            />
            <h4 className='text-[16px] font-[700] leading-[20px] tracking-[0.15px] text-primary-8 md:text-[19px] md:font-[700] md:leading-[24px]'>
              App Assistant
            </h4>
          </div>
        </div>
        <div className='relative w-4/12 max-w-[800px]  '>
          <SearchComboBox />
        </div>
        <div className='flex items-center gap-4 '>
          {loggedIn ? (
            <button
              onClick={() => navigate(`/app/${CONSTANTS.ROUTES.dashboard}`)}
              className='group relative hidden overflow-hidden rounded-[160px] border border-primary-1 px-6 py-2 text-[16px] leading-[24px] tracking-[0.15px]  text-primary-9 transition-colors duration-300 ease-in-out hover:text-white md:inline-flex'
            >
              <BgTransitionSpan className='-mx-6 -mt-2  rounded-[120px] bg-primary-1' />
              <span className='relative'>Go to Dashboard</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate(CONSTANTS.ROUTES.login)}
                className='group relative hidden overflow-hidden rounded-[160px] border border-primary-1 px-6 py-2 text-[16px] leading-[24px] tracking-[0.15px]  text-primary-9 transition-colors duration-300 ease-in-out hover:text-white md:inline-flex'
              >
                <BgTransitionSpan className='-mx-6 -mt-2  rounded-[120px] bg-primary-1' />
                <span className='relative'> Log In</span>
              </button>
              <button
                onClick={() => navigate(CONSTANTS.ROUTES['create-account'])}
                className='hidden rounded-[160px] bg-primary-1 px-6 py-2 text-[16px] leading-[24px] tracking-[0.15px] text-white transition-opacity duration-300 ease-in-out hover:opacity-90 md:flex'
              >
                Sign Up
              </button>
            </>
          )}
          <div className='flex items-center xl:hidden'>
            <Menu />
          </div>
        </div>
      </div>
    </nav>
  );
};
