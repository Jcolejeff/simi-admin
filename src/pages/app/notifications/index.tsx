import LinksFilter from 'components/general/LinksFilter';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/shadcn/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from 'components/shadcn/ui/button';
import SearchComboBox from 'components/general/SearchComboBox';
import { formatCurrentDateTime } from 'helper';
const Notifications = () => {
  const [position, setPosition] = useState('bottom');
  const tabs = [
    {
      link: ``,
      sublinks: [
        {
          title: `Welcome back, Kindly provide your login details and sign in to your account.`,
          link: ``,
        },
      ],
      title: `New User`,
    },
    {
      link: ``,
      sublinks: [],
      title: `New Order`,
    },
    {
      link: ``,
      sublinks: [],
      title: `New User`,
    },
    {
      link: ``,
      sublinks: [],
      title: `New User`,
    },
    {
      link: ``,
      sublinks: [],
      title: `New Order`,
    },
  ];
  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-6  overflow-auto px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='mb-4 justify-between md:mb-0 md:flex '>
        <div>
          <h3 className='mb-4 text-base font-semibold md:text-2xl'>Notifications</h3>
        </div>
        <div>
          <p className='mb-6 hidden  text-end text-[0.75rem] text-gray-400 md:block'>
            {formatCurrentDateTime()}
          </p>
          <div className='flex   gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='group flex w-6/12 items-center justify-center gap-2 rounded-[5px]  border-0   px-2 py-4 text-base  font-semibold shadow-md transition-all duration-300 ease-in-out hover:opacity-90'
                >
                  <Filter className='w-4 cursor-pointer fill-primary-4 stroke-primary-4   transition-opacity duration-300 ease-in-out hover:opacity-95 active:opacity-100' />
                  <p className='text-[0.65rem] font-[500]'>Filter by</p>
                  <ChevronDown className='w-4 cursor-pointer  transition-opacity duration-300 ease-in-out hover:opacity-95 active:opacity-100' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56 text-[0.65rem]'>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                  <DropdownMenuRadioItem value='top'>Year</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='bottom'>Month</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='right'>Day</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <SearchComboBox />
          </div>
        </div>
      </div>
      <div className='mb-[1.5rem] flex w-full  flex-col justify-center gap-4'>
        {tabs?.map((i, idx) => (
          <div key={idx} className='flex flex-col gap-2 bg-white px-[1.5rem] py-[1.125rem] shadow'>
            <div className='flex items-center gap-2'>
              <span className='cursor-pointer font-semibold leading-[24px] tracking-[0.15px] transition-all duration-100 ease-in-out hover:text-primary-1 hover:underline'>
                {i?.title}
                {i?.sublinks?.length ? `:` : ``}
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-1'>
              {i?.sublinks?.map((j, idx) => (
                <span
                  key={idx}
                  className='cursor-pointer text-[0.7rem]  leading-[24px] tracking-[0.15px] text-primary-9 transition-all duration-100 ease-in-out hover:text-primary-1 hover:underline'
                >
                  {j?.title}
                  {idx !== i?.sublinks?.length - 1 ? `,` : ``}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
