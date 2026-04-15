import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

// Simülasyon: sabit OTP kodu (Demo için)
const DEMO_OTP = '1234';

export const LoginPage = () => {
    const [gsm, setGsm] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleContinue = async () => {
        setError('');
        setLoading(true);
        // Gerçek API çağrısı: POST /auth/send-otp { gsm }
        await new Promise((r) => setTimeout(r, 600)); // simüle gecikme
        setLoading(false);
        setStep(2);
    };

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        // Gerçek API çağrısı: POST /auth/verify-otp { gsm, otp }
        await new Promise((r) => setTimeout(r, 600));
        setLoading(false);
        if (otp === DEMO_OTP) {
            // JWT token backend'den gelecek; şimdi simüle ediyoruz
            localStorage.setItem('token', 'demo-jwt-token');
            navigate('/');
        } else {
            setError(`Hatalı kod. Demo için: ${DEMO_OTP}`);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') step === 1 ? handleContinue() : handleLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#002855] p-4 relative overflow-hidden">
            {/* Arka plan dekorasyon */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffcc00] opacity-10 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ffcc00] opacity-10 rounded-full" />

            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                {/* Üst şerit */}
                <div className="bg-[#ffcc00] px-8 py-6">
                    <h1 className="text-2xl font-black text-[#002855] tracking-tight">SıraCell</h1>
                    <p className="text-[#002855] text-sm font-medium opacity-70">Dijital Sıra Yönetimi</p>
                </div>

                <div className="px-8 py-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-black text-[#002855]">
                            {step === 1 ? 'Giriş Yapın' : 'Kodu Girin'}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {step === 1
                                ? 'Cep telefonu numaranızı girin'
                                : `${gsm} numarasına gönderilen kodu girin`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                            />
                            <input
                                id="gsm-input"
                                type="tel"
                                placeholder="5XX XXX XX XX"
                                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#ffcc00] transition-colors text-[#002855] font-semibold placeholder:font-normal placeholder:text-gray-300"
                                value={gsm}
                                onChange={(e) => setGsm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                maxLength={11}
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <KeyRound
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                            />
                            <input
                                id="otp-input"
                                type="text"
                                inputMode="numeric"
                                placeholder="• • • •"
                                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#ffcc00] transition-colors text-[#002855] font-black text-center text-2xl tracking-[0.5em] placeholder:text-gray-200 placeholder:text-lg placeholder:tracking-normal placeholder:font-normal"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                maxLength={4}
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm font-semibold text-center -mt-2">{error}</p>
                    )}

                    <button
                        id="login-btn"
                        onClick={step === 1 ? handleContinue : handleLogin}
                        disabled={loading || (step === 1 ? gsm.length < 10 : otp.length < 4)}
                        className="w-full bg-[#002855] text-white font-black py-4 rounded-2xl hover:bg-[#003a7a] transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                {step === 1 ? 'Devam Et' : 'Giriş Yap'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {step === 2 && (
                        <button
                            onClick={() => { setStep(1); setOtp(''); setError(''); }}
                            className="w-full text-sm text-gray-400 hover:text-[#002855] transition-colors py-1"
                        >
                            ← Numarayı değiştir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};