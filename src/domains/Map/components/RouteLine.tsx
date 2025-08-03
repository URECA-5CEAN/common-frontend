export default function RouteLine({
  from,
  waypoints = [],
  to,
}: {
  from: string;
  waypoints?: string[];
  to: string;
}) {
  const points = [from, ...waypoints, to];
  return (
    <ul className="flex flex-col  space-y-0 relative min-h-[24px] ml-1">
      {points.map((label, idx) => (
        <li key={idx} className="flex items-center">
          <div className="flex flex-col items-center mr-2">
            <span
              className={
                'w-2.5 h-2.5 rounded-full block ' +
                (idx === 0
                  ? 'bg-green-500'
                  : idx === points.length - 1
                    ? 'bg-red-500'
                    : 'bg-blue-500')
              }
            />

            {idx < points.length - 1 && (
              <span className="w-0.5 h-2  relative top-[1px] border-dotted border-l-2 border-gray-300 "></span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-800 pt-0.5 truncate max-w-[150px]">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
