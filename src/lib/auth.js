export function isAuthenticated(jwt) {
    // Replace this with your actual authentication logic
    // It could involve checking for a valid JWT token, or making an API request to verify user status
    const userIsAuthenticated = localStorage.getItem("authToken") == jwt;
    return userIsAuthenticated;
}