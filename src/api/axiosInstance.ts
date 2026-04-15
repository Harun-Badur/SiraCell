import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const IS_MOCK = true;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// Authentication Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==========================================
// MOCK DATA LAYER (TESTING ENVIRONMENT)
// ==========================================
let mockInitTime = Date.now();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

if (IS_MOCK) {
    console.warn("⚠️ SiraCell Mock Data Layer is ACTIVE. Network requests are intercepted.");

    api.defaults.adapter = async (config): Promise<AxiosResponse> => {
        // Enforce a 1.5s delay to trigger Turkcell Loader & Skeletons
        await delay(1500);

        const url = config.url || '';
        const method = (config.method || 'GET').toUpperCase();

        const successResponse = (data: any): AxiosResponse => ({
            data,
            status: 200,
            statusText: 'OK',
            headers: {} as any,
            config: config as any,
        });

        // 1. GET /branches -> Return 3 Real Istanbul Turkcell Branches
        if (url.includes('/branches') && !url.includes('/service-types') && method === 'GET') {
            const isSpecific = url.match(/\/branches\/([^/]+)$/);
            if (isSpecific) {
                return successResponse({
                    id: isSpecific[1],
                    name: 'Turkcell Plaza Küçükyalı',
                    address: 'Aydınevler, İnönü Cd. No:20, 34854 Maltepe/İstanbul',
                    latitude: 40.9472,
                    longitude: 29.1311,
                    workingHours: '09:00 - 18:00',
                    activeCounters: 4,
                    waitingCount: 15,
                });
            }
            return successResponse([
                { id: 'b1', name: 'Turkcell Plaza Küçükyalı', address: 'Aydınevler, Maltepe', latitude: 40.9472, longitude: 29.1311, waitingCount: 22, activeCounters: 5 },
                { id: 'b2', name: 'Turkcell Kadıköy Şube', address: 'Moda Cd., Kadıköy', latitude: 40.9882, longitude: 29.0253, waitingCount: 4, activeCounters: 3 },
                { id: 'b3', name: 'Turkcell Beşiktaş Merkez', address: 'Barbaros Blv., Beşiktaş', latitude: 41.0428, longitude: 29.0076, waitingCount: 11, activeCounters: 2 },
            ]);
        }

        // Mock Service Types for branch details
        if (url.includes('/service-types') && method === 'GET') {
            return successResponse([
                { id: 's1', name: 'Bireysel Hat İşlemleri', avgDuration: 5 },
                { id: 's2', name: 'Fatura ve Ödeme', avgDuration: 3 },
            ]);
        }

        // Mock Queue Join
        if (url.includes('/queue/join') && method === 'POST') {
            // Reset mock time so ticket simulation restarts
            mockInitTime = Date.now();
            return successResponse({
                id: 'mock-t-101',
                ticketNumber: 'A101'
            });
        }

        // 2. GET /queue/ticket/:id -> Polling Simulation
        if (url.includes('/queue/ticket/') && method === 'GET') {
            const timeElapsed = Date.now() - mockInitTime;
            // Simulated state change after 10 seconds checking (approx 3rd/4th poll)
            const isCalled = timeElapsed > 10000;
            
            return successResponse({
                id: 'mock-t-101',
                status: isCalled ? 'CALLED' : 'WAITING',
                ticketNumber: 'A101',
                serviceType: 'Bireysel İşlemler',
                aheadOfMe: isCalled ? 0 : 3,
                estimatedWaitTime: isCalled ? 0 : 15,
            });
        }

        // 3. POST /counter/call-next -> Staff Call
        if (url.includes('/counter/call-next') && method === 'POST') {
            return successResponse({
                ticket_number: 'B' + Math.floor(Math.random() * 100) + 200,
                service_type: 'Kurumsal Abonelik',
                user_gsm: '532 *** ** ' + Math.floor(Math.random() * 99)
            });
        }

        // Staff Complete / No-Show / Feedback
        if ((url.includes('/counter/') || url.includes('/feedback')) && (method === 'PATCH' || method === 'POST')) {
            return successResponse({ success: true });
        }

        // Auth Mocks
        if (url.includes('/auth') || url.includes('/login')) {
            return successResponse({ token: 'turkcell-mock-jwt-1234' });
        }

        const errorResponse: any = new Error("Mocked 404");
        errorResponse.response = { status: 404, data: { message: "Mock route not matched" } };
        return Promise.reject(errorResponse);
    };
}

export default api;