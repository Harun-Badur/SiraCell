import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { type QueueTicket } from '../types';
import { Loader2, ArrowLeft, Clock, Users, Bell, CheckCircle2, TicketX, Zap, TicketSlash } from 'lucide-react';
import type { ElementType } from 'react';

type StatusConfig = { label: string; color: string; bg: string; border: string; Icon: ElementType; pulseMode: boolean };

const STATUS_CONFIG: Record<QueueTicket['status'], StatusConfig> = {
    WAITING: { label: 'Bekliyorsunuz', color: 'text-darkblue', bg: 'bg-turkcell/20', border: 'border-turkcell', Icon: Clock, pulseMode: false },
    CALLED: { label: 'Sıranız Geldi!', color: 'text-white', bg: 'bg-emerald-500', border: 'border-emerald-600', Icon: Bell, pulseMode: true },
    IN_SERVICE: { label: 'İşleminiz Yapılıyor', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', Icon: Zap, pulseMode: true },
    DONE: { label: 'İşlem Tamamlandı', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300', Icon: CheckCircle2, pulseMode: false },
    NO_SHOW: { label: 'Müşteri Gelmedi', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', Icon: TicketX, pulseMode: false },
};

export const MyTicketPage = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();

    const isFinalStatus = (status?: QueueTicket['status']) => status === 'DONE' || status === 'NO_SHOW';

    const { data: ticket, isLoading, isError } = useQuery<QueueTicket>({
        queryKey: ['my-ticket', ticketId],
        queryFn: async () => {
            const res = await api.get(`/queue/ticket/${ticketId}`);
            return res.data;
        },
        refetchInterval: (query) => isFinalStatus(query.state.data?.status) ? false : 3000,
        refetchIntervalInBackground: true,
    });

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-72 bg-darkblue rounded-b-[48px] z-0" />
                <div className="relative z-10 p-5 flex-1 flex flex-col max-w-md mx-auto w-full pt-8 animate-pulse">
                    <div className="h-4 bg-white/20 rounded w-24 mb-6" />
                    
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-tc-xl border-4 border-white text-center flex flex-col items-center gap-6 relative overflow-hidden h-[340px]">
                        <div className="h-3 bg-darkblue/5 rounded w-24 mb-2" />
                        <div className="h-20 bg-darkblue/10 rounded w-48 mb-3" />
                        <div className="h-6 bg-darkblue/5 rounded-full w-32 mb-8" />
                        
                        <div className="w-full mt-auto h-14 bg-darkblue/5 rounded-2xl" />
                    </div>

                    <div className="mt-8 flex gap-4">
                        <div className="bg-white rounded-3xl h-32 flex-1 border border-slate-100 flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-darkblue/10" />
                             <div className="w-16 h-8 bg-darkblue/10 rounded" />
                        </div>
                        <div className="bg-white rounded-3xl h-32 flex-1 border border-slate-100 flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-darkblue/10" />
                             <div className="w-16 h-8 bg-darkblue/10 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !ticket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4 bg-slate-50 p-6 text-center animate-fade-up">
                <div className="p-6 bg-darkblue/5 rounded-full mb-2">
                    <TicketSlash size={56} className="text-darkblue" strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-slate-600 font-black text-xl mb-1">Henüz bir sıraya girmediniz.</h2>
                    <p className="text-slate-500 font-medium text-sm">Geleceği birlikte kodlayalım!</p>
                </div>
                <button onClick={() => navigate('/')} className="mt-4 px-8 py-3 bg-darkblue text-white font-bold rounded-xl hover:bg-[#003a7a] transition-all shadow-md">Ana Sayfaya Dön</button>
            </div>
        );
    }

    const cfg = STATUS_CONFIG[ticket.status];
    const finalState = isFinalStatus(ticket.status);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col relative overflow-hidden">
            
            {/* Dark Header Background extended downwards */}
            <div className="absolute top-0 left-0 right-0 h-72 bg-darkblue rounded-b-[48px] z-0" />

            <div className="relative z-10 p-5 flex-1 flex flex-col max-w-md mx-auto w-full pt-8">
                {/* Back Button */}
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm font-bold w-fit">
                    <ArrowLeft size={18} strokeWidth={3} /> Sıra Listesi
                </button>

                {/* The Ticket Card */}
                <div className={`bg-white rounded-[2.5rem] p-8 shadow-tc-xl border-4 ${ticket.status === 'CALLED' ? 'border-emerald-500 shadow-emerald-500/20' : 'border-white'} text-center flex flex-col items-center gap-6 animate-bounce-in relative overflow-hidden`}>
                    
                    {/* Punch holes for realistic ticket effect */}
                    <div className="absolute -left-4 top-[60%] w-8 h-8 rounded-full bg-slate-50 border-r-2 border-slate-100 z-20" />
                    <div className="absolute -right-4 top-[60%] w-8 h-8 rounded-full bg-slate-50 border-l-2 border-slate-100 z-20" />
                    
                    {/* Dashed line */}
                    <div className="absolute left-6 right-6 top-[60%] border-t-[3px] border-dashed border-slate-200 z-10" />

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">QR Bilet No</p>
                        <h2 className="text-7xl sm:text-8xl font-black text-darkblue tracking-tighter leading-none">{ticket.ticketNumber}</h2>
                        <h3 className="text-lg font-bold text-slate-700 mt-3 bg-slate-100 px-4 py-1.5 rounded-full inline-block">{ticket.serviceType}</h3>
                    </div>

                    <div className="w-full pt-10 pb-2 z-20">
                        <div className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-lg shadow-sm transition-all duration-300 ${cfg.bg} ${cfg.color} ${cfg.pulseMode ? 'animate-pulse-ring' : ''}`}>
                            <cfg.Icon size={24} strokeWidth={3} />
                            {cfg.label}
                        </div>
                    </div>
                </div>

                {/* Dynamic Content below ticket */}
                <div className="mt-8 flex flex-col gap-4">
                    
                    {!finalState && ticket.status !== 'CALLED' && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-up">
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center gap-1">
                                <Users size={24} className="text-turkcell mb-1" strokeWidth={2.5} />
                                <span className="text-4xl font-black text-darkblue leading-none">{ticket.aheadOfMe}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Önünüzdeki</span>
                            </div>
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center gap-1">
                                <Clock size={24} className="text-darkblue mb-1" strokeWidth={2.5} />
                                <span className="text-4xl font-black text-turkcell leading-none">~{ticket.estimatedWaitTime}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Dk Bekleme</span>
                            </div>
                        </div>
                    )}

                    {ticket.status === 'CALLED' && (
                        <div className="bg-darkblue rounded-3xl p-6 text-white text-center shadow-tc-xl animate-fade-up">
                            <h3 className="text-2xl font-black text-turkcell mb-2">Lütfen Gişeye Yönelin</h3>
                            <p className="text-sm font-medium text-white/80">Sıranız geldiği için işlem başlatmak üzere gişe personeli sizi bekliyor.</p>
                        </div>
                    )}

                    {/* Final state messages */}
                    {finalState && (
                        <div className="text-center p-6 bg-white rounded-3xl border border-slate-200 animate-fade-up shadow-sm">
                            <h3 className="text-lg font-black text-darkblue mb-1">Oturum Sonlandı</h3>
                            <p className="text-slate-500 font-medium text-sm">Turkcell'i tercih ettiğiniz için teşekkür ederiz. Yeni bir işlem için tekrar sıra alabilirsiniz.</p>
                        </div>
                    )}

                    {/* Polling Indicator */}
                    {!finalState && (
                        <div className="flex justify-center items-center gap-2 text-slate-400 font-bold text-xs mt-4">
                            <Loader2 size={14} className="animate-spin text-turkcell" /> CANLI TAKİP
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
