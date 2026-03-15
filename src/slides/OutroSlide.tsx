import { Phone, Mail, MapPin } from 'lucide-react'
import VideoBackground from '../components/VideoBackground'
import Logo from '../components/Logo'

const HLS_SRC = 'https://stream.mux.com/00qQnfNo7sSpn3pB1hYKkyeSDvxs01NxiQ3sr29uL3e028.m3u8'

function InstagramIcon({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" />
    </svg>
  )
}

function FacebookIcon({ size }: { size: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
      <path
        d="M13 21V13h2.5l.5-3H13V8.5C13 7.67 13.17 7 14.5 7H16V4.13C15.72 4.09 14.89 4 13.92 4 11.46 4 10 5.33 10 8.2V10H7.5v3H10v8"
        fill="white"
      />
    </svg>
  )
}

const iconSize = 'clamp(24px, 2vw, 32px)'

interface ContactItemProps {
  icon: React.ReactNode
  text: string
}

function ContactItem({ icon, text }: ContactItemProps) {
  return (
    <div className="flex items-center" style={{ gap: 'clamp(10px, 1vw, 16px)' }}>
      <div className="flex-shrink-0 text-white">{icon}</div>
      <span style={{ fontSize: 'clamp(13px, 1.1vw, 20px)', opacity: 0.9 }}>{text}</span>
    </div>
  )
}

export default function OutroSlide() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <VideoBackground src={HLS_SRC} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[5.2%] pt-[4%] z-10">
        <Logo />
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Pitch Deck</span>
        <span style={{ fontSize: 'clamp(12px, 1.05vw, 20px)', opacity: 0.8 }}>Page 020</span>
      </div>

      {/* Main content — vertically centered, left-aligned */}
      <div className="absolute inset-0 flex flex-col justify-center px-[5.2%] z-10">
        <h1
          className="font-bold text-white"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 64px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          Contact Information &amp; /<br />Final Call to Action
        </h1>

        <p
          className="text-white"
          style={{
            fontSize: 'clamp(13px, 1.1vw, 20px)',
            opacity: 0.9,
            maxWidth: '38%',
            marginTop: '3%',
            lineHeight: 1.5,
          }}
        >
          Ready to transform your business with AI-powered analytics? Get in touch with our team and discover how we can unlock the full potential of your data.
        </p>

        {/* Contact items */}
        <div
          className="flex flex-col"
          style={{ gap: 'clamp(12px, 1.2vw, 19px)', marginTop: '3%' }}
        >
          <ContactItem
            icon={<InstagramIcon size={iconSize} />}
            text="http://Instagram.com/grapho"
          />
          <ContactItem
            icon={<FacebookIcon size={iconSize} />}
            text="http://Facebook.com/grapho"
          />
          <ContactItem
            icon={<Phone style={{ width: iconSize, height: iconSize, strokeWidth: 1.5 }} />}
            text="+1 (415) 987-6543"
          />
          <ContactItem
            icon={<Mail style={{ width: iconSize, height: iconSize, strokeWidth: 1.5 }} />}
            text="contact@optimalai.com"
          />
          <ContactItem
            icon={<MapPin style={{ width: iconSize, height: iconSize, strokeWidth: 1.5 }} />}
            text="Headquarters: San Francisco, CA, USA"
          />
        </div>
      </div>
    </div>
  )
}
