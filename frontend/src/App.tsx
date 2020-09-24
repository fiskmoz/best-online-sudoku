import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/containers/Login";
import { AppContext, LoginSuccess, ViewType } from "./interfaces";
import { ValidateJwt, ValidateJwtResponse } from "./client";
import Context from "./context/state";
import AppHeader from "./components/containers/Header";
import Normal from "./components/containers/Normal";

function App() {
  const defaultContext: AppContext = {
    isAuthenticted: false,
  };
  const [context, setContext] = useState<AppContext>(defaultContext);
  const defaultView: ViewType = "home";
  const [view, setView] = useState<ViewType>(defaultView);
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
    setView("home");
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

  function changeView(newView: ViewType) {
    if (newView === "logout") {
      deleteCookie("jwt");
      deleteCookie("email");
      setContext(defaultContext);
    }
    setView(newView);
  }

  function determineView(): JSX.Element {
    switch (view) {
      case "home":
        return <div>Home</div>;
      case "logout":
        return <div>Logout</div>;
      case "error":
        return <div>Error</div>;
      case "normal":
        return <Normal></Normal>;
      case "ranked":
        return <div>Ranked</div>;
      case "scoreboard":
        return <div>Scoreboard</div>;
      case "login":
        return <Login onLogin={(e: LoginSuccess) => handleLogin(e)}></Login>;
      default:
        return <div></div>;
    }
  }

  return (
    <Context.Provider value={context}>
      <div className="App">
        <div>
          <AppHeader onHeaderClick={(v: ViewType) => changeView(v)}></AppHeader>
        </div>
        <div className="container">{determineView()}</div>
      </div>
    </Context.Provider>
  );
}

export default App;
