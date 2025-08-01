import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  width?: string | number;
  height?: string | number;
  loading?: boolean;
  shadowColor?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primaryGreen text-white hover:bg-[#75b5c0] disabled:bg-[#ade1eb] disabled:text-gray-100',
  secondary:
    'bg-gray-200 text-gray-500 hover:bg-[#dfdfdf] disabled:bg-[#ebebeb] disabled:text-gray-300',
  ghost:
    'bg-white text-gray-600 hover:bg-gray-100 disabled:bg-[#ebebeb] border border-gray-200 disabled:text-gray-300',
};

const shadowClassMap: Record<
  ButtonVariant,
  { default: string; disabled: string }
> = {
  primary: {
    default: 'bg-primaryGreen-80',
    disabled: 'bg-[#72c2ce]',
  },
  secondary: {
    default: 'bg-gray-300',
    disabled: 'bg-[#d4d4d4]',
  },
  ghost: {
    default: 'bg-gray-300',
    disabled: 'bg-[#d4d4d4]',
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  width,
  height,
  className = '',
  disabled,
  loading,
  shadowColor,
  ...rest
}) => {
  const inlineStyle = {
    width: fullWidth ? '100%' : width,
    height,
  };

  const wrapperClass = ['relative inline-block', fullWidth && 'w-full']
    .filter(Boolean)
    .join(' ');

  const shadowClass = [
    'absolute top-[3px] left-0 w-full h-full rounded-xl z-1',
    shadowColor ||
      (disabled
        ? shadowClassMap[variant].disabled
        : shadowClassMap[variant].default),
    !disabled && 'cursor-pointer',
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClass = [
    'relative z-10 rounded-xl h-full transition-all cursor-pointer flex justify-center items-center',
    sizeClasses[size],
    variantClasses[variant],
    className,
    loading ? 'top-[3px]' : 'top-0 active:top-[3px]',
    disabled && !loading && 'disabled:cursor-not-allowed disabled:active:top-0',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass} style={inlineStyle}>
      <div className={shadowClass} />
      <button
        className={buttonClass}
        style={inlineStyle}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    </div>
  );
};
