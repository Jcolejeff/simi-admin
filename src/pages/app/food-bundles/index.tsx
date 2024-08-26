import FunkyPagesHero from 'components/general/FunkyPagesHero';
import PillTabs from 'components/general/PillTabs';
import SearchComboBox from 'components/general/SearchComboBox';
import { useEffect, useState } from 'react';
import filmImg from 'assets/image/foodImg.jpeg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'components/shadcn/dialog';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { shimmer, toBase64 } from 'utils/general/shimmer';
import { Button } from 'components/shadcn/ui/button';
import productService from 'services/product';
import { processError } from 'helper/error';
import { useQuery } from '@tanstack/react-query';
import { apiInterface, productInterface } from 'types';
import ContentLoader from 'components/general/ContentLoader';
import assetImg from 'assets/image/assetFilmImg.png';
import CONSTANTS from 'constant';
import {
  filterStringsContainingDoc,
  filterStringsContainingImageExtensions,
  formatCurrentDateTime,
} from 'helper';
import FileSaver from 'file-saver';
import { Link, useSearchParams } from 'react-router-dom';
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

import ProductCard from 'components/general/ProductCard';

import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebase';
import useStore from 'store';
import FeaturedLoader from 'components/Loaders/FeaturedLoader';
import Icon from 'utils/Icon';
import { getCreatedDateFromDocument } from 'lib/utils';
import useSortAndSearch from 'hooks/useSearchAndSort';
const FoodBundles = () => {
  const { isEditing, setIsEditing, editData, setEditData } = useStore((state) => state);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriterion, setSortCriterion] = useState('');

  async function fetchProducts() {
    const productsCollectionRef = collection(db, 'foodbundle');

    const querySnapshot = await getDocs(productsCollectionRef);

    const products: any = [];

    querySnapshot.forEach((doc) => {
      const createdDate = getCreatedDateFromDocument(doc as any);
      products.push({
        id: doc.id,
        ...doc.data(),
        createdDate,
      });
    });

    return products;
  }
  const { data, isLoading } = useQuery({
    queryKey: ['get-foodbundles'],
    queryFn: () => fetchProducts(),
    onSuccess: (data) => {
      setAllProducts(data);
    },
    onError: (err) => {
      processError(err);
    },
  });
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSortChange = (newValue: string) => {
    setSortCriterion(newValue);
  };
  const sortedAndFilteredProducts = useSortAndSearch(allProducts, searchTerm, sortCriterion);

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-6  overflow-auto px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='justify-between md:flex '>
        <div>
          <h3 className='mb-4 text-base font-semibold md:text-2xl'>Food Bundles</h3>
          <p className='hidden text-[0.85rem] md:block '>
            All food bundles you have added will appear here
          </p>
        </div>
        <div>
          <p className='mb-6 hidden text-end text-[0.75rem]  text-gray-400 md:block'>
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
                <DropdownMenuRadioGroup value={sortCriterion} onValueChange={handleSortChange}>
                  <DropdownMenuRadioItem value='year'>Year</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='month'>Month</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='day'>Day</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <SearchComboBox value={searchTerm} onChange={handleSearch} />
          </div>
        </div>
      </div>
      <Link
        onClick={() => {
          setIsEditing(false);
          setEditData(null);
        }}
        to={`/app/${CONSTANTS.ROUTES['create-food-bundle']}`}
        className='group flex w-fit items-center justify-center gap-2 place-self-end   rounded-[5px] bg-primary-1 px-3 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:opacity-90'
      >
        <Icon name='addIcon' />
        <span className='text-xs font-[400] leading-[24px] tracking-[0.4px] text-white '>
          Add Food Bundle
        </span>
      </Link>
      <FeaturedLoader isLoading={isLoading}>
        <div className='grid w-full grid-cols-1 gap-x-[1.5rem] gap-y-[2.875rem] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {sortedAndFilteredProducts?.map((item: any, idx: number) => (
            <div key={idx} className='h-full w-full'>
              <ProductCard
                img={item?.image}
                name={item?.name}
                price={item?.price}
                link={`create-food-bundle`}
                rating={4.5}
                item={item}
                interval={item?.intervals}
              />
            </div>
          ))}
        </div>
      </FeaturedLoader>
    </div>
  );
};

export default FoodBundles;
