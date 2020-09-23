import React, { FormEvent, useContext, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import Context from "../../context/state";
import { HeaderProps } from "../../interfaces";

export default function AppHeader(props: HeaderProps) {
  const context = useContext(Context);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="">Sudoku online</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#normal">Normal</Nav.Link>
          {!!context.isAuthenticted ? (
            <Nav.Link href="#ranked">Play ranked</Nav.Link>
          ) : (
            ""
          )}
          <Nav.Link href="#features">Scoreboards</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="#profile">Profile</Nav.Link>
          {!!context.isAuthenticted ? (
            <Nav.Link
              onClick={() => props.onLogoutClick("logout")}
              eventKey={2}
              href="#logout"
            >
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link
              onClick={() => props.onLoginClick("login")}
              eventKey={2}
              href="#login"
            >
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
