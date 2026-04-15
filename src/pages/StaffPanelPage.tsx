import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { UserCheck, CheckCircle2, UserMinus, Power, BarChart3, Clock, Loader2, Navigation, Users, Settings } from 'lucide-react';
import { toast } from '../components/Feedback';

interface ActiveTicket { ticket_number: string; service_type: string; user_gsm?: string; }

// Use localStorage to persist setup state
const getStorageString = (key: string, def: string) => localStorage.getItem(key) || def;

export const StaffPanelPage = () => {
    const queryClient = useQueryClient();
    
    // Setup State
    const [branchId, setBranchId] = useState(() => getStorageString('staff_branch_id', 'branch-1'));
    const [counterId, setCounterId] = useState(() => getStorageString('staff_counter_id', '1'));
    const [serviceTypeId, setServiceTypeId] = useState(() => getStorageString('staff_service_type_id', 'serv-1'));
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        localStorage.setItem('staff_branch_id', branchId);
        localStorage.setItem('staff_counter_id', counterId);
        localStorage.setItem('staff_service_type_id', serviceTypeId);
    }, [branchId, counterId, serviceTypeId]);

    const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null);
    const [isCounterOpen, setIsCounterOpen] = useState(true);

    // Call Next Customer (POST /counter/call-next?counter_id=&service_type_id=)
    const callNextMutation = useMutation<ActiveTicket>({
        mutationFn: async () => {
            const res = await api.post(`/counter/call-next?counter_id=${counterId}&service_type_id=${serviceTypeId}`);
            return res.data?.data || res.data;
        },
        onSuccess: (data) => { 
            setActiveTicket(data); 
            queryClient.invalidateQueries({ queryKey: ['staff-stats', branchId] }); 
            toast.success('Sıradaki müşteri çağrıldı.');
        },
    });

    // Complete or No Show Customer
    const updateStatusMutation = useMutation<void, Error, 'complete' | 'no-show'>({
        mutationFn: async (action) => { await api.patch(`/counter/${action}`); },
        onSuccess: () => { 
            setActiveTicket(null); 
            queryClient.invalidateQueries({ queryKey: ['staff-stats', branchId] }); 
        },
    });

    // Toggle Counter Status
    const toggleMutation = useMutation<void, Error, boolean>({
        mutationFn: async (open) => { 
            await api.patch(`/counter/${counterId}/toggle`, { is_active: open }); 
        },
        onSuccess: (_, open) => setIsCounterOpen(open),
    });

    // Fetch Stats using /counter/queue/{branch_id}
    const { data: stats } = useQuery({
        queryKey: ['staff-stats', branchId],
        queryFn: async () => {
            const res = await api.get(`/counter/queue/${branchId}`);
            return res.data?.data || res.data;
        },
        refetchInterval: 5000
    });

    // Fallbacks if stats return an array or object
    const queueCount = stats?.queue_length ?? stats?.length ?? 0;
    const totalServed = stats?.total_served ?? 0;
    const avgTime = stats?.avg_time ?? 0;

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-slate-50 min-h-[calc(100vh-64px)] animate-fade-up">
            
            {/* Setup Panel Toggle */}
            <button onClick={() => setShowSetup(!showSetup)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-darkblue transition-colors text-sm">
                <Settings size={16} /> Kurulum & Ayarlar
            </button>

            {/* Config Panel */}
            {showSetup && (
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Şube ID</label>
                        <input value={branchId} onChange={e => setBranchId(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold text-darkblue outline-none focus:border-turkcell" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Gişe ID</label>
                        <input value={counterId} onChange={e => setCounterId(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold text-darkblue outline-none focus:border-turkcell" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Servis Tipi ID</label>
                        <input value={serviceTypeId} onChange={e => setServiceTypeId(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold text-darkblue outline-none focus:border-turkcell" />
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="flex justify-between items-center bg-darkblue p-6 rounded-[2rem] text-white shadow-tc-lg border-b-4 border-turkcell relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><BarChart3 size={120} /></div>
                <div className="relative z-10">
                    <h2 className="font-black text-3xl tracking-tight text-white">GİŞE {counterId.length > 3 ? '*' : counterId}</h2>
                    <div className="flex items-center gap-2 mt-1 opacity-80">
                        <Navigation size={14} className="text-turkcell" />
                        <span className="text-xs font-bold uppercase tracking-widest text-turkcell">Personel Konsolu</span>
                    </div>
                </div>
                <button
                    onClick={() => toggleMutation.mutate(!isCounterOpen)}
                    disabled={toggleMutation.isPending}
                    className={`relative z-10 flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 disabled:opacity-60 ${isCounterOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}
                >
                    {toggleMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Power size={18} strokeWidth={3} />}
                    {isCounterOpen ? 'GİŞE AÇIK' : 'GİŞE KAPALI'}
                </button>
            </div>

            {/* Main Area */}
            {!activeTicket ? (
                <div className="space-y-6">
                    <button
                        onClick={() => callNextMutation.mutate()}
                        disabled={!isCounterOpen || callNextMutation.isPending}
                        className="w-full bg-turkcell text-darkblue h-64 sm:h-72 rounded-[3rem] flex flex-col items-center justify-center gap-6 shadow-tc-lg active:scale-[0.98] transition-all hover:-translate-y-1 hover:shadow-tc-xl disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                        {callNextMutation.isPending ? (
                            <Loader2 size={80} className="animate-spin" />
                        ) : (
                            <div className="p-6 bg-darkblue/10 rounded-full group-hover:scale-110 transition-transform">
                                <UserCheck size={80} strokeWidth={2.5} />
                            </div>
                        )}
                        <span className="text-3xl sm:text-4xl font-black tracking-tight">
                            {callNextMutation.isPending ? 'ÇAĞIRILIYOR...' : 'SIRADAKİNİ ÇAĞIR'}
                        </span>
                    </button>

                    {callNextMutation.isError && (
                        <div className="text-center bg-rose-100 text-rose-700 py-3 rounded-2xl font-bold border border-rose-200">
                            İşlem başarısız veya bekleyen müşteri yok.
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center gap-2">
                            <div className="p-3 bg-darkblue/10 text-darkblue rounded-xl"><BarChart3 size={24} strokeWidth={2.5} /></div>
                            <span className="text-3xl font-black text-darkblue leading-none mt-2">{totalServed}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Toplam Hizmet</span>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center gap-2">
                            <div className="p-3 bg-turkcell/20 text-turkcell rounded-xl"><Clock size={24} strokeWidth={2.5} /></div>
                            <span className="text-3xl font-black text-darkblue leading-none mt-2">{avgTime}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ort. İşlem (Dk)</span>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center gap-2">
                            <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><Users size={24} strokeWidth={2.5} /></div>
                            <span className="text-3xl font-black text-darkblue leading-none mt-2">{queueCount}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sıradaki Bekleyen</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-tc-xl border-[6px] border-turkcell space-y-10 relative">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-turkcell/20 to-transparent" />
                    
                    <div className="text-center flex flex-col items-center gap-3">
                        <span className="bg-darkblue text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm animate-pulse">Servis İşlemi</span>
                        <h3 className="text-[5rem] sm:text-[7rem] font-black text-darkblue leading-none tracking-tighter drop-shadow-sm">{activeTicket.ticket_number}</h3>
                        <p className="text-slate-500 font-black text-xl px-4 py-2 bg-slate-100 rounded-2xl">{activeTicket.service_type}</p>
                        {activeTicket.user_gsm && <p className="text-sm font-bold text-slate-400 font-mono tracking-widest">{activeTicket.user_gsm}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => updateStatusMutation.mutate('complete')}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center justify-center gap-3 p-6 sm:p-8 bg-emerald-500 rounded-3xl text-white font-black text-2xl sm:text-3xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/30 disabled:opacity-60"
                        >
                            {updateStatusMutation.isPending && updateStatusMutation.variables === 'complete' ? <Loader2 size={36} className="animate-spin" /> : <CheckCircle2 size={36} strokeWidth={3} />}
                            BİTİR
                        </button>
                        <button
                            onClick={() => updateStatusMutation.mutate('no-show')}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center justify-center gap-3 p-6 sm:p-8 bg-white border-4 border-rose-100 rounded-3xl text-rose-500 font-black text-xl hover:bg-rose-50 transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {updateStatusMutation.isPending && updateStatusMutation.variables === 'no-show' ? <Loader2 size={28} className="animate-spin" /> : <UserMinus size={28} strokeWidth={3} />}
                            GELMEDİ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};