import { useId } from 'react'

const BrandMark = ({ compact = false }) => {
  const gradientId = `brand-gradient-${useId().replaceAll(':', '')}`

  return (
    <span className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`}>
      <svg
        className="brand-mark"
        viewBox="0 0 40 40"
        role="img"
        aria-label="Imagify"
      >
        <defs>
          <linearGradient id={gradientId} x1="5" y1="4" x2="35" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7DEFF" />
            <stop offset=".52" stopColor="#B79AF7" />
            <stop offset="1" stopColor="#7958C9" />
          </linearGradient>
        </defs>
        <path d="M20 2.8 36 12v16L20 37.2 4 28V12L20 2.8Z" fill={`url(#${gradientId})`} fillOpacity=".16" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <path d="m20 9 10 5.8v10.4L20 31l-10-5.8V14.8L20 9Z" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <path d="m20 13 6 3.5v7L20 27l-6-3.5v-7l6-3.5Z" fill={`url(#${gradientId})`} />
        <path d="M20 6v3m14 11h-4M10 20H6m14 14v-3" stroke="#E7DEFF" strokeOpacity=".8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {!compact && <span className="brand-wordmark">imagify<span>.</span></span>}
    </span>
  )
}

export default BrandMark
