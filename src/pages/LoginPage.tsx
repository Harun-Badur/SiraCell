import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const DEMO_OTP = '1234';

export const LoginPage = () => {
    const [gsmRaw, setGsmRaw] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // GSM Formatting mask: 5XX XXX XX XX
    const formatGSM = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length > 3) formatted = `${cleaned.slice(0,3)} ${cleaned.slice(3)}`;
        if (cleaned.length > 6) formatted = `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
        if (cleaned.length > 8) formatted = `${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,8)} ${cleaned.slice(8,10)}`;
        return formatted;
    };

    const handleGsmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setGsmRaw(val);
    };

    const handleContinue = async () => {
        if (gsmRaw.length < 10) return;
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // Simulate API
        setLoading(false);
        setStep(2);
    };

    const handleLogin = async () => {
        if (otp.length < 4) return;
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        setLoading(false);
        if (otp === DEMO_OTP) {
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
        <div className="min-h-screen flex items-center justify-center bg-darkblue outline-none relative overflow-hidden px-4">
            {/* Background elements for premium feel */}
            <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-turkcell/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-turkcell/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm flex flex-col gap-6 animate-fade-up">

                {/* Top Branding / Logo Area */}
                <div className="flex flex-col items-center justify-center text-turkcell">
                    <svg viewBox="0 0 110 32" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto mb-4 drop-shadow-md">
                        <rect width="110" height="32" rx="6" fill="#ffcc00"/>
                        <text x="55" y="22" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="16" letterSpacing="-0.5" fill="#002855">turkcell</text>
                    </svg>
                    <h1 className="text-3xl font-black text-white tracking-tight">SıraCell</h1>
                    <p className="text-turkcell text-sm font-semibold tracking-widest uppercase mt-1 opacity-90">Dijital Sıra</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/100 backdrop-blur-xl w-full rounded-[28px] shadow-tc-xl overflow-hidden border border-white/20">
                    <div className="px-8 py-10 flex flex-col gap-6">
                        
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-black text-darkblue">
                                {step === 1 ? 'Giriş Yap' : 'Doğrulama'}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">
                                {step === 1 
                                    ? 'Devam etmek için numaranızı girin' 
                                    : <><span className="font-bold text-darkblue">0{formatGSM(gsmRaw)}</span><br/>numaralı telefona gelen kodu girin</>
                                }
                            </p>
                        </div>

                        {step === 1 ? (
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 font-bold text-slate-700">
                                    <Phone size={20} className="text-slate-400 group-focus-within:text-turkcell transition-colors" />
                                    <span>0</span>
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="5XX XXX XX XX"
                                    className="w-full pl-16 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-turkcell focus:bg-white transition-all text-darkblue font-black text-lg tracking-wide placeholder:font-medium placeholder:text-slate-300 placeholder:tracking-normal"
                                    value={formatGSM(gsmRaw)}
                                    onChange={handleGsmChange}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="relative group">
                                <KeyRound size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-turkcell transition-colors" />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="• • • •"
                                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-turkcell focus:bg-white transition-all text-darkblue font-black text-center text-3xl tracking-[0.5em] placeholder:text-slate-300 placeholder:text-2xl placeholder:tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    maxLength={4}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-bold border border-red-100">
                                <ShieldCheck size={16} className="text-red-500" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={step === 1 ? handleContinue : handleLogin}
                            disabled={loading || (step === 1 ? gsmRaw.length < 10 : otp.length < 4)}
                            className="w-full bg-turkcell text-darkblue font-black text-lg py-4 rounded-2xl hover:bg-[#e6b800] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-turkcell/20"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin text-darkblue" />
                            ) : (
                                <>
                                    {step === 1 ? 'Devam Et' : 'Giriş Yap'}
                                    <ArrowRight size={20} strokeWidth={3} />
                                </>
                            )}
                        </button>
                        
                        {step === 2 && (
                            <button
                                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                className="w-full text-sm text-slate-400 hover:text-darkblue transition-colors font-semibold"
                            >
                                Geri dön ve numarayı değiştir
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Security Badge */}
                <div className="flex justify-center items-center gap-2 text-white/50 text-xs font-semibold">
                    <ShieldCheck size={14} />
                    Turkcell Güvencesiyle Korunmaktadır
                </div>
            </div>
        </div>
    );
};