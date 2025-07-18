interface StartEndProps {
  isSmall?: boolean;
}

export default function StartEndBtn({ isSmall = false }: StartEndProps) {
  const pyClass = isSmall ? 'py-1' : 'py-2';
  const lineClass = isSmall ? 'h-4' : 'h-6';
  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden">
      <button
        className={`px-3 ${pyClass} text-sm font-semibold hover:bg-primaryGreen hover:text-white focus:outline-none`}
      >
        출발
      </button>
      <div className={`w-px ${lineClass} bg-gray-200`} />
      <button
        className={`px-3 ${pyClass} text-sm font-semibold text-primaryGreen hover:bg-primaryGreen hover:text-white focus:outline-none`}
      >
        도착
      </button>
    </div>
  );
}
