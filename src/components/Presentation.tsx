import { useState, useEffect, useCallback, useRef } from 'react'
import type { ReactElement } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

interface PresentationProps {
  slides: ReactElement[]
}

export default function Presentation({ slides }: PresentationProps) {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = slides.length

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, toggleFullscreen])

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  }, [resetHideTimer])

  const getSlideStyle = (index: number) => {
    if (index === current) return { opacity: 1, transform: 'scale(1)', zIndex: 10 }
    if (index < current) return { opacity: 0, transform: 'scale(0.95)', zIndex: 5 }
    return { opacity: 0, transform: 'scale(1.05)', zIndex: 5 }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      onMouseMove={resetHideTimer}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            ...getSlideStyle(i),
            transition: 'opacity 500ms ease-in-out, transform 500ms ease-in-out',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          {slide}
        </div>
      ))}

      {/* Keyboard hint */}
      <div
        className="absolute top-[4%] right-[5.2%] text-white/40 pointer-events-none select-none"
        style={{
          fontSize: '11px',
          transition: 'opacity 300ms',
          opacity: controlsVisible ? 1 : 0,
          zIndex: 50,
        }}
      >
        ← → Navigate · F Fullscreen
      </div>

      {/* Bottom nav bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[5.2%] py-[1.8%]"
        style={{
          transition: 'opacity 300ms',
          opacity: controlsVisible ? 1 : 0,
          zIndex: 50,
        }}
      >
        {/* Slide counter */}
        <span
          className="text-white/50 tabular-nums select-none"
          style={{ fontSize: '13px' }}
        >
          {current + 1} / {total}
        </span>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                transition: 'all 300ms ease-in-out',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Controls: prev/next + divider + fullscreen */}
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center justify-center w-8 h-8 rounded text-white/50 hover:text-white/90 hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            className="flex items-center justify-center w-8 h-8 rounded text-white/50 hover:text-white/90 hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center w-8 h-8 rounded text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
