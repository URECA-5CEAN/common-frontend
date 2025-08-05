import React from 'react';
import clsx from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';

interface IconAction {
  icon: React.ReactNode;
  onClick?: () => void;
  label: string;
}

interface IconActionGroupProps {
  actions: IconAction[];
}

export default function IconActionGroup({ actions }: IconActionGroupProps) {
  const { isLoggedIn } = useAuthStore();
  return (
    <div className="flex space-x-2">
      {actions.map(({ icon, onClick, label }) => {
        if (!isLoggedIn && label === '즐겨찾기') {
          return null;
        }

        return (
          <button
            key={label}
            onClick={onClick}
            aria-label={label}
            className={clsx(
              'flex items-center justify-center p-1.5',
              'border border-gray-200 rounded-full hover:bg-gray-200',
              'focus:outline-none cursor-pointer transition-all duration-100',
            )}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
