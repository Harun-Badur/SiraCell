import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, TicketX } from 'lucide-react';

// Demo statik geçmiş verisi 
const PAST_TICKETS = [
    { id: 't1', queueNo: 'A123', service: 'Bireysel İşlemler', date: '21 Ekim 2026', time: '14:30', status: 'DONE', branch: 'Turkcell Kadıköy Şubesi' },
    { id: 't2', queueNo: 'B045', service: 'Kurumsal Abonelik', date: '18 Ekim 2026', time: '09:15', status: 'DONE', branch: 'Turkcell Ümraniye Merkez' },
    { id: 't3', queueNo: 'C99', service: 'Fatura İtirazı', date: '02 Ekim 2026', time: '16:45', status: 'NO_SHOW', branch: 'Turkcell Maltepe Park' },
];

export const PastTicketsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
            {/* Dark Top Design */}
            <div className="absolute top-0 right-0 left-0 h-48 bg-[#002855] rounded-b-[3rem] z-0" />

            <div className="relative z-10 flex flex-col flex-1 max-w-2xl mx-auto w-full p-6 pt-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm font-bold w-fit">
                    <ArrowLeft size={18} strokeWidth={3} /> Geri Dön
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight">Geçmiş Biletlerim</h1>
                    <p className="text-blue-200 mt-1 text-sm font-medium">Önceki işlem detaylarınıza buradan ulaşabilirsiniz.</p>
                </div>

                <div className="flex flex-col gap-4 animate-fade-up">
                    {PAST_TICKETS.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-turkcell transition-colors cursor-default">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl flex-shrink-0 ${ticket.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {ticket.status === 'DONE' ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <TicketX size={24} strokeWidth={2.5} />}
                                </div>
                                <div>
                                    <h3 className="font-black text-[#002855] text-lg leading-tight">{ticket.queueNo} <span className="text-sm font-bold text-slate-400 capitalize">• {ticket.service}</span></h3>
                                    <p className="text-sm font-bold text-slate-500 mt-0.5">{ticket.branch}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-400">
                                        <Clock size={12} />
                                        <span>{ticket.date} - {ticket.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase ${ticket.status === 'DONE' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-rose-100/50 text-rose-700'}`}>
                                    {ticket.status === 'DONE' ? 'TAMAMLANDI' : 'GELMEDİ'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
