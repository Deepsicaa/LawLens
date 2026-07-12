// Scales-in-circle mark — the LawLens logomark.
// Import LogoMark for icon-only use, LogoLockup for full horizontal identity.

interface LogoMarkProps {
  size?: number;
  color?: string;
}

export function LogoMark({ size = 32, color = "#c4a46a" }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21.5" stroke={color} strokeWidth="1.1" />
      <circle cx="24" cy="24" r="17.5" stroke={color} strokeWidth="0.5" strokeOpacity="0.22" />
      <line x1="24" y1="14.5" x2="24" y2="35.5" stroke={color} strokeWidth="0.85" strokeLinecap="round" />
      <line x1="10.5" y1="19" x2="37.5" y2="19" stroke={color} strokeWidth="0.85" strokeLinecap="round" />
      <circle cx="24" cy="19" r="1.6" fill={color} />
      <line x1="10.5" y1="19" x2="10.5" y2="28.5" stroke={color} strokeWidth="0.7" strokeLinecap="round" />
      <line x1="37.5" y1="19" x2="37.5" y2="28.5" stroke={color} strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 5.5,28.5 Q 10.5,33.5 15.5,28.5" stroke={color} strokeWidth="0.85" strokeLinecap="round" fill="none" />
      <path d="M 32.5,28.5 Q 37.5,33.5 42.5,28.5" stroke={color} strokeWidth="0.85" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface LogoLockupProps {
  markSize?: number;
  fontSize?: string;
  gap?: string;
  lawColor?: string;
  lensColor?: string;
  markColor?: string;
}

export function LogoLockup({
  markSize = 28,
  fontSize = "0.92rem",
  gap = "0.65rem",
  lawColor = "#ede9e2",
  lensColor = "#c4a46a",
  markColor = "#c4a46a",
}: LogoLockupProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <LogoMark size={markSize} color={markColor} />
      <span aria-label="LawLens" style={{ lineHeight: 1 }}>
        <span style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 400,
          fontSize,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: lawColor,
        }}>Law</span>
        <span style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
          fontWeight: 300,
          fontSize,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: lensColor,
        }}>Lens</span>
      </span>
    </div>
  );
}
