import { cn } from "../../lib/utils"

export interface RetroGridProps {
  className?: string
  children?: React.ReactNode
  angle?: number
  cellSize?: number
  opacity?: number
  lineColor?: string
}

export function RetroGrid({
  className,
  children,
  angle = 45,
  cellSize = 100,
  opacity = 0.5,
  lineColor = "var(--color-text-tertiary)",
}: RetroGridProps) {
  return (
    <div className={cn("fixed inset-0 overflow-hidden -z-10", className)} style={{ backgroundColor: `var(--color-bg)` }}>
      <style>{`
        @keyframes retro-grid-scroll {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 [perspective:200px] -z-10" style={{ opacity }}>
        <div className="absolute inset-0" style={{ transform: `rotateX(${angle}deg)` }}>
          <div
            style={{
              backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 0), linear-gradient(to bottom, ${lineColor} 1px, transparent 0)`,
              backgroundSize: `${cellSize}px ${cellSize}px`,
              backgroundRepeat: "repeat",
              height: "300vh",
              width: "600vw",
              marginLeft: "-200%",
              transformOrigin: "100% 0 0",
              animation: "retro-grid-scroll 15s linear infinite",
            }}
          />
        </div>

      </div>

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default function RetroGridDemo() {
  return <RetroGrid />
}
