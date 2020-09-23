import { type } from "os";

export interface DropdownInput {
  id: string;
  variant: string;
  title: string;
  selectables: string[];
  indexSelected?: number;
  onSelect: (event: DropdownOutput) => void;
}

export interface DropdownOutput {
  value: string;
  index: number;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AppContext {
  isAuthenticted: boolean;
  username?: string;
  email?: string;
  theme?: "light" | "dark";
  jwt?: string;
}
export interface LoginSuccess {
  username: string;
  email: string;
  jwt: string;
}

export interface LoginProps {
  onLogin: (event: LoginSuccess) => void;
}

export interface HeaderProps {
  onLoginClick: (view: ViewType) => void;
  onLogoutClick: (view: ViewType) => void;
}

export type ViewType =
  | "home"
  | "normal"
  | "ranked"
  | "scoreboard"
  | "profile"
  | "error"
  | "logout"
  | "login";
