import { faker } from '@faker-js/faker';

export interface User {
    email: string;
    password: string;
}

export function validUser(overrides: Partial<User> = {}): User {
    return {
        email: 'buzz@lunarpass.dev',
        password: 'pwd123',
        ...overrides,
    };
}

export function invalidEmail(overrides: Partial<User> = {}): User {
    return validUser({
        email: faker.internet.email(),
        ...overrides,
    });
}

export function invalidPassword(overrides: Partial<User> = {}): User {
    return validUser({
        password: faker.internet.password(),
        ...overrides,
    });
}

export function invalidUser(overrides: Partial<User> = {}): User {
    return validUser({
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...overrides,
    });
}