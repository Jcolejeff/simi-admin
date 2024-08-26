import BlogCard from 'components/general/ProductCard';
import FunkyPagesHero from 'components/general/FunkyPagesHero';
import LinksFilter from 'components/general/LinksFilter';
import SearchComboBox from 'components/general/SearchComboBox';
import blogImg from 'assets/image/blogImg.png?format=webp&w=330&h=280&imagetools';
import dpIcon from 'assets/image/demoDp.jpg?format=webp&imagetools';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { shimmer, toBase64 } from 'utils/general/shimmer';
import demoAd from 'assets/image/blogImg.png';
import Icon from 'utils/Icon';
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
import { useQuery } from '@tanstack/react-query';
import contentService from 'services/content';
import { processError } from 'helper/error';
import ContentLoader from 'components/general/ContentLoader';
import { apiInterface, contentApiItemInterface } from 'types';
import FeaturedLoader from 'components/Loaders/FeaturedLoader';
import CONSTANTS from 'constant';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from 'components/shadcn/ui/button';
import UserTableComponent from 'components/Tables/UsersTable/UsersTable';
import { formatCurrentDateTime } from 'helper';

const UserListPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState('bottom');

  // const { data, isLoading } = useQuery<any, any, apiInterface<contentApiItemInterface[]>>({
  //   queryKey: ['get-blogs'],
  //   queryFn: () =>
  //     contentService.getContent({
  //       organization_id: import.meta.env.VITE_TIMBU_ORG_ID,
  //       category: CONSTANTS.TIMBU_KEYS.BLOG_ID,
  //     }),
  //   onError: (err) => {
  //     processError(err);
  //   },
  // });

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col px-container-base  pb-[2.1rem] md:overflow-auto md:px-container-md'>
      <div className='relative grid w-full'>
        <UserTableComponent />
      </div>
    </div>
  );
};

export default UserListPage;
