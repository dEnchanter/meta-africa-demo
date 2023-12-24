import React, { ReactNode, ReactElement, ButtonHTMLAttributes } from 'react';

export function Loading({ h = "w-6" }) {
  return (
    <svg
      className={`animate-spin ${h} inline`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      ></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  round?: boolean;
  border?: string;
  padding?: string;
  font?: string;
  bg?: string;
  margin?: string;
  icon?: ReactElement;
  loading?: boolean;
  innerRef?: React.RefObject<HTMLButtonElement>;
  children?: ReactNode;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactElement;
  iconSize?: string;
  loading?: boolean;
  padding?: string;
  width?: string;
  margin?: string;
  bg?: string;
  font?: string;
  iconMargin?: string;
  loadingMargin?: string;
  disabled?: boolean;
  border?: string;
  look?: string;
  innerRef?: React.RefObject<HTMLButtonElement>;
}

export function IconButton({
  round,
  border = 'focus:ring-2',
  padding = 'p-1',
  icon,
  font,
  bg,
  margin,
  loading,
  innerRef,
  children,
  ...rest
}: IconButtonProps) {
  let Icon = icon as ReactElement | undefined; 
  let roundClass = round ? 'rounded-full' : '';

  return (
    <Button
      border={`${roundClass}`}
      padding={padding}
      margin={margin}
      bg={bg}
      font={font}
      {...rest}
      innerRef={innerRef}
    >
      {Icon && <span className="inline-block leading-3">{Icon}</span>}
      {children}
    </Button>
  );
}

export function Button({
  children,
  type = 'button',
  icon,
  iconSize = 'w-5',
  loading,
  padding = 'px-4 py-2',
  width = '',
  margin = '',
  bg = '',
  font = 'text-gray-50 text-sm',
  iconMargin = 'mr-2',
  loadingMargin = 'ml-2',
  disabled,
  border = 'border focus:ring-opacity-80 focus:ring-2 rounded',
  look = 'brandPurple',
  className,
  onClick,
  innerRef,
  ...rest
}: ButtonProps) {
  let Icon = icon as ReactElement | undefined; 
  let _bg = bg;
  let disabledClass = disabled ? ' cursor-not-allowed' : '';
  let _className =
    className ||
    `focus:outline-none ${font} ${_bg} ${border} ${padding} ${margin} ${width} ${disabledClass}`;

  function _onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (loading) {
      event.preventDefault();
    } else {
      onClick && onClick(event);
    }
  }

  return (
    <button
      ref={innerRef}
      type={type}
      className={_className + disabledClass}
      disabled={disabled}
      onClick={_onClick}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {icon && (
          <span className={`${iconMargin} inline-block leading-3}`}>
            {Icon && <span className="inline-block leading-3">{Icon}</span>}
          </span>
        )}
        {children}
        {loading && !disabled && (
          <span className={`${loadingMargin} inline-block leading-3}`}>
            {/* Assuming Loading is a component with height prop */}
            <Loading h={iconSize} />
          </span>
        )}
      </div>
    </button>
  );
}
