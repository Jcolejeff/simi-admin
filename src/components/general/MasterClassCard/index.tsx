import { LazyLoadImage } from 'react-lazy-load-image-component';
import { shimmer, toBase64 } from 'utils/general/shimmer';
import { useNavigate } from 'react-router-dom';
import Icon from 'utils/Icon';
import img from 'assets/image/masterCardbg.png';
import CONSTANTS from 'constant';

interface IMasterClassCard {
  adImage: string;
  price: string;
  title: string;
  description: string;
  link?: string;
  location: string;
  expiryDate?: string;
}

const MasterClassCard = ({
  adImage,
  description,
  location,
  price,
  title,
  link = `/${CONSTANTS.ROUTES['create-category']}/a7f1477dc36041aabd2c40d5c8598e3f`,
}: IMasterClassCard) => {
  const navigate = useNavigate();
  console.log(link);

  return (
    <div
      onClick={() => navigate(link)}
      className='group flex h-max w-full cursor-pointer flex-col justify-between'
    >
      <div className='flex flex-col'>
        <div
          className='border-b- relative mb-[1rem] h-[16.93rem] w-full cursor-cardCursor overflow-hidden rounded-[8px] 
          border-b-warning-1
        transition-all duration-300 ease-in-out after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-transparent after:transition-all after:duration-300 hover:after:bg-black/40
        '
        >
          <LazyLoadImage
            placeholderSrc={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            src={adImage}
            alt=' '
            className='h-full w-full bg-cover bg-top object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
          />
          <img
            src={img}
            className='absolute bottom-0 left-0 right-0  w-full rounded-lg bg-cover bg-top transition-transform duration-300 ease-in-out group-hover:scale-105'
          />
        </div>

        <div className='mb-4 flex w-full items-center justify-between'>
          <span className='text-[14px] font-[600] leading-[21px] tracking-[0.1px] text-primary-1 '>
            Coming Up: {price}
          </span>
          <span className='text-[14px] font-[300] leading-[21px] tracking-[0.1px] text-secondary-2 '></span>
        </div>
        <h5 className='mb-4 text-lg font-[700] leading-[27px] text-primary-12'>{title}</h5>
        <p className='mb-4 text-[13px] font-[300] leading-[18px] tracking-[0.1px] text-secondary-2'>
          {description}
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <Icon name='location' svgProp={{ width: '1.5rem', height: '1.5rem' }} />
        <span className='text-sm font-[600] text-primary-9'>{location}</span>
      </div>
    </div>
  );
};

export default MasterClassCard;
