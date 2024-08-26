import FunkyPagesHero from 'components/general/FunkyPagesHero';
import PillTabs from 'components/general/PillTabs';
import SearchComboBox from 'components/general/SearchComboBox';
import { useEffect, useState } from 'react';
import demoAd from 'assets/image/dashboardAdSample.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Icon, { iconTypes } from 'utils/Icon';
import BlogCard from 'components/general/ProductCard';
import blogImg from 'assets/image/blogImg.png?format=webp&w=330&h=280&imagetools';
import dpIcon from 'assets/image/demoDp.jpg?format=webp&imagetools';
import BtsCard from 'components/general/BtsCard';
import filmImg from 'assets/image/heyyou.png?format=webp&w=240&h=153&imagetools';
import AssetCard from 'components/general/AssetCard';
import assetImg from 'assets/image/assetFilmImg.png';
import { shimmer, toBase64 } from 'utils/general/shimmer';
import { useQuery } from '@tanstack/react-query';
import { apiInterface, contentApiItemInterface, productInterface } from 'types';
import contentService from 'services/content';
import { processError } from 'helper/error';
import CONSTANTS from 'constant';
import ContentLoader from 'components/general/ContentLoader';
import EmptyContentWrapper from 'components/Hocs/EmptyContentWrapper';
import productService from 'services/product';
import { filterStringsContainingImageExtensions } from 'helper';
import { useNavigate } from 'react-router-dom';
import { data } from './dashboardData';
import { cn } from 'lib/utils';
import PieChartComponent from 'components/general/Charts/PieChart';
import LineChartComponent from 'components/general/Charts/LineChart';
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
import { Button } from 'components/shadcn/ui/button';
import { ChevronDown, Filter } from 'lucide-react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from 'firebase';
import TextContentLoader from 'components/Loaders/TextContentLoader';
import useStore from 'store';
import InlineLoader from 'components/Loaders/InlineLoader';

type filterTypes = 'All' | 'Adverts' | 'Blog Posts' | 'BTS' | 'Assets' | 'Upcoming Events';

const generalFilters: filterTypes[] = [
  'All',
  'Adverts',
  'Blog Posts',
  'BTS',
  'Assets',
  'Upcoming Events',
];

