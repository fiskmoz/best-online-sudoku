import { AppContext } from "./../interfaces";
import React from "react";
const context: AppContext = {
  isAuthenticted: false,
};

const Context = React.createContext(context);

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

export default Context;
