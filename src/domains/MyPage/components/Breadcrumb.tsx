interface BreadcrumbProps {
  title: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => (
  <div className="flex">
    <p className="text-gray-400">마이페이지</p>&nbsp;/&nbsp;<p>{title}</p>
  </div>
);
