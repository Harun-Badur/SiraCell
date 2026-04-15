/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ─── Turkcell Resmi Renk Paleti (Case Analiz Dokümanı) ────────────
                turkcell: '#ffcc00',   // Birincil sarı
                darkblue: '#002855',   // Koyu lacivert (case dokümanı rengi)
                tc: {
                    yellow:       '#ffcc00',
                    'yellow-dark':'#e6b800',
                    navy:         '#002855',
                    'navy-light': '#003a7a',
                    blue:         '#0066cc',
                    'gray-bg':    '#f4f6fa',
                    'gray-card':  '#ffffff',
                    'gray-border':'#e2e8f0',
                    'gray-text':  '#64748b',
                    'dark-text':  '#1e293b',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', -'apple-system', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'tc':    '0 2px 12px rgba(0, 40, 85, 0.12)',
                'tc-lg': '0 8px 32px rgba(0, 40, 85, 0.18)',
                'tc-xl': '0 16px 48px rgba(0, 40, 85, 0.22)',
                'card':  '0 1px 6px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)',
            },
            animation: {
                'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
                'fade-up':    'fade-up 0.35s ease both',
                'bounce-in':  'bounce-in 0.4s ease both',
            },
            keyframes: {
                'pulse-ring': {
                    '0%, 100%': { transform: 'scale(1)',   opacity: '1' },
                    '50%':      { transform: 'scale(1.08)', opacity: '0.7' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(14px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                'bounce-in': {
                    '0%':   { transform: 'scale(0.85)', opacity: '0' },
                    '70%':  { transform: 'scale(1.04)', opacity: '1' },
                    '100%': { transform: 'scale(1)',    opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
