import VideoBackground from '../components/VideoBackground'

const HLS_SRC = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8'

export default function QuoteSlide() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoBackground src={HLS_SRC} />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-[5.2%]">
        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <p
            className="text-white text-center"
            style={{ fontSize: 'clamp(14px, 1.2vw, 20px)', opacity: 0.9 }}
          >
            Andrew Ng
          </p>
          <h2
            className="font-bold text-white text-center"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 64px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            &ldquo;Artificial Intelligence is the new electricity.&rdquo;
          </h2>
        </div>
      </div>
    </div>
  )
}
