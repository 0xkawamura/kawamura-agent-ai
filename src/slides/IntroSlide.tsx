import VideoBackground from '../components/VideoBackground'
import Logo from '../components/Logo'

const HLS_SRC = 'https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8'

function MiniLineGraph() {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '140px' }}>
      <defs>
        <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D2FF55" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D2FF55" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 0 55 C 20 50, 30 40, 50 30 C 70 20, 90 10, 120 5"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 0 55 C 20 50, 30 40, 50 30 C 70 20, 90 10, 120 5 L 120 60 L 0 60 Z"
        fill="url(#graphGrad)"
      />
      <circle cx="0" cy="55" r="4" fill="#B750B2" stroke="white" strokeWidth="1.5" />
      <circle cx="120" cy="5" r="4" fill="#B750B2" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

export default function IntroSlide() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoBackground src={HLS_SRC} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[5.2%] pt-[4%] z-10">
        <Logo />
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Pitch Deck</span>
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Page 001</span>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[5.2%] pt-[12%] pb-[10%] z-10">
        {/* Title */}
        <h1
          className="font-bold text-white"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 64px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          The Rise of AI /<br />in Data Analytics
        </h1>

        {/* Three columns */}
        <div
          className="flex"
          style={{ marginTop: '3.5%', gap: '4%' }}
        >
          {/* Column 1 */}
          <div style={{ flex: '0 0 22%' }}>
            <p style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.85, lineHeight: 1.5 }}>
              The AI analytics market is projected to grow from $150B to $300B by 2027, driven by increasing demand for real-time business intelligence.
            </p>
            <div className="flex items-baseline gap-2" style={{ marginTop: '6%' }}>
              <span
                className="font-bold"
                style={{ fontSize: 'clamp(28px, 4.5vw, 64px)', lineHeight: 1 }}
              >
                $300
              </span>
              <span style={{ fontSize: 'clamp(13px, 1.1vw, 20px)', opacity: 0.8 }}>
                B<br />2027
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ flex: '0 0 38%' }}>
            <p style={{ fontSize: 'clamp(13px, 1.1vw, 20px)', opacity: 0.9, lineHeight: 1.5 }}>
              Businesses across industries are rapidly adopting AI-driven analysis to transform raw data into actionable insights. From predictive modeling and natural language processing to automated anomaly detection, AI enables companies to reduce decision-making time, uncover hidden patterns, and optimize operations at scale. Early adopters are already reporting significant competitive advantages, with faster time-to-insight and more accurate forecasting driving measurable growth.
            </p>
          </div>

          {/* Column 3 */}
          <div style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span
                className="font-bold"
                style={{ fontSize: 'clamp(28px, 4.5vw, 64px)', lineHeight: 1, display: 'block' }}
              >
                25–40%
              </span>
              <p style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8, lineHeight: 1.5, marginTop: '8%' }}>
                Average efficiency improvement reported by organizations leveraging AI analytics solutions.
              </p>
            </div>
            <div style={{ marginTop: '8%' }}>
              <MiniLineGraph />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end px-[5.2%] pb-[4%] z-10">
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.6 }}>The Rise of AI</span>
      </div>
    </div>
  )
}
