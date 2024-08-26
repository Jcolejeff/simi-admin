import Icon from 'utils/Icon';

interface SearchComboBoxProps {
  className?: string;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}
const SearchComboBox = ({
  className,
  onChange,
  value,
  placeholder,
  name,
  id,
  disabled,
  required,
}: SearchComboBoxProps) => {
  return (
    <div className='w-full rounded-[12px] border bg-white px-[1rem]   shadow-sm'>
      <div className='flex h-full  items-center'>
        <Icon name='searchIcon' svgProp={{ className: 'text-primary-9 w-4' }} />
        <div className='flex-grow'>
          <input
            className='form-input w-full border-0 placeholder:text-xs placeholder:text-textColor-disabled focus:!ring-0'
            type='text'
            onChange={onChange}
            value={value}
            placeholder={placeholder || 'Search'}
            name={name}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComboBox;
