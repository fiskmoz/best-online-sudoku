import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppDropdown from "./components/inputs/dropdown";
import Login from "./components/containers/Login";
import { AppContext, DropdownOutput, LoginSuccess } from "./interfaces";
import { ValidateJwt, ValidateJwtResponse } from "./client";

function App() {
  const [context, setContext] = useState<AppContext>({
    isAuthenticted: false,
  });
  const appContext = React.createContext(context);

  useEffect(() => {
    let validatedJwt: string = getCookie("jwt");
    const validatedEmail: string = getCookie("email");
    let validatedUsername: string = "";
    if (!!validatedJwt && !context.isAuthenticted) {
      const data: ValidateJwt = {
        email: validatedEmail,
        jtw: validatedJwt,
      };
      const requestProps: RequestInit = {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch("api/v1/auth/validate", requestProps)
        .then((r) => r.json())
        .then((r: ValidateJwtResponse) => {
          if (r.status === "success" || r.status === "expired") {
            validatedUsername = !!r.username ? r.username : "";
            if (r.status === "expired") {
              validatedJwt = !!r.jwt ? r.jwt : "";
            }
            const newContext: AppContext = {
              isAuthenticted: true,
              jwt: validatedJwt,
              email: validatedEmail,
              username: validatedUsername,
            };
            setContext(newContext);
          }
        })
        .catch((e) => {
          deleteCookie("jwt");
          deleteCookie("email");
          console.log(e);
        });
    }
  });

  function handleLogin(e: LoginSuccess): void {
    const newContext: AppContext = {
      isAuthenticted: true,
      jwt: e.jwt,
      email: e.email,
      username: e.username,
    };
    setContext(newContext);
    setCookie("jwt", e.jwt, 1);
    setCookie("email", e.email, 1);
  }

  function setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ""
  ) {
    const d = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cpath = path ? `; path=${path}` : "";
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  function getCookie(name: string) {
    const ca: Array<string> = document.cookie.split(";");
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, "");
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }
  function deleteCookie(name: string) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  function handleDropdown(e: DropdownOutput): void {
    return;
  }

  return (
    <appContext.Provider value={context}>
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-6">
              {!context.isAuthenticted ? (
                <Login onLogin={(e: LoginSuccess) => handleLogin(e)}></Login>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        <AppDropdown
          id="0"
          variant="primary"
          title="en dropdown"
          selectables={["hej", "san", "svej", "sansa"]}
          onSelect={(e: DropdownOutput) => handleDropdown(e)}
        ></AppDropdown>
      </div>
    </appContext.Provider>
  );
}

export default App;
