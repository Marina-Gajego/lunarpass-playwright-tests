import { faker } from '@faker-js/faker';

export interface Mission {
    id: string;
    baseId: string;
    rocket: string;
    departureDate: string;
    returnDate: string;
    price: number;
}

export interface Reservation {
    missionId: string;
}

export interface Ticket {
    missionId: string;
}

export function validMission(overrides: Partial<Mission> = {}): Mission {
    return {
        id: 'LP-' + faker.string.alphanumeric({ length: 4, casing: 'upper' }),
        baseId: 'aurora',
        rocket: 'Startship',
        departureDate: '2028-01-20',
        returnDate: '2028-01-27',
        price: 5000.00,
        ...overrides,
    };
}
