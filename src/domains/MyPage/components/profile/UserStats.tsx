import { Link } from 'react-router-dom';

interface StatCardProps {
  to: string;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ to, title, value }) => (
  <Link
    to={to}
    className="flex flex-col justify-between items-center border border-gray-200 
               rounded-2xl w-full lg:w-[144px] md:px-5 py-4 md:py-7 transition-[background-color] 
               duration-300 cursor-pointer hover:bg-gray-100"
  >
    <p>{title}</p>
    <p className="text-xl md:text-2xl break-all">{value}</p>
  </Link>
);

interface UserStatsProps {
  usageHistoryLength: number;
  progressText: string;
}

const UserStats: React.FC<UserStatsProps> = ({
  usageHistoryLength,
  progressText,
}) => (
  <div className="flex justify-center items-center gap-5 w-full lg:w-fit">
    <StatCard
      to="/mypage/collection"
      title="도감"
      value={`${usageHistoryLength}/420`}
    />
    <StatCard to="/mypage/missions" title="미션" value={progressText} />
  </div>
);

export default UserStats;
