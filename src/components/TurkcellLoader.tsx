export const TurkcellLoader = ({ className = '', size = 48 }: { className?: string, size?: number }) => (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            className="animate-spin" 
            style={{ animationDuration: '1.5s' }}
        >
            <defs>
                <linearGradient id="antenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#002855" />
                    <stop offset="100%" stopColor="#ffcc00" />
                </linearGradient>
            </defs>
            {/* Center Dot */}
            <circle cx="50" cy="50" r="10" fill="#002855" />
            {/* Outer Arc 1 */}
            <path 
                d="M 50 15 A 35 35 0 0 1 85 50" 
                fill="none" 
                stroke="url(#antenGrad)" 
                strokeWidth="10" 
                strokeLinecap="round" 
            />
            {/* Outer Arc 2 */}
            <path 
                d="M 50 85 A 35 35 0 0 1 15 50" 
                fill="none" 
                stroke="#002855" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeOpacity="0.8"
            />
            {/* Outer Arc 3 (Yellow Accent) */}
            <path 
                d="M 15 50 A 35 35 0 0 1 50 15" 
                fill="none" 
                stroke="#ffcc00" 
                strokeWidth="10" 
                strokeLinecap="round" 
            />
        </svg>
    </div>
);
