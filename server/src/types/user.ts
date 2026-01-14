export interface Manager {
    id: string;
    cognito_sub: string;
    name: string;
    email: string;
    created_at: Date;
}

export interface Tenant {
    id: string;
    cognito_sub: string;
    name: string;
    email: string;
    created_at: Date;
}
