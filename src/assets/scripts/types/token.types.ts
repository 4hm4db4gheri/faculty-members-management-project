export interface TokenPayload {
    nameid: string;
    FullAccess?: string;
    exp: number;
    nbf: number;
    iat: number;
}

export interface AccessTokenPayload extends TokenPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone": string;
}