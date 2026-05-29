import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../configs/Contexts";

const Header = () => {
  const { user, dispatch } = useContext(MyUserContext);
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🍴MyChi Restaurant</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            {user ? (
              <>
                <Image
                  src={user.avatar || "https://via.placeholder.com/30"}
                  roundedCircle
                  width="30"
                  height="30"
                  className="me-2"
                />
                <span className="text-light me-3">Chào {user.username}!</span>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