const Dashboard = () => {
  const [currFilter, setCurrFilter] = useState<filterTypes>('All');
  const [position, setPosition] = useState('bottom');
  //TODO: handle key searchparam of type filterTypes

  const { currentUser, authDetails } = useStore((state) => state);
  const navigate = useNavigate();

  async function fetchCountAndPrepareData(
    collectionName: string,
    iconName: iconTypes,
    subHeadingText: string,
    link: string,
  ) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getCountFromServer(collectionRef); // Assuming getCountFromServer works as expected
    return {
      subHeading: subHeadingText,
      count: snapshot.data().count,
      link: link,
      icons: (
        <Icon
          svgProp={{
            width: 18,
            height: 18,
            className: 'text-white color-white fill-white stroke-white  ',
          }}
          name={iconName}
        />
      ),
    };
  }

  const { data: counts, isLoading } = useQuery({
    queryKey: ['get-counts'],
    queryFn: async () => {
      // Define an array of collections and their corresponding UI info
      const collectionsInfo: { name: string; icon: iconTypes; text: string; link: string }[] = [
        { name: 'users', icon: 'RegUsers', text: 'Registered Users', link: 'users' },
        { name: 'userOrders', icon: 'Orders', text: 'Orders', link: 'orders' },
        { name: 'flashsales', icon: 'FlashSale', text: 'Flash sale products', link: 'flash-sales' },
        { name: 'products', icon: 'Products', text: 'Products', link: 'products' },
        { name: 'categories', icon: 'Categories', text: 'Categories', link: 'categories' },
        { name: 'subcategories', icon: 'SubCat', text: 'SubCategories', link: 'categories' },
      ];

      // Use Promise.all to fetch all counts concurrently
      const countsData = await Promise.all(
        collectionsInfo.map((info) =>
          fetchCountAndPrepareData(info.name, info.icon, info.text, info.link),
        ),
      );

      return countsData;
    },
    onError: (err) => {
      processError(err);
    },
  });

  return (
    <div className='container flex h-full w-full flex-col overflow-auto px-container-base py-[1rem] pb-10 md:px-container-md'>
      {/* <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold'>Welcome Edmund</h3>
        <div className='flex  gap-3'>
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
      </div> */}
      <section className=' grid gap-[4rem]  rounded-lg md:grid-cols-[2fr_1fr] '>
        <div>
          <h3 className=' mb-16 text-base font-semibold md:text-2xl'>
            Welcome
            {authDetails?.displayName ? ` ${authDetails?.displayName}` : ' Edmund'}
          </h3>
          <InlineLoader isLoading={isLoading}>
            <div
              className={cn(
                `}   grid cursor-pointer grid-cols-[1fr] gap-[2rem] rounded-lg rounded-lg  transition-all  duration-500 ease-in-out md:grid-cols-[1fr_1fr_1fr]  xxl:grid-cols-[1fr_1fr_1fr]`,
              )}
            >
              {counts?.map((item, key) => {
                return (
                  <div
                    onClick={() => navigate(`/app/${item.link}`)}
                    className=' flex items-center  gap-4 rounded-lg  px-4  py-3 shadow-md'
                    key={key}
                  >
                    <div className='flex items-center justify-center rounded-lg bg-primary-3 px-4 py-4 '>
                      {item.icons}
                    </div>
                    <div className='  flex-col gap-1'>
                      <p className='font-bold md:text-[0.9rem]'>{item.count}</p>
                      <h3 className='text-[0.65rem]'>{item.subHeading}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </InlineLoader>
          <div className='mt-12 hidden md:block'>
            <p className='mb-10 text-lg font-medium text-primary-1'>Statistical Chart</p>
            <LineChartComponent />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='hidden text-end text-[0.75rem] text-gray-400 md:block'>
            Today: 10:23am, 30th Oct 2023
          </p>
          <div className='mb-12 hidden gap-3  md:flex'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='group flex w-8/12 items-center justify-center gap-2 rounded-[5px]  border-0   px-2 py-4 text-base  font-semibold shadow-md transition-all duration-300 ease-in-out hover:opacity-90'
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
          <p className=' text-lg  font-medium text-primary-1'>Today’s activity</p>
          <p className=' text-xs'>Today</p>
          <PieChartComponent />
          <div className='mt-6 space-y-4'>
            <div className=' flex  items-center gap-2 '>
              <div className='h-5 w-5 rounded-sm bg-[#00BABA]'></div>
              <p className='text-[0.65rem]'>Products ordered</p>
            </div>
            <div className=' flex items-center gap-2 '>
              <div className='h-5 w-5 rounded-sm bg-[#EADB55]'></div>
              <p className='text-[0.65rem]'>Transactions</p>
            </div>
          </div>
          <div className='mt-8 flex flex-col gap-3 border-t-2 border-t-gray-100 pt-6'>
            <p className=' text-lg font-medium text-primary-1'>Recent Activity</p>

            <section className='justify-between space-y-4 md:flex md:space-y-0'>
              <div>
                <p className=' text-xs font-medium'>Registered users</p>

                <div className='mt-6 space-y-4'>
                  <div className=' flex  items-center gap-2 '>
                    <p className='text-[0.65rem]'>5:08 AM</p>
                    <p className='text-[0.65rem]'>Yemi lawal new user</p>
                  </div>
                  <div className=' flex  items-center gap-2 '>
                    <p className='text-[0.65rem]'>5:08 AM</p>
                    <p className='text-[0.65rem]'>Yemi lawal new user</p>
                  </div>
                </div>
              </div>
              <div>
                <p className='text-xs font-medium md:text-end'>Recent orders</p>

                <div className='mt-6 space-y-4'>
                  <div className=' flex  items-center gap-2 '>
                    <p className='text-[0.65rem]'>5:08 AM</p>
                    <p className='text-[0.65rem]'>Products ordered</p>
                  </div>
                  <div className=' flex  items-center gap-2 '>
                    <p className='text-[0.65rem]'>5:08 AM</p>
                    <p className='text-[0.65rem]'>Products ordered</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
