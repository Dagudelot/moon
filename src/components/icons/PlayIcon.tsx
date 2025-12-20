interface PlayIconProps {
  className?: string;
}

export function PlayIcon({ className = 'w-6 h-6' }: PlayIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

