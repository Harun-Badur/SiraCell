import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { type Branch } from '../types';
import { MapPin, Users, Clock, ChevronRight, RefreshCw, SearchX } from 'lucide-react';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface BranchWithStats extends Branch {
    waitingCount: number;
    activeCounters: number;
}

const ISTANBUL: [number, number] = [41.0082, 28.9784];

export const BranchListPage = () => {
    const navigate = useNavigate();

    const { data: branches, isLoading, isError, refetch } = useQuery<BranchWithStats[]>({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await api.get('/branches');
            return res.data;
        },
        refetchInterval: 30_000,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col bg-slate-50 min-h-[calc(100vh-[64px])]">
                {/* Map Skeleton */}
                <div className="h-64 sm:h-80 w-full bg-slate-200 animate-pulse border-b-4 border-slate-300 flex-shrink-0" />
                
                <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-4">
                    <div className="h-8 bg-slate-200 rounded-lg w-48 mb-6 animate-pulse" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-5 bg-darkblue/10 rounded-md w-3/4 animate-pulse" />
                                    <div className="h-3 bg-darkblue/5 rounded-md w-1/2 animate-pulse" />
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <div className="h-8 bg-slate-100 rounded-xl w-20 animate-pulse" />
                                    <div className="h-8 bg-slate-100 rounded-xl w-24 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4 text-slate-500 bg-slate-50">
                <p className="font-bold">Bağlantı Hatası</p>
                <button onClick={() => refetch()} className="flex items-center gap-2 px-6 py-3 bg-darkblue text-white rounded-2xl text-sm font-bold hover:bg-[#003a7a] transition-all active:scale-95 shadow-tc">
                    <RefreshCw size={18} /> Yeniden Dene
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-slate-50 min-h-[calc(100vh-[64px])]">
            {/* Minimal Map Section */}
            <div className="h-64 sm:h-80 w-full relative z-0 flex-shrink-0 shadow-sm border-b-4 border-turkcell">
                <MapContainer center={ISTANBUL} zoom={11} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap & CARTO' />
                    {branches?.map((branch) => (
                        <Marker key={branch.id} position={[branch.latitude, branch.longitude]} eventHandlers={{ click: () => navigate(`/branch/${branch.id}`) }}>
                            <Popup className="rounded-xl overflow-hidden border-none shadow-tc-xl">
                                <div className="font-sans text-sm min-w-[150px] p-1">
                                    <strong className="text-darkblue block text-base leading-tight mb-1">{branch.name}</strong>
                                    <span className="text-slate-500 text-xs block mb-2">{branch.address}</span>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-darkblue bg-turkcell/20 px-2 py-1 rounded-md w-max">
                                        <Users size={12} className="text-darkblue" />
                                        <span>{branch.waitingCount ?? 0} Bekleyen</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                {/* Gradient overlay for fade effect into list */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent z-[1000] pointer-events-none" />
            </div>

            {/* List Section */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-4">
                <div className="flex items-end justify-between mb-2">
                    <h2 className="text-2xl font-black text-darkblue tracking-tight">Size En Yakın Şubeler</h2>
                    <span className="text-xs font-bold bg-darkblue/10 text-darkblue px-3 py-1 rounded-full">{branches?.length ?? 0} Nokta</span>
                </div>

                {branches?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
                        <div className="p-5 bg-darkblue/5 rounded-full mb-4">
                            <SearchX size={48} className="text-darkblue" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-black text-slate-600">Yakınınızda şube bulamadık.</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Lütfen konum ayarlarınızı kontrol edin.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
                    {branches?.map((branch) => {
                        const isClosed = branch.activeCounters === 0;
                        const waitTime = !isClosed ? Math.ceil((branch.waitingCount * 5) / branch.activeCounters) : null;
                        
                        // Semantic badge computation
                        const waitColor = waitTime !== null && waitTime <= 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                          waitTime !== null && waitTime <= 25 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                          'bg-rose-50 text-rose-700 border-rose-200';
                        
                        const densityBadge = branch.waitingCount < 5 ? { label: 'Sakin', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' } :
                                             branch.waitingCount > 10 ? { label: 'Çok Yoğun', class: 'bg-rose-50 text-rose-700 border-rose-200' } :
                                             { label: 'Normal', class: 'bg-amber-50 text-amber-700 border-amber-200' };

                        return (
                            <div
                                key={branch.id}
                                onClick={() => navigate(`/branch/${branch.id}`)}
                                className="group bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between cursor-pointer hover:border-turkcell hover:shadow-tc transition-all duration-300 hover:-translate-y-1 active:scale-95 animate-fade-up relative overflow-hidden"
                            >
                                {/* Top info */}
                                <div className="space-y-1.5 pr-8">
                                    <h3 className="font-black text-lg text-darkblue leading-tight">{branch.name}</h3>
                                    <p className="text-xs font-medium text-slate-500 flex items-start gap-1.5 line-clamp-2">
                                        <MapPin size={14} className="text-turkcell flex-shrink-0 mt-0.5" />
                                        <span>{branch.address}</span>
                                    </p>
                                </div>
                                
                                {/* Right Chevron */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-turkcell group-hover:text-darkblue transition-colors text-slate-400">
                                    <ChevronRight size={18} strokeWidth={3} />
                                </div>

                                {/* Bottom Badges */}
                                <div className="mt-5 flex items-center gap-2 flex-wrap">
                                    {!isClosed ? (
                                        <>
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs ${waitColor}`}>
                                                <Clock size={14} /> ~{waitTime} dk
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs ${densityBadge.class}`}>
                                                <Users size={14} /> {branch.waitingCount} Kişi ({densityBadge.label})
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs border border-slate-200">
                                            Gişe Şuan Kapalı
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};