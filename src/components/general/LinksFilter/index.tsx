import Icon from 'utils/Icon';

interface ILinksFilter {
  tabs: { title: string; link: string; sublinks: { title: string; link: string }[] }[];
}

const LinksFilter = ({ tabs }: ILinksFilter) => {
  return (
    <div className='flex h-max w-full flex-col gap-1  rounded-[12px]  text-[14px] shadow-3 md:text-base'>
      {tabs?.map((i, idx) => (
        <div key={idx} className='flex flex-col gap-2 bg-white px-[1.5rem] py-[1.125rem] shadow-3'>
          <div className='flex items-center gap-2'>
            <Icon name='linkFilterIcon' />
            <span className='h over:text-primary-1 cursor-pointer leading-[24px] tracking-[0.15px] text-primary-9 transition-all duration-100 ease-in-out hover:underline'>
              {i?.title}
              {i?.sublinks?.length ? `:` : ``}
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-1'>
            {i?.sublinks?.map((j, idx) => (
              <span
                key={idx}
                className='ease-in-ou  cursor-pointer leading-[24px] tracking-[0.15px] text-primary-9 transition-all duration-100 hover:text-primary-1 hover:underline'
              >
                {j?.title}
                {idx !== i?.sublinks?.length - 1 ? `,` : ``}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinksFilter;
