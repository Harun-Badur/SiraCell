import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { type Branch } from '../types';
import {
    MapPin,
    Clock,
    Users,
    CheckCircle,
    Loader2,
    ArrowLeft,
    TicketCheck,
    Activity,
} from 'lucide-react';

interface BranchDetail extends Branch {
    workingHours: string;
    activeCounters: number;
    waitingCount: number;
}

interface ServiceType {
    id: string;
    name: string;
    avgDuration: number;
}

// Tahmini bekleme süresi formülü: (Bekleyen × 5 dk) / Aktif Gişe
const calcWaitTime = (waiting: number, activeCounters: number): number => {
    if (activeCounters === 0) return 0;
    return Math.ceil((waiting * 5) / activeCounters);
};

export const BranchDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [joinSuccess, setJoinSuccess] = useState(false);
    const [ticketId, setTicketId] = useState<string | null>(null);

    // Şube detaylarını çek
    const { data: branch, isLoading: branchLoading } = useQuery<BranchDetail>({
        queryKey: ['branch', id],
        queryFn: async () => {
            const res = await api.get(`/branches/${id}`);
            return res.data;
        },
    });

    // Hizmet türlerini çek
    const { data: serviceTypes, isLoading: servicesLoading } = useQuery<ServiceType[]>({
        queryKey: ['service-types', id],
        queryFn: async () => {
            const res = await api.get(`/branches/${id}/service-types`);
            return res.data;
        },
    });

    // Sıraya katıl (POST /queue/join)
    const joinMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/queue/join', {
                branchId: id,
                serviceTypeId: selectedService,
            });
            return res.data;
        },
        onSuccess: (data) => {
            setTicketId(data.id);
            setJoinSuccess(true);
        },
    });

    const isLoading = branchLoading || servicesLoading;
    const waitTime = branch ? calcWaitTime(branch.waitingCount ?? 0, branch.activeCounters ?? 1) : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-50">
                <Loader2 className="animate-spin text-[#002855]" size={40} />
                <p className="text-[#002855] font-semibold">Şube bilgileri yükleniyor...</p>
            </div>
        );
    }

    if (joinSuccess && ticketId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-white rounded-[40px] p-10 shadow-2xl border-4 border-[#ffcc00] text-center max-w-sm w-full space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-green-100 p-5 rounded-full">
                            <CheckCircle size={64} className="text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-[#002855]">Sıraya Alındınız!</h2>
                    <p className="text-gray-500 text-sm">Biletiniz başarıyla oluşturuldu. Durumunuzu aşağıdan takip edebilirsiniz.</p>
                    <button
                        onClick={() => navigate(`/my-ticket/${ticketId}`)}
                        className="w-full bg-[#002855] text-white font-bold py-4 rounded-2xl hover:bg-[#003a7a] transition-colors flex items-center justify-center gap-2"
                    >
                        <TicketCheck size={20} />
                        Biletimi Takip Et
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-[#002855] text-white p-6 pb-10 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4 text-sm"
                >
                    <ArrowLeft size={16} /> Geri
                </button>
                <h1 className="text-2xl font-black tracking-tight">{branch?.name}</h1>
                <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                    <MapPin size={14} className="text-[#ffcc00]" />
                    {branch?.address}
                </p>
            </div>

            {/* Stats Card (overlapping header) */}
            <div className="mx-4 -mt-6 bg-white rounded-3xl shadow-lg p-5 border border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                    <div className="flex justify-center">
                        <Users size={20} className="text-[#002855]" />
                    </div>
                    <p className="text-2xl font-black text-[#002855]">{branch?.waitingCount ?? 0}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Bekleyen</p>
                </div>
                <div className="space-y-1 border-x border-gray-100">
                    <div className="flex justify-center">
                        <Clock size={20} className="text-orange-500" />
                    </div>
                    <p className="text-2xl font-black text-orange-500">~{waitTime}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Dk. Bekleme</p>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-center">
                        <Activity size={20} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-black text-green-500">{branch?.activeCounters ?? 0}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Aktif Gişe</p>
                </div>
            </div>

            {/* Hizmet Türü Seçimi */}
            <div className="p-5 space-y-4 mt-2">
                <h3 className="text-[#002855] font-black text-lg tracking-tight">Hizmet Türü Seçin</h3>
                <div className="space-y-3">
                    {serviceTypes?.map((svc) => (
                        <button
                            key={svc.id}
                            onClick={() => setSelectedService(svc.id)}
                            className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 text-left transition-all ${
                                selectedService === svc.id
                                    ? 'border-[#ffcc00] bg-yellow-50 shadow-md'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                            }`}
                        >
                            <div>
                                <p className="font-bold text-[#002855]">{svc.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Ort. {svc.avgDuration} dk / müşteri
                                </p>
                            </div>
                            {selectedService === svc.id && (
                                <CheckCircle size={22} className="text-[#ffcc00] flex-shrink-0" />
                            )}
                        </button>
                    ))}

                    {!serviceTypes?.length && (
                        <p className="text-center text-gray-400 py-6">Bu şube için hizmet tanımlanmamış.</p>
                    )}
                </div>
            </div>

            {/* Sıraya Katıl Butonu */}
            <div className="px-5 pb-10">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 text-sm text-[#002855]">
                    <strong>Tahmini Bekleme:</strong>{' '}
                    <span className="font-black">
                        ~{waitTime} dakika
                    </span>{' '}
                    <span className="text-gray-400">
                        ({branch?.waitingCount ?? 0} kişi × 5 dk / {branch?.activeCounters ?? 1} gişe)
                    </span>
                </div>

                <button
                    onClick={() => joinMutation.mutate()}
                    disabled={!selectedService || joinMutation.isPending}
                    className="w-full bg-[#ffcc00] text-[#002855] font-black text-lg py-5 rounded-3xl shadow-lg hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-3"
                >
                    {joinMutation.isPending ? (
                        <>
                            <Loader2 size={22} className="animate-spin" />
                            Sıraya Alınıyor...
                        </>
                    ) : (
                        <>
                            <TicketCheck size={22} />
                            SIRAYA KATIL
                        </>
                    )}
                </button>

                {joinMutation.isError && (
                    <p className="text-center text-red-500 text-sm mt-3 font-semibold">
                        Sıraya katılırken bir hata oluştu. Lütfen tekrar deneyin.
                    </p>
                )}
            </div>
        </div>
    );
};
