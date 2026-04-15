import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { type Branch } from '../types';
import { MapPin, Users, Clock, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

// Leaflet marker ikon düzeltmesi (Vite/React için gerekli)
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

// Doluluk rengi: ⌈(bekleyen × 5) / aktif_gişe⌉ dk'ya göre
const getOccupancyColor = (waiting: number, counters: number): string => {
    if (counters === 0) return 'text-gray-400';
    const wait = Math.ceil((waiting * 5) / counters);
    if (wait <= 10) return 'text-green-500';
    if (wait <= 25) return 'text-orange-500';
    return 'text-red-500';
};

const getOccupancyBg = (waiting: number, counters: number): string => {
    if (counters === 0) return 'bg-gray-100 text-gray-500';
    const wait = Math.ceil((waiting * 5) / counters);
    if (wait <= 10) return 'bg-green-50 text-green-700';
    if (wait <= 25) return 'bg-orange-50 text-orange-700';
    return 'bg-red-50 text-red-700';
};

// İstanbul merkezi
const ISTANBUL: [number, number] = [41.0082, 28.9784];

export const BranchListPage = () => {
    const navigate = useNavigate();

    const { data: branches, isLoading, isError, refetch } = useQuery<BranchWithStats[]>({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await api.get('/branches');
            return res.data;
        },
        refetchInterval: 30_000, // Doluluk bilgisini 30s'de bir güncelle
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-[#002855]">
                <Loader2 size={40} className="animate-spin" />
                <p className="font-semibold">Şubeler yükleniyor...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-gray-500">
                <p className="font-bold">Şubeler yüklenemedi.</p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#002855] text-white rounded-2xl text-sm font-bold hover:bg-[#003a7a] transition-colors"
                >
                    <RefreshCw size={16} /> Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-72px)]">
            {/* Leaflet Harita */}
            <div className="h-64 w-full border-b-4 border-[#ffcc00] z-0 flex-shrink-0">
                <MapContainer center={ISTANBUL} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {branches?.map((branch) => (
                        <Marker
                            key={branch.id}
                            position={[branch.latitude, branch.longitude]}
                            eventHandlers={{ click: () => navigate(`/branch/${branch.id}`) }}
                        >
                            <Popup>
                                <div className="font-sans text-sm min-w-[140px]">
                                    <strong className="text-[#002855] block">{branch.name}</strong>
                                    <span className="text-gray-500 text-xs">{branch.address}</span>
                                    <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold">
                                        <Users size={12} />
                                        <span>{branch.waitingCount ?? 0} bekleyen</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Şube Listesi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-black text-[#002855]">Şubeler</h2>
                    <span className="text-xs text-gray-400 font-medium">{branches?.length ?? 0} şube</span>
                </div>

                {branches?.length === 0 && (
                    <p className="text-center text-gray-400 py-10">Yakında şube bulunamadı.</p>
                )}

                {branches?.map((branch) => {
                    const waitTime = branch.activeCounters > 0
                        ? Math.ceil((branch.waitingCount * 5) / branch.activeCounters)
                        : null;

                    return (
                        <div
                            key={branch.id}
                            onClick={() => navigate(`/branch/${branch.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex justify-between items-center cursor-pointer hover:border-[#ffcc00] hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="space-y-2 flex-1 min-w-0">
                                <h3 className="font-black text-[#002855] truncate">{branch.name}</h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                                    <MapPin size={12} className="text-[#ffcc00] flex-shrink-0" />
                                    {branch.address}
                                </p>
                                <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
                                    <span className={`flex items-center gap-1 ${getOccupancyColor(branch.waitingCount, branch.activeCounters)}`}>
                                        <Users size={12} />
                                        {branch.waitingCount ?? 0} bekleyen
                                    </span>
                                    {waitTime !== null && (
                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${getOccupancyBg(branch.waitingCount, branch.activeCounters)}`}>
                                            <Clock size={10} />
                                            ~{waitTime} dk
                                        </span>
                                    )}
                                    {branch.activeCounters === 0 && (
                                        <span className="text-gray-400 text-[10px] font-bold">Gişe kapalı</span>
                                    )}
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 flex-shrink-0 ml-2" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};