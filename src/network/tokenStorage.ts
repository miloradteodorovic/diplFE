import { getIdToken, GetTokenData, refreshToken } from './auth';
import { getTime, isAfter } from 'date-fns';

export interface TokenInfo {
    token: string;
    refreshToken: string;
    expirationTime: number;
    expiresIn: number;
}

export async function getToken(): Promise<string> {
    const tokenData = localStorage.getItem('tokenInfo');
    const code = localStorage.getItem('code');
    if (!tokenData) {
        const result: GetTokenData = await getIdToken(code!!);
        if (result) {
            const data = JSON.stringify({
                token: result.id_token,
                expirationTime: getTime(new Date()),
                refreshToken: result.refresh_token,
                expiresIn: result.expires_in * 1000
            });
            localStorage.setItem('tokenInfo', data);
            return result.id_token;
        } else throw Error('Token result error.');
    } else {
        const tokenInfo: TokenInfo = JSON.parse(tokenData);
        if (isExpired(tokenInfo)) {
            const refreshResult = await refreshToken(tokenInfo.refreshToken);
            const newTokenData = JSON.stringify({
                token: refreshResult.id_token,
                expirationTime: getTime(new Date()),
                refreshToken: refreshResult.refresh_token,
                expiresIn: refreshResult.expires_in * 1000
            });
            localStorage.setItem('tokenInfo', newTokenData);
            return refreshResult.id_token;
        } else {
            return tokenInfo.token;
        }
    }

}

export function isExpired(tokenInfo: TokenInfo): boolean {
    const expirationDate = new Date(tokenInfo.expirationTime + tokenInfo.expiresIn + 5 * 60 * 1000);
    return isAfter(new Date(), expirationDate);
}