import CONSTANTS from 'constant';
import { Star, StarHalf } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { shimmer, toBase64 } from 'utils/general/shimmer';

interface ICategoryCard {
  img: string;
  mainCategory?: string | number;
  name: string;
  link?: string;
  item?: any;
}

const CategoryCard = ({ img, mainCategory, name, item, link }: ICategoryCard) => {
  const navigate = useNavigate();

  return (
    <div
      // onClick={() => {

      //   navigate(`/app/${CONSTANTS.ROUTES['create-category']}?editId=${link}`);
      // }}
      className='group flex h-max w-full cursor-pointer flex-col justify-between rounded-2xl bg-slate-50 px-4 py-4 shadow-md  transition-all duration-300 ease-in-out'
    >
      <div className='flex flex-col gap-2'>
        <div
          className='relative  h-[8rem] w-full  cursor-cardCursor  overflow-hidden rounded-2xl
        transition-all duration-300 ease-in-out after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-transparent after:transition-all after:duration-300 hover:after:bg-black/40
        '
        >
          <LazyLoadImage
            placeholderSrc={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            src={img}
            alt=' '
            className='h-full  w-full bg-cover bg-top object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
          />
        </div>
        <div className='flex  w-full flex-col gap-1  '>
          <h5 className=' w-full text-center text-[0.9rem] font-medium capitalize leading-[22px] text-primary-8'>
            {name}
          </h5>

          {mainCategory && (
            <p className='text-center text-[0.7rem] font-[400] leading-[21px] tracking-[0.1px]  text-primary-8 '>
              ({mainCategory})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
