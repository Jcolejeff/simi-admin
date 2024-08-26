import CONSTANTS from 'constant';
import { Star, StarHalf } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { shimmer, toBase64 } from 'utils/general/shimmer';
import useStore from 'store';
import { StoreType } from 'store';
interface IProductCard {
  item: any;
  img: string;

  name: string;
  link: string;
}

const BlogCard = ({ img, name, link, item }: IProductCard) => {
  const { setEditData, setIsEditing } = useStore((state: StoreType) => state);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        setEditData(item);
        setIsEditing(true);
        navigate(
          `/app/${
            CONSTANTS.ROUTES[link as keyof typeof CONSTANTS.ROUTES]
          }?editId=${name}&edit=${true}`,
        );
      }}
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
          <h5 className='  text-[0.9rem] font-medium capitalize leading-[27px] text-primary-8'>
            {name}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
