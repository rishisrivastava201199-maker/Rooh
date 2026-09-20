/* A generated visual. The SVG string comes from src/lib/figures.ts
   and is built entirely from values we control — no user input ever
   reaches it, which is why dangerouslySetInnerHTML is safe here.
   Replace the whole component with <Image> once the photography
   exists; nothing else has to change. */
import type { CSSProperties } from "react";

export function Figure({
  svg,
  className,
  style,
}: {
  svg: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
