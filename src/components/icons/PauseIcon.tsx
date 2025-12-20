interface PauseIconProps {
  className?: string;
}

export function PauseIcon({ className = 'w-6 h-6' }: PauseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

