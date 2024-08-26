/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import SearchComboBox from 'components/general/SearchComboBox';
import { useState } from 'react';

import { Button } from 'components/shadcn/ui/button';
import { processError } from 'helper/error';
import { useQuery } from '@tanstack/react-query';
import CONSTANTS from 'constant';
import { formatCurrentDateTime } from 'helper';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/shadcn/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';

import ProductCard from 'components/general/ProductCard';

import Icon from 'utils/Icon';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from 'firebase';
import useStore from 'store';
import FeaturedLoader from 'components/Loaders/FeaturedLoader';
import { getCreatedDateFromDocument } from 'lib/utils';
import useSortAndSearch from 'hooks/useSearchAndSort';
const ProductsPage = () => {
  const { setIsEditing, setEditData } = useStore((state) => state);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriterion, setSortCriterion] = useState('');

  async function fetchProducts() {
    const productsCollectionRef = collection(db, 'products');
    const productsQuery = query(productsCollectionRef, orderBy('created_date', 'desc'));

    const querySnapshot = await getDocs(productsQuery);

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
  const { isLoading } = useQuery({
    queryKey: ['get-products'],
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
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-6 overflow-auto  px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='justify-between md:flex '>
        <div>
          <h3 className='mb-4 text-base font-semibold md:text-2xl'>Products</h3>
          <p className='hidden text-[0.85rem] md:block '>
            All products you have added will appear here
          </p>
        </div>
        <div>
          <p className='mb-6 hidden text-end text-[0.75rem] text-gray-400 md:block'>
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
        to={`/app/${CONSTANTS.ROUTES['create-new-product']}`}
        className='group flex w-fit items-center justify-center gap-2 place-self-end   rounded-[5px] bg-primary-1 px-3 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:opacity-90'
      >
        <Icon name='addIcon' />
        <span className='text-xs font-[400] leading-[24px] tracking-[0.4px] text-white '>
          Add Product
        </span>
      </Link>
      <FeaturedLoader isLoading={isLoading}>
        <div className='grid w-full grid-cols-1 gap-x-[1.5rem] gap-y-[2.875rem] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {sortedAndFilteredProducts?.map((item: any, idx: number) => (
            <div key={idx} className='h-full w-full'>
              <ProductCard
                item={item}
                img={item?.image}
                name={item?.name}
                price={item?.price}
                link={`create-new-product`}
                rating={4.5}
              />
            </div>
          ))}
        </div>
      </FeaturedLoader>
    </div>
  );
};

export default ProductsPage;
