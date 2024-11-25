const EXPIRATION_TIME_IN_MINUTES = 15;

const storeToken = (accessToken, refreshToken) => {
  // Convert minutes to milliseconds
  const expiresInMilliseconds = EXPIRATION_TIME_IN_MINUTES * 60 * 1000;

  // Calculate expiry time based on the current time
  const expiryTime = Date.now() + expiresInMilliseconds;

  // Save the token
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("accessTokenExpiry", expiryTime.toString());
};

const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  const tokenExpiry = localStorage.getItem("accessTokenExpiry");

  if (!token || !tokenExpiry) {
    // Token or expiry time not found, return null
    return null;
  }

  const currentTime = Date.now();

  if (currentTime > parseInt(tokenExpiry, 10)) {
    // Token is expired, remove it from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpiry"); // Fix here
    return null;
  }

  // Token is valid
  return token;
};

const clearToken = () => {
  // Clear the token and expiry time from localStorage
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpiry"); // Fix here
};

export { storeToken, getAccessToken, clearToken };
