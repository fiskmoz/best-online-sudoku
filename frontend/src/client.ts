export interface LoginResponse {
  status: string;
  message: string;
  jwt: string;
  username: string;
  email: string;
}

export interface ValidateJwt {
  email: string;
  jtw: string;
}

export interface ValidateJwtResponse {
  status: "success" | "expired" | "invalid";
  message: "string";
  jwt?: string;
  username?: string;
  email?: string;
}
