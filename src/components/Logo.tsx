interface LogoProps {
  size?: number;
  /** "dark" = cream bg bear (default), "light" = same but for dark backgrounds */
  variant?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}

export function BearMark({ size = 28, variant = 'dark', className, style }: LogoProps) {
  const bg = variant === 'light' ? '#2a2d3e' : '#f7f0e2';
  const body = variant === 'light' ? '#f7f0e2' : '#1c1f2b';
  const inner = variant === 'light' ? '#2a2d3e' : '#f7f0e2';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="200" height="200" rx="40" fill={bg} />
      <g fill={body}>
        <circle cx="53" cy="52" r="26" />
        <circle cx="147" cy="52" r="26" />
        <circle cx="40" cy="40" r="12" />
        <circle cx="160" cy="40" r="12" />
        <circle cx="150" cy="120" r="17" />
        <circle cx="147" cy="103" r="16" />
        <circle cx="138" cy="88" r="16" />
        <circle cx="125" cy="76" r="15" />
        <circle cx="108" cy="71" r="14" />
        <circle cx="92" cy="71" r="14" />
        <circle cx="75" cy="76" r="15" />
        <circle cx="62" cy="88" r="16" />
        <circle cx="53" cy="103" r="16" />
        <circle cx="50" cy="120" r="17" />
        <circle cx="100" cy="120" r="52" />
      </g>
      <circle cx="55" cy="56" r="12" fill={inner} />
      <circle cx="145" cy="56" r="12" fill={inner} />
      <ellipse cx="100" cy="140" rx="32" ry="24" fill={inner} />
      <ellipse cx="90" cy="133" rx="4.5" ry="5.5" fill={body} />
      <ellipse cx="110" cy="133" rx="4.5" ry="5.5" fill={body} />
    </svg>
  );
}

export function AppLogo({
  size = 28,
  textSize = '0.88rem',
  variant = 'dark',
  gap = 8,
  style,
}: {
  size?: number;
  textSize?: string;
  variant?: 'dark' | 'light';
  gap?: number;
  style?: React.CSSProperties;
}) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#0A0A0A';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, ...style }}>
      <BearMark size={size} variant={variant} />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: textSize,
          color: textColor,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        Davai
      </span>
    </div>
  );
}
