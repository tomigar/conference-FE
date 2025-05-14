type User = {
    id?: number | string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | string;
    password?: string;
    c_password?: string;
};

export type { User };