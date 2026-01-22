export default function HeroBackground() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    >
      {/* The Gravity Well - Orbital Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Ring 1 - The Core */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5"
          style={{
            animation: 'spin-slow 60s linear infinite'
          }}
        />
        
        {/* Ring 2 - The Orbit */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-dashed border-white/5"
          style={{
            animation: 'spin-reverse-slower 120s linear infinite reverse'
          }}
        />
        
        {/* The Rim Light */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] -translate-y-[225px]"
          style={{
            background: 'linear-gradient(to bottom, rgba(34, 211, 238, 0.2), transparent)',
            borderRadius: '100% 100% 0 0'
          }}
        />
      </div>
      
      {/* Floor Fog */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#030303] to-transparent z-10" />
    </div>
  )
}
