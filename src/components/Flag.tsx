interface FlagProps {
  country: 'fr' | 'mg';
  size?: number;
  className?: string;
}

export default function Flag({ country, size = 18, className = '' }: FlagProps) {
  if (country === 'fr') {
    return (
      <svg
        width={size}
        height={Math.round(size * 0.67)}
        viewBox="0 0 30 20"
        className={className}
        aria-label="Français"
        role="img"
      >
        <clipPath id="fr-clip"><rect width="30" height="20" rx="2" ry="2" /></clipPath>
        <g clipPath="url(#fr-clip)">
          <rect width="10" height="20" fill="#0055A4" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#EF4135" />
        </g>
        <rect width="30" height="20" rx="2" ry="2" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={Math.round(size * 0.67)}
      viewBox="0 0 30 20"
      className={className}
      aria-label="Malagasy"
      role="img"
    >
      <clipPath id="mg-clip"><rect width="30" height="20" rx="2" ry="2" /></clipPath>
      <g clipPath="url(#mg-clip)">
        <rect width="15" height="10" fill="#FFFFFF" />
        <rect x="15" width="15" height="10" fill="#FC3D32" />
        <rect y="10" width="15" height="10" fill="#007E3A" />
        <rect x="15" y="10" width="15" height="10" fill="#FC3D32" />
      </g>
      <rect width="30" height="20" rx="2" ry="2" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
    </svg>
  );
}
