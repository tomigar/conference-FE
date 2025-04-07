type User = {
    id?: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    password?: string;
};

export type { User };