export const TurkcellSpinner = ({ className = '', size = 24 }: { className?: string, size?: number }) => (
    <div 
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
    >
        {/* Anten Çember 1 */}
        <div className="absolute inset-0 rounded-full border-4 border-t-[#002855] border-r-transparent border-b-[#ffcc00] border-l-transparent animate-spin" style={{ animationDuration: '1.2s' }} />
        {/* Anten Çember 2 */}
        <div className="absolute inset-1 rounded-full border-4 border-t-transparent border-r-[#002855] border-b-transparent border-l-[#ffcc00] animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
        {/* Merkez Kafa */}
        <div className="absolute rounded-full bg-[#002855] w-2 h-2" style={{ width: size * 0.25, height: size * 0.25 }} />
    </div>
);
