import Image from "next/image";

export function LogoMark({ size = 32 }: { size?: number }) {
  return <Image src="/favicon.svg?v=clarity" width={size} height={size} alt="" unoptimized />;
}

interface LogoLockupProps {
  markSize?: number;
  fontSize?: string;
  gap?: string;
}

export function LogoLockup({
  markSize = 28,
  fontSize = "0.92rem",
  gap = "0.65rem",
}: LogoLockupProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap }}>
      <LogoMark size={markSize} />
      <span
        style={{
          color: "#392d40",
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: `calc(${fontSize} * 1.55)`,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.055em",
        }}
      >
        lawlens<span aria-hidden="true">✳</span>
      </span>
    </span>
  );
}
