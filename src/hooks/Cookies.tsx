import { useCallback } from "react";

export function useCookie() {
  // Get a cookie by name
  const get = useCallback((name: string): string | null => {
    console.log("Getting cookie:", name);
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    console.log("Cookie match:", match);
    return match ? decodeURIComponent(match[2]) : null;
  }, []);

  // Set a cookie
  const set = useCallback((name: string, value: string, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }, []);

  // Remove a cookie
  const remove = useCallback((name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }, []);

  return { get, set, remove };
}
