interface BreadcrumbProps {
  title: string;
  subtitle: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, subtitle }) => (
  <div className="flex">
    <p className="text-gray-400">{title}</p>&nbsp;/&nbsp;<p>{subtitle}</p>
  </div>
);
