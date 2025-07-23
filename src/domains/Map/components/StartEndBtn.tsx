import type { StoreInfo } from '../api/store';

interface StartEndProps {
  isSmall?: boolean;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  store: StoreInfo;
}

export default function StartEndBtn({
  isSmall = false,
  onStartChange,
  onEndChange,
  store,
}: StartEndProps) {
  const pyClass = isSmall ? 'py-1' : 'py-2';
  const lineClass = isSmall ? 'h-4' : 'h-6';
  return (
    <div className="inline-flex  items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden">
      <button
        className={`px-3 ${pyClass} text-sm  hover:bg-primaryGreen hover:text-white focus:outline-none cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          onStartChange(store.name);
        }}
      >
        출발
      </button>
      <div className={`w-px ${lineClass} bg-gray-200`} />
      <button
        className={`px-3 ${pyClass} text-sm  text-primaryGreen hover:bg-primaryGreen hover:text-white focus:outline-none cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          onEndChange(store.name);
        }}
      >
        도착
      </button>
    </div>
  );
}
