import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[#1a8754] hover:bg-[#157347] text-white shadow-sm focus:ring-[#1a8754] active:scale-[0.98]',
    secondary: 'bg-white hover:bg-gray-50 text-[#1c1d1f] border border-gray-300 focus:ring-gray-300 active:scale-[0.98]',
    outline: 'border border-[#1a8754] hover:bg-[#f0fdf4] text-[#1a8754] focus:ring-[#1a8754] active:scale-[0.98]',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    gradient: 'bg-[#1a8754] hover:bg-[#157347] text-white shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
