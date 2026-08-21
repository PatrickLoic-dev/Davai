interface BearMarkProps {
  size?: number;
  /** color of bear body */
  bodyColor?: string;
  /** color used for ear-inner / snout cutouts — match your background */
  cutoutColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BearMark({
  size = 28,
  bodyColor = '#1c1f2b',
  cutoutColor = 'white',
  className,
  style,
}: BearMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'block', ...style }}
      aria-hidden="true"
    >
      <g fill={bodyColor}>
        <circle cx="53"  cy="52"  r="26" />
        <circle cx="147" cy="52"  r="26" />
        <circle cx="40"  cy="40"  r="12" />
        <circle cx="160" cy="40"  r="12" />
        <circle cx="150" cy="120" r="17" />
        <circle cx="147" cy="103" r="16" />
        <circle cx="138" cy="88"  r="16" />
        <circle cx="125" cy="76"  r="15" />
        <circle cx="108" cy="71"  r="14" />
        <circle cx="92"  cy="71"  r="14" />
        <circle cx="75"  cy="76"  r="15" />
        <circle cx="62"  cy="88"  r="16" />
        <circle cx="53"  cy="103" r="16" />
        <circle cx="50"  cy="120" r="17" />
        <circle cx="100" cy="120" r="52" />
      </g>
      {/* ear inners & snout — filled with parent background color */}
      <circle cx="55"  cy="56"  r="12" fill={cutoutColor} />
      <circle cx="145" cy="56"  r="12" fill={cutoutColor} />
      <ellipse cx="100" cy="140" rx="32" ry="24" fill={cutoutColor} />
      {/* nostrils */}
      <ellipse cx="90"  cy="133" rx="4.5" ry="5.5" fill={bodyColor} />
      <ellipse cx="110" cy="133" rx="4.5" ry="5.5" fill={bodyColor} />
    </svg>
  );
}

export function AppLogo({
  size = 28,
  textSize = '0.88rem',
  dark = false,
  gap = 8,
  style,
}: {
  size?: number;
  textSize?: string;
  /** dark=true for placing on dark backgrounds */
  dark?: boolean;
  gap?: number;
  style?: React.CSSProperties;
}) {
  const textColor = dark ? '#FFFFFF' : '#0A0A0A';
  const bodyColor = dark ? '#FFFFFF' : '#1c1f2b';
  const cutoutColor = dark ? '#1c1f2b' : 'white';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, ...style }}>
      <BearMark size={size} bodyColor={bodyColor} cutoutColor={cutoutColor} />
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
