import VideoBackground from '../components/VideoBackground'
import Logo from '../components/Logo'

const HLS_SRC = 'https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8'

export default function CoverSlide() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoBackground src={HLS_SRC} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[5.2%] pt-[4%] relative z-10">
        <Logo />
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Pitch Deck</span>
      </div>

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ marginTop: '-3%' }}
      >
        <h1
          className="text-white text-center font-bold"
          style={{
            fontSize: 'clamp(32px, 6.5vw, 96px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          AI-Powered Data Analytics
        </h1>
        <p
          className="text-white text-center font-medium"
          style={{
            fontSize: 'clamp(20px, 3vw, 48px)',
            opacity: 0.9,
            marginTop: '1.5%',
          }}
        >
          Unlocking Business Potential
        </p>
        <p
          className="text-white text-center"
          style={{
            fontSize: 'clamp(14px, 1.6vw, 24px)',
            opacity: 0.75,
            marginTop: '2%',
          }}
        >
          By John Doe
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-[5.2%] pb-[4%] z-10">
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.6 }}>2024</span>
      </div>
    </div>
  )
}
