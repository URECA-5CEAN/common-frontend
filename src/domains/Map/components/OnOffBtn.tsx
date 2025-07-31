interface ToggleProps {
  showRecent: boolean;
  setShowRecent: (newState: boolean) => void;
}

export default function OnOffBtn({ showRecent, setShowRecent }: ToggleProps) {
  return (
    <div className="inline-flex items-center bg-backGround rounded-full p-1  ">
      {/* ON 버튼 */}
      <button
        onClick={() => setShowRecent(true)}
        className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
          showRecent
            ? 'bg-primaryGreen text-white'
            : 'text-gray-200 hover:bg-white'
        }`}
      >
        ON
      </button>

      {/* OFF 버튼 */}
      <button
        onClick={() => setShowRecent(false)}
        className={`px-3 py-1 text-xs rounded-full transition-colors ml-1 cursor-pointer ${
          !showRecent
            ? 'bg-primaryGreen text-white'
            : 'text-gray-200 hover:bg-white'
        }`}
      >
        OFF
      </button>
    </div>
  );
}
