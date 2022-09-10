import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Wallet from "../Wallet";

const Header = ({ amount, address, destroy }) => {
  return (
    <div>
      <Navbar bg="warning" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#" style={{ fontSize: "40px" }}>
            Market Arena
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScrollx
            >
              <Nav.Link>
                <Link style={{ textDecoration: "none" }} to="/">
                  Home
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link style={{ textDecoration: "none" }} to="/new">
                  New
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link style={{ textDecoration: "none" }} to="/traders">
                  Traders
                </Link>
              </Nav.Link>
            </Nav>
            <Wallet address={address} amount={amount} destroy={destroy} />
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
