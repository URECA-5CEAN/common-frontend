import type { StoreInfo } from '../api/store';
import type { LocationInfo } from '../pages/MapPage';

interface StartEndProps {
  isSmall?: boolean;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
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
        className={`px-3 ${pyClass} text-sm  hover:bg-primaryGreen-40 focus:outline-none cursor-pointer transition-all duration-100`}
        onClick={(e) => {
          e.stopPropagation();
          onStartChange({
            name: store.name,
            lat: store.latitude,
            lng: store.longitude,
          });
        }}
      >
        출발
      </button>
      <div className={`w-px ${lineClass} bg-gray-200`} />
      <button
        className={`px-3 ${pyClass} text-sm  text-primaryGreen hover:bg-primaryGreen-40 hover:text-gray-700 focus:outline-none cursor-pointer transition-all duration-100`}
        onClick={(e) => {
          e.stopPropagation();
          onEndChange({
            name: store.name,
            lat: store.latitude,
            lng: store.longitude,
          });
        }}
      >
        도착
      </button>
    </div>
  );
}
