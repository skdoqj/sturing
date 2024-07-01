import FilterButton from './FilterButton';
import { TbChartCandle } from 'react-icons/tb';
import { useState } from 'react';
import BottomSheetFilter from './BottomSheetFilter';

const filterButtonList = [
  { title: '분야', isBlue: true },
  { title: '지역', isBlue: false },
  { title: '인원', isBlue: false },
  { title: '기간', isBlue: false },
  { title: '수준', isBlue: false },
];

export default function FilterBar() {
  const [openFilter, setOpenFilter] = useState(false);

  const onClickFilter = () => {
    setOpenFilter(!openFilter);
    if (!openFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      <div className=" w-full px-[1.2rem] py-[.8rem] flex justify-between items-center">
        <ul className="flex w-[90%] overflow-x-auto py-[.8rem]">
          {filterButtonList &&
            filterButtonList.map((filterbutton) => (
              <li key={filterbutton.title} className="inline mr-[.8rem]">
                <FilterButton
                  content={filterbutton.title}
                  isBlue={filterbutton.isBlue}
                />
              </li>
            ))}
        </ul>
        <button>
          <TbChartCandle
            className="w-[2.4rem] h-[2.4rem] rotate-90"
            onClick={onClickFilter}
          />
        </button>
      </div>
      {openFilter && (
        <div className="absolute bottom-0 z-10 w-full">
          <BottomSheetFilter />
        </div>
      )}
    </>
  );
}
