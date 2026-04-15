import { useNavigate } from 'react-router-dom';
import { Building2, Building, Landmark, ChevronRight } from 'lucide-react';
import { TurkcellSpinner } from '../components/TurkcellSpinner';
import { useState } from 'react';

const CATEGORIES = [
    { id: 'telekom', title: 'Telekomünikasyon', desc: 'Turkcell Mağazaları', icon: Building2, color: 'text-[#ffcc00]', bg: 'bg-[#ffcc00]/10', border: 'border-[#ffcc00]' },
    { id: 'banka', title: 'Bankacılık', desc: 'Şubeler & ATM', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'kamu', title: 'Kamu Kurumları', desc: 'Belediye, Noter', icon: Building, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
];

export const InstitutionSelectionPage = () => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleSelect = (categoryId: string) => {
        setLoadingId(categoryId);
        setTimeout(() => {
            navigate(`/branches?category=${categoryId}`);
        }, 500);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
            {/* Dark Top Design */}
            <div className="absolute top-0 right-0 left-0 h-80 bg-[#002855] rounded-b-[4rem] z-0" />

            <div className="relative z-10 flex flex-col flex-1 max-w-lg mx-auto w-full p-6 pt-12">
                <div className="text-center mb-10 animate-fade-up">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Kurum Seçimi</h1>
                    <p className="text-blue-200 font-medium text-sm">İşlem yapmak istediğiniz kurum kategorisini seçin.</p>
                </div>

                <div className="flex flex-col gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            disabled={loadingId !== null}
                            className={`group flex items-center justify-between p-5 bg-white rounded-3xl shadow-tc border-2 ${loadingId === cat.id ? cat.border : 'border-transparent'} hover:${cat.border} transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-[#002855] font-black text-lg">{cat.title}</h2>
                                    <p className="text-slate-400 font-bold text-xs">{cat.desc}</p>
                                </div>
                            </div>
                            
                            <div className="pr-2">
                                {loadingId === cat.id ? (
                                    <TurkcellSpinner size={24} />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#002855] group-hover:text-white transition-colors">
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Additional Info Box */}
                <div className="mt-auto pt-8">
                    <div className="bg-white/50 backdrop-blur border border-slate-200 rounded-3xl p-5 text-center shadow-sm">
                        <p className="text-sm font-bold text-slate-500">
                            Farklı kurumlarda aynı profile tek dijital sıradan erişin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
