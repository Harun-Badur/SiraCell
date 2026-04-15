import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { type QueueTicket } from '../types';
import {
    Loader2,
    ArrowLeft,
    Clock,
    Users,
    Bell,
    CheckCircle2,
    XCircle,
    Wrench,
} from 'lucide-react';
import type { ElementType } from 'react';

// ─── Status UI konfigürasyonu ──────────────────────────────────────────────
type StatusConfig = {
    label: string;
    color: string;
    bg: string;
    border: string;
    Icon: ElementType;
    pulse: boolean;
};

const STATUS_CONFIG: Record<QueueTicket['status'], StatusConfig> = {
    WAITING: {
        label: 'Bekliyorsunuz',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        Icon: Clock,
        pulse: true,
    },
    CALLED: {
        label: 'Sıranız Geldi! Gişeye Gelin',
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        Icon: Bell,
        pulse: true,
    },
    IN_SERVICE: {
        label: 'İşleminiz Yapılıyor',
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        Icon: Wrench,
        pulse: false,
    },
    DONE: {
        label: 'İşlem Tamamlandı',
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
        Icon: CheckCircle2,
        pulse: false,
    },
    NO_SHOW: {
        label: 'Gelmedi Olarak İşaretlendi',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        Icon: XCircle,
        pulse: false,
    },
};

// ─── Component ──────────────────────────────────────────────────────────────
export const MyTicketPage = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();

    const isFinalStatus = (status?: QueueTicket['status']) =>
        status === 'DONE' || status === 'NO_SHOW';

    // 3 saniyelik polling — Gereksinim 4.x
    // refetchInterval: false ile final state'te otomatik durur (useEffect'e gerek yok)
    const { data: ticket, isLoading, isError } = useQuery<QueueTicket>({
        queryKey: ['my-ticket', ticketId],
        queryFn: async () => {
            const res = await api.get(`/queue/ticket/${ticketId}`);
            return res.data;
        },
        refetchInterval: (query) =>
            isFinalStatus(query.state.data?.status) ? false : 3000,
        refetchIntervalInBackground: true,
    });

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-50">
                <Loader2 className="animate-spin text-[#002855]" size={40} />
                <p className="text-[#002855] font-semibold">Bilet bilgisi alınıyor...</p>
            </div>
        );
    }

    // ── Error / Not Found ──
    if (isError || !ticket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50 p-6 text-center">
                <XCircle size={64} className="text-red-400" />
                <p className="text-red-600 font-bold text-lg">Bilet bulunamadı.</p>
                <p className="text-gray-400 text-sm">Bu bilet mevcut değil veya süresi dolmuş.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-2 px-6 py-3 bg-[#002855] text-white font-bold rounded-2xl hover:bg-[#003a7a] transition-colors"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        );
    }

    const cfg = STATUS_CONFIG[ticket.status];
    const { Icon } = cfg;
    const finalState = isFinalStatus(ticket.status);

    // ── Main View ──
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-[#002855] text-white px-6 pt-6 pb-14">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4 text-sm"
                >
                    <ArrowLeft size={16} /> Ana Sayfa
                </button>
                <h1 className="text-xl font-black tracking-tight">Bilet Takibi</h1>
                <p className="text-blue-200 text-sm mt-0.5">
                    {finalState
                        ? 'İşleminiz sonuçlandı.'
                        : 'Durum her 3 saniyede otomatik güncelleniyor.'}
                </p>
            </div>

            {/* Bilet Kartı — header'ın altına bindirilmiş */}
            <div className="mx-4 -mt-10">
                <div className={`bg-white rounded-[40px] p-8 shadow-2xl border-4 ${cfg.border} text-center space-y-3`}>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Bilet Numaranız</p>
                    <h2 className="text-7xl font-black text-[#002855] leading-none">{ticket.ticketNumber}</h2>
                    <p className="text-sm text-gray-500 font-medium">{ticket.serviceType}</p>

                    {/* Durum badge */}
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${cfg.bg} ${cfg.color} font-bold text-sm`}>
                        {cfg.pulse && (
                            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ticket.status === 'CALLED' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${ticket.status === 'CALLED' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            </span>
                        )}
                        <Icon size={16} />
                        {cfg.label}
                    </div>
                </div>
            </div>

            {/* İstatistik kartları — sadece aktif bekleme sürecinde */}
            {!finalState && (
                <div className="mx-4 mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center space-y-1">
                        <div className="flex justify-center mb-1">
                            <Users size={22} className="text-[#002855]" />
                        </div>
                        <p className="text-3xl font-black text-[#002855]">{ticket.aheadOfMe}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Önünüzdeki Kişi</p>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center space-y-1">
                        <div className="flex justify-center mb-1">
                            <Clock size={22} className="text-orange-500" />
                        </div>
                        {/* Tahmini bekleme: formula uygulanmış değer backend'den geliyor */}
                        <p className="text-3xl font-black text-orange-500">~{ticket.estimatedWaitTime}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Dk. Bekleme</p>
                    </div>
                </div>
            )}

            {/* CALLED — acil uyarı banner */}
            {ticket.status === 'CALLED' && (
                <div className="mx-4 mt-4 bg-orange-500 text-white rounded-3xl p-5 flex items-center gap-4 shadow-lg animate-bounce">
                    <Bell size={32} className="flex-shrink-0" />
                    <div>
                        <p className="font-black text-lg">Sıranız Geldi!</p>
                        <p className="text-sm text-orange-100">Lütfen gişeye gidiniz.</p>
                    </div>
                </div>
            )}

            {/* DONE — teşekkür mesajı */}
            {ticket.status === 'DONE' && (
                <div className="mx-4 mt-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-3xl p-5 flex items-center gap-4">
                    <CheckCircle2 size={32} className="flex-shrink-0" />
                    <div>
                        <p className="font-black">İşleminiz Tamamlandı</p>
                        <p className="text-sm text-green-600">Turkcell'i tercih ettiğiniz için teşekkürler.</p>
                    </div>
                </div>
            )}

            {/* NO_SHOW — bilgi mesajı */}
            {ticket.status === 'NO_SHOW' && (
                <div className="mx-4 mt-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-3xl p-5 flex items-center gap-4">
                    <XCircle size={32} className="flex-shrink-0" />
                    <div>
                        <p className="font-black">Gelmedi Olarak İşaretlendi</p>
                        <p className="text-sm text-red-500">Yeni sıra almak için şubeye gidin.</p>
                    </div>
                </div>
            )}

            {/* Polling göstergesi — sadece aktif süreçte */}
            {!finalState && (
                <div className="flex items-center justify-center gap-2 mt-6 pb-6 text-gray-400 text-xs">
                    <Loader2 size={12} className="animate-spin" />
                    Her 3 saniyede güncelleniyor
                </div>
            )}
        </div>
    );
};
