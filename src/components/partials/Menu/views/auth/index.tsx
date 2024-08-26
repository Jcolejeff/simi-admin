import { IDropNavTitles, menuLinks } from 'components/partials/app-nav';
import { sideNavLinks } from 'components/partials/side-nav';
import { DropdownMenuSeparator } from 'components/shadcn/dropdown-menu';
import CONSTANTS from 'constant';
import usePlan from 'hooks/business-logic/usePlan';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from 'store';
import Icon from 'utils/Icon';
import { Avatar, AvatarFallback, AvatarImage } from 'components/shadcn/ui/avatar';

const AuthMenu = ({ close }: { close: () => void }) => {
  const { authDetails } = useStore((state) => state);
  const nav = useNavigate();

  const navigate = (i: string) => {
    close();
    nav(i);
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
    <div className='flex h-full w-full flex-col gap-[2.125rem]'>
      <div className='flex flex-col'>
        {sideNavLinks?.map((i, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/app/${i?.link}`)}
            className={`group flex cursor-pointer items-center  gap-[0.625rem] rounded-[8px] p-4 transition-all hover:bg-primary-6 hover:text-primary-1`}
          >
            {i?.icons}
            <span className='text-[16px] font-[400] leading-[20px]'>{i?.title}</span>
          </div>
        ))}
      </div>

      <DropdownMenuSeparator className='border-b-2 border-extraColor-borderBottom-2' />
      <div className='flex flex-col '>
        <div className='mb-4 flex items-center gap-2 px-4'>
          <div className='h-max w-max rounded-[50px] border border-extraColor-borderBottom-2'>
            <Avatar>
              <AvatarImage
                src={authDetails?.photoURL || 'https://github.com/shadcn.png'}
                alt='user'
                className='h-full w-full rounded-full object-cover'
              />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-col text-[14px] tracking-[0.15px]'>
            <h6 className='font-inter font-[600] text-textColor-primary'>
              {authDetails?.displayName}
            </h6>
            <span className='text-[12px] font-[400] leading-[14px] tracking-[0.4px] text-textColor-disabled'>
              Admin User
            </span>
          </div>
        </div>
        {menuLinks['level1']?.map((i, idx) => (
          <div
            onClick={() => navigate(`/app/${i?.link}`)}
            key={idx}
            className='flex cursor-pointer items-center gap-[0.63rem]  p-4 text-[14px] leading-[21px] tracking-[0.15px]  transition-colors duration-300 ease-in-out hover:text-textColor-primary'
          >
            <div className='flex items-center'>{i?.icons}</div>
            <div className='flex flex-grow justify-between'>
              {' '}
              <span>{i?.title}</span>
              {tags[i?.title]}
            </div>
          </div>
        ))}
        {menuLinks['level2']
          ?.filter((i) => i?.title === 'Settings')
          ?.map((i, idx) => (
            <div
              onClick={() => navigate(`/app/${i?.link}`)}
              key={idx}
              className='flex cursor-pointer items-center gap-[0.63rem]  p-4 text-[14px] leading-[21px] tracking-[0.15px]  transition-colors duration-300 ease-in-out hover:text-textColor-primary'
            >
              <div className='flex items-center'>{i?.icons}</div>
              <div className='flex flex-grow justify-between'>
                {' '}
                <span>{i?.title}</span>
                {tags[i?.title]}
              </div>
            </div>
          ))}
        {menuLinks['level3']?.map((i, idx) => (
          <div
            onClick={() => navigate(`/app/${i?.link}`)}
            key={idx}
            className='flex cursor-pointer items-center gap-[0.63rem] p-4 text-[14px] leading-[21px] tracking-[0.15px] text-danger-2 transition-colors duration-300 ease-in-out hover:text-danger-1'
          >
            <div className='flex items-center'>{i?.icons}</div>
            <div className='flex flex-grow justify-between'>
              {' '}
              <span>{i?.title}</span>
              {tags[i?.title]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthMenu;
