import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import {
    UserCheck,
    CheckCircle,
    UserMinus,
    Power,
    BarChart3,
    Clock,
    Loader2,
} from 'lucide-react';

// ─── Tipler ─────────────────────────────────────────────────────────────────
interface ActiveTicket {
    ticket_number: string;
    service_type: string;
    user_gsm?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────
export const StaffPanelPage = () => {
    const queryClient = useQueryClient();
    const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null);
    const [isCounterOpen, setIsCounterOpen] = useState(true);

    // Sıradaki Müşteriyi Çağır — FIFO [Gereksinim 3.4 / cite: 56]
    const callNextMutation = useMutation<ActiveTicket>({
        mutationFn: async () => {
            const res = await api.post('/counter/call-next');
            return res.data as ActiveTicket;
        },
        onSuccess: (data) => {
            setActiveTicket(data);
            queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
        },
    });

    // İşlem Tamamla / Gelmedi [cite: 56]
    const updateStatusMutation = useMutation<void, Error, 'complete' | 'no-show'>({
        mutationFn: async (action) => {
            await api.patch(`/counter/${action}`);
        },
        onSuccess: () => {
            setActiveTicket(null);
            queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
        },
    });

    // Gişeyi aç/kapat [cite: 57]
    const toggleCounterMutation = useMutation<void, Error, boolean>({
        mutationFn: async (open) => {
            await api.patch('/counter/toggle', { is_active: open });
        },
        onSuccess: (_, open) => setIsCounterOpen(open),
    });

    const handleToggle = () => toggleCounterMutation.mutate(!isCounterOpen);

    return (
        <div className="p-5 space-y-5 max-w-2xl mx-auto bg-gray-50 min-h-screen">
            {/* Gişe Başlık Kartı */}
            <div className="flex justify-between items-center bg-[#002855] p-5 rounded-3xl text-white shadow-lg border-b-4 border-[#ffcc00]">
                <div>
                    <h2 className="font-black text-xl tracking-tight">GİŞE 04</h2>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mt-0.5">
                        Aktif Personel Paneli
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={toggleCounterMutation.isPending}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-60 ${
                        isCounterOpen
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                    {toggleCounterMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Power size={16} />
                    )}
                    {isCounterOpen ? 'AÇIK' : 'KAPALI'}
                </button>
            </div>

            {/* ── Boşta: Çağır + İstatistikler ── */}
            {!activeTicket ? (
                <div className="space-y-5">
                    {/* Sıradakini Çağır butonu */}
                    <button
                        onClick={() => callNextMutation.mutate()}
                        disabled={!isCounterOpen || callNextMutation.isPending}
                        className="w-full bg-[#ffcc00] text-[#002855] h-60 rounded-[40px] flex flex-col items-center justify-center gap-4 shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {callNextMutation.isPending ? (
                            <Loader2 size={56} className="animate-spin" />
                        ) : (
                            <UserCheck size={72} strokeWidth={2.5} />
                        )}
                        <span className="text-2xl font-black">
                            {callNextMutation.isPending ? 'ÇAĞIRILIYOR...' : 'SIRADAKİNİ ÇAĞIR'}
                        </span>
                    </button>

                    {callNextMutation.isError && (
                        <p className="text-center text-red-500 text-sm font-semibold">
                            Sırada kimse yok veya bir hata oluştu.
                        </p>
                    )}

                    {/* Günlük İstatistikler */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                            <BarChart3 size={22} className="text-[#002855]" />
                            <span className="text-2xl font-black text-[#002855]">24</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Toplam İşlem</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-1">
                            <Clock size={22} className="text-[#002855]" />
                            <span className="text-2xl font-black text-[#002855]">4.2 dk</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Ort. İşlem</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Aktif Müşteri Kartı ── */
                <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-[#ffcc00] space-y-8">
                    <div className="text-center space-y-2">
                        <span className="bg-blue-50 text-[#002855] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            Şu An İşlemde
                        </span>
                        <h3 className="text-7xl font-black text-[#002855] leading-none mt-2">
                            {activeTicket.ticket_number}
                        </h3>
                        <p className="text-gray-500 font-bold text-base">{activeTicket.service_type}</p>
                        {activeTicket.user_gsm && (
                            <p className="text-xs text-gray-400">{activeTicket.user_gsm}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => updateStatusMutation.mutate('complete')}
                            disabled={updateStatusMutation.isPending}
                            className="flex flex-col items-center gap-3 p-6 bg-green-50 rounded-3xl text-green-700 font-black border-2 border-green-100 hover:bg-green-100 transition-all active:scale-95 disabled:opacity-60"
                        >
                            {updateStatusMutation.isPending && updateStatusMutation.variables === 'complete' ? (
                                <Loader2 size={32} className="animate-spin" />
                            ) : (
                                <CheckCircle size={32} />
                            )}
                            TAMAMLA
                        </button>
                        <button
                            onClick={() => updateStatusMutation.mutate('no-show')}
                            disabled={updateStatusMutation.isPending}
                            className="flex flex-col items-center gap-3 p-6 bg-red-50 rounded-3xl text-red-700 font-black border-2 border-red-100 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-60"
                        >
                            {updateStatusMutation.isPending && updateStatusMutation.variables === 'no-show' ? (
                                <Loader2 size={32} className="animate-spin" />
                            ) : (
                                <UserMinus size={32} />
                            )}
                            GELMEDİ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};