import React, { FormEvent, useState } from "react";
import { Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { LoginResponse } from "../../client";
import { LoginProps, LoginSuccess, UserLoginInput } from "../../interfaces";

export default function Login(props: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data: UserLoginInput = {
      email: email,
      password: password,
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
    fetch("/api/v1/auth/login", requestProps)
      .then((r) => r.json())
      .then((r: LoginResponse) => {
        const user: LoginSuccess = {
          username: r.username,
          email: r.email,
          jwt: r.jwt,
        };
        props.onLogin(user);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
