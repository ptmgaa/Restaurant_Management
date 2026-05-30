import { Nav, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyUserContext } from "../configs/Contexts";

const Sidebar = () => {
  const { user, dispatch } = useContext(MyUserContext);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column p-3 sticky-top" style={{ height: "100vh", top: 0 }}>
      <Link to="/admin" className="text-decoration-none text-light fs-4 fw-bold mb-4 border-bottom pb-2">
        ⚙️ Admin Panel
      </Link>

      <div className="d-flex align-items-center mb-4 p-2 bg-secondary bg-opacity-25 rounded">
        <Image
          src={user?.avatar || "https://via.placeholder.com/40"}
          roundedCircle
          width="40"
          height="40"
          className="me-2"
        />
        <div className="text-truncate">
          <small className="d-block text-info">Hệ thống</small>
          <strong>{user?.username}</strong>
        </div>
      </div>

      <Nav className="flex-column flex-grow-1 w-100">
        <Nav.Link as={Link} to="/admin" className="text-light py-2 px-3 rounded mb-1">
          Tổng quan doanh thu
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/verify-chef" className="text-light py-2 px-3 rounded mb-1">
          Duyệt tài khoản Chef
        </Nav.Link>
      </Nav>

      <div className="border-top pt-3 mt-2">
        <Button variant="danger" className="w-100 btn-sm" onClick={logout}>
          Đăng xuất Admin
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;