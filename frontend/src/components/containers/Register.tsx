import React, { FormEvent, useEffect, useState } from "react";
import {
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
} from "react-bootstrap";
import { LoginResponse } from "../../client";
import {
  Country,
  LoginSuccess,
  RegisterProps,
  UserRegisterInput,
} from "../../interfaces";

export default function Register(props: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  useEffect(() => {
    getCountries();
  }, []);

  function getCountries() {
    const requestProps: RequestInit = {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/api/v1/auth/countries", requestProps)
      .then((r) => r.json())
      .then((r: Country[]) => {
        setCountries(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data: UserRegisterInput = {
      username: username,
      email: email,
      password: password,
      country: country,
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
    fetch("/api/v1/auth/register", requestProps)
      .then((r) => r.json())
      .then((r: LoginResponse) => {
        if (r.status === "success") {
          const user: LoginSuccess = {
            username: r.username,
            email: r.email,
            jwt: r.jwt,
          };
          props.onRegister(user);
          setError("");
        } else {
          setError(r.message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="Register">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
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
        <FormGroup controlId="country">
          <FormLabel>Select Country</FormLabel>
          <FormControl
            as="select"
            onChange={(e: any) => setCountry(e.target.value)}
          >
            {countries.map((c: Country) => {
              return <option key={c.code}>{c.name}</option>;
            })}
          </FormControl>
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Register
        </Button>
        {!!error ? (
          <Alert className="mt-2" variant="warning">
            {error}
          </Alert>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
