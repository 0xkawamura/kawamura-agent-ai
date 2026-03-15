import { Monitor, Brain, Briefcase, Lightbulb, Shield } from 'lucide-react'
import VideoBackground from '../components/VideoBackground'
import Logo from '../components/Logo'
import type { ReactNode } from 'react'

const HLS_SRC = 'https://stream.mux.com/fHfa8VIbBdqZelLGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8'

const liquidGlass: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
  backdropFilter: 'blur(24px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
}

const specularHighlight: React.CSSProperties = {
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '60%',
  height: '60%',
  background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
}

interface CardProps {
  icon: ReactNode
  title: string
  description: string
}

function Card({ icon, title, description }: CardProps) {
  return (
    <div
      style={{
        ...liquidGlass,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(20px, 2.5vw, 48px)',
        minHeight: 'clamp(140px, 16vh, 240px)',
      }}
    >
      {/* Specular highlight */}
      <div style={specularHighlight} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '8%', color: 'white' }}>
          {icon}
        </div>
        <h3
          className="font-semibold text-white"
          style={{ fontSize: 'clamp(18px, 2vw, 36px)', lineHeight: 1.1, marginBottom: '6%' }}
        >
          {title}
        </h3>
        <p
          className="text-white/80"
          style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', lineHeight: 1.5 }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

const iconSize = 'clamp(32px, 3vw, 48px)'
const iconStyle = { width: iconSize, height: iconSize, strokeWidth: 1.5 }

export default function AnalyticsSlide() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoBackground src={HLS_SRC} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[5.2%] pt-[4%] z-10">
        <Logo />
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Pitch Deck</span>
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Page 002</span>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col px-[5.2%] pt-[12%] pb-[10%] z-10">
        {/* Title section */}
        <div className="text-center" style={{ marginBottom: '3%' }}>
          <p
            className="text-white"
            style={{ fontSize: 'clamp(14px, 1.4vw, 24px)', opacity: 0.9 }}
          >
            Transforming Data into Intelligence with
          </p>
          <h2
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 64px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginTop: '0.5%',
            }}
          >
            AI-Powered Analytics
          </h2>
        </div>

        {/* Card grid */}
        <div className="flex flex-col flex-1" style={{ gap: 'clamp(10px, 1.2vw, 20px)' }}>
          {/* Top row: 3 cards */}
          <div className="flex flex-1" style={{ gap: 'clamp(10px, 1.5vw, 27px)' }}>
            <Card
              icon={<Monitor style={iconStyle} />}
              title="Advanced Capabilities"
              description="Real-time processing, predictive analytics, and machine learning."
            />
            <Card
              icon={<Brain style={iconStyle} />}
              title="Smarter Decision-Making"
              description="Helping businesses unlock insights and optimize efficiency."
            />
            <Card
              icon={<Briefcase style={iconStyle} />}
              title="Industry Leader"
              description="Driving AI-driven data analytics innovation."
            />
          </div>
          {/* Bottom row: 2 cards */}
          <div className="flex flex-1" style={{ gap: 'clamp(10px, 1.4vw, 25px)' }}>
            <Card
              icon={<Lightbulb style={iconStyle} />}
              title="Future-Ready Solutions"
              description="Empowering organizations to stay competitive in a data-driven world."
            />
            <Card
              icon={<Shield style={iconStyle} />}
              title="Scalable & Secure"
              description="Ensuring seamless AI integration with robust data protection."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
