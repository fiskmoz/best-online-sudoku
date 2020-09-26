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

export interface UserRegisterInput {
  username: string;
  email: string;
  password: string;
  country: string;
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

export interface Country {
  code: string;
  name: string;
}

export interface RegisterProps {
  onRegister: (event: LoginSuccess) => void;
}

export interface HeaderProps {
  onHeaderClick: (view: ViewType) => void;
}

export type ViewType =
  | "home"
  | "normal"
  | "ranked"
  | "scoreboard"
  | "profile"
  | "error"
  | "logout"
  | "login"
  | "register";

export type BoardModes = "place" | "note";

export type Difficulties = "easy" | "medium" | "hard" | "extreme";

export interface GridProps {
  rows: number[][];
}

export interface GridCell {
  notes: number[];
  locked: boolean;
  value: number;
  position: GridPosition;
}

export interface CellProps {
  active: boolean;
  mode: BoardModes;
  notes: number[];
  locked: boolean;
  value: number;
  position: GridPosition;
  onCellClick: (e: GridPosition) => void;
}

export interface GridPosition {
  x: number;
  y: number;
}

export interface SelectorProps {
  type: "success" | "primary";
  values: number[];
  selected: number;
  onSelect: (e: number) => void;
}
