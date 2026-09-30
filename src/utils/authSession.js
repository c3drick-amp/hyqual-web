export const REMEMBER_ME_KEY = "hyqual_remember_me";
export const ACTIVE_AUTH_SESSION_KEY = "hyqual_active_auth_session";

export function hasRememberedSession() {
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function hasActiveAuthSession() {
  return sessionStorage.getItem(ACTIVE_AUTH_SESSION_KEY) === "true";
}