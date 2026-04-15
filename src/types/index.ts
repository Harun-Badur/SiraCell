export type UserRole = 'CUSTOMER' | 'STAFF' | 'MANAGER' | 'ADMIN';

export interface User {
    id: string;
    gsm: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface Branch {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status?: string; // Doluluk durumu için
}

export interface QueueTicket {
    id: string;
    ticketNumber: string;
    status: 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'DONE' | 'NO_SHOW';
    serviceType: string;
    aheadOfMe: number;
    estimatedWaitTime: number; // Dakika cinsinden
}