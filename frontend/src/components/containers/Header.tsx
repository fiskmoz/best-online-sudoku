import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Context from "../../context/state";
import { HeaderProps } from "../../interfaces";

export default function AppHeader(props: HeaderProps) {
  const context = useContext(Context);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <summary>
        {" "}
        <Navbar.Brand onClick={() => props.onHeaderClick("home")} href="">
          Sudoku online
        </Navbar.Brand>
      </summary>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            onClick={() => props.onHeaderClick("normal")}
            href="#normal"
          >
            Normal
          </Nav.Link>
          {!!context.isAuthenticted ? (
            <Nav.Link
              onClick={() => props.onHeaderClick("ranked")}
              href="#ranked"
            >
              Play ranked
            </Nav.Link>
          ) : (
            ""
          )}
          <Nav.Link
            onClick={() => props.onHeaderClick("scoreboard")}
            href="#features"
          >
            Scoreboards
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="#profile">Profile</Nav.Link>
          {!!context.isAuthenticted ? (
            <Nav.Link
              onClick={() => props.onHeaderClick("logout")}
              eventKey={2}
              href="#logout"
            >
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link
              onClick={() => props.onHeaderClick("login")}
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
