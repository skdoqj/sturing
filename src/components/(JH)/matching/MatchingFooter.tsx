import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import CircleButton from './CircleButton';
export default function MatchingFooter({
  step,
  Forward,
  Backward,
  active,
}: {
  step: number;
  Forward: () => void;
  Backward: () => void;
  active?: boolean;
}) {
  return (
    <footer className="flex justify-between w-full  px-[1.6rem] absolute bottom-[-10rem]  ">
      {step === 1 ? (
        <div></div>
      ) : (
        <CircleButton>
          <GoChevronLeft size={35} color={'white'} onClick={Backward} />
        </CircleButton>
      )}

      <CircleButton>
        <GoChevronRight size={35} color={'white'} onClick={Forward} />
      </CircleButton>
    </footer>
  );
}
