export const awsUrl = `https://diplomski-api-domain.auth.us-east-1.amazoncognito.com/oauth2/token`;
export const awsClientId = `7rih3g06g23jne1gd6dmpveip2`;
export const loginRedirectUrl = `http://localhost:8080/home`;
export const baseUrl = `https://h7ng4e4dgc.execute-api.us-east-1.amazonaws.com/diplomski`
export const getUserRoleUrl = `${baseUrl}/users/role`;
export const getUsersUrl = `${baseUrl}/users`;
export const getCitiesUrl = `${baseUrl}/cities`;
export const getTheatersUrl = `${baseUrl}/theaters`;
export const getActorsUrl = `${baseUrl}/actors`;
export const getReservationsUrl = `${baseUrl}/reservations_by_user`;
export const makeReservationsUrl = `${baseUrl}/reservations`;
export const getPerformanceUrl = `${baseUrl}/performances`;
export const getShowsUrl = `${baseUrl}/shows`;
export const logoutUrl = `https://diplomski-api-domain.auth.us-east-1.amazoncognito.com/logout?client_id=${awsClientId}&response_type=code&scope=email+openid&redirect_uri=${loginRedirectUrl}`;
export const loginUrl = `https://diplomski-api-domain.auth.us-east-1.amazoncognito.com/login?client_id=${awsClientId}&response_type=code&scope=email+openid&redirect_uri=${loginRedirectUrl}`;