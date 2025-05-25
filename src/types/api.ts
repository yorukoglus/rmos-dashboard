export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const API_ENDPOINTS = {
  LOGIN: "https://service.rmosweb.com/security/createToken",
  FORECAST: "https://frontapi.rmosweb.com/api/Procedure/StpRmforKlasik_2",
  BLACKLIST: {
    GET: "https://frontapi.rmosweb.com/api/Kara/Getir_Kod",
    ADD: "https://frontapi.rmosweb.com/api/Kara/Ekle",
  },
} as const;
