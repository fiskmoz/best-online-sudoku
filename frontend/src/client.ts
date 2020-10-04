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

export interface GenerateNormalSudokuResponse {
  rows: number[][];
}
export interface RankedSudokuResponseStart {
  rows: number[][];
  token: string;
  id: string;
}

export interface RankedBase {
  jwt: string;
  email: string;
}

export interface RankedSudokuCallEnd extends RankedBase {
  token: string;
  id: string;
  rows: number[][];
}
