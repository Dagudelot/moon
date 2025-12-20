interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-20',
  };

  return (
    <img
      src="/logo.png"
      alt="Moon"
      className={`${sizeClasses[size]} ${className} w-auto object-contain`}
    />
  );
}

