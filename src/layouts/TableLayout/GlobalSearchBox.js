import { useState } from 'react';
import { useAsyncDebounce } from 'react-table';

const GlobalSearchBox = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 300);

  return (
    <form
      className='flex items-center justify-between'
      onSubmit={(e) => e.preventDefault()}
    >
      {/* search box */}
      <div
        className={`flex items-center bg-dark-400 rounded-md border ${
          value !== '' ? 'border-success-color-400' : 'border-dark-50'
        } text-gray-600 px-3 py-3 mr-0 w-96`}
      >
        <input
          autoFocus
          className='bg-dark-400 w-full bg-none rounded-tr-full rounded-br-full text-md outline-none pr-2 text-white'
          type='text'
          placeholder='Search asset pair'
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
        <svg
          width='24'
          height='24'
          className={`icon mr-1 text ${
            value !== '' && 'text-success-color-400'
          }`}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 22 22'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
      </div>
    </form>
  );
};

export default GlobalSearchBox;
