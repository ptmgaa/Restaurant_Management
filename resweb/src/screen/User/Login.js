import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import cookies from "react-cookies";
import { MyUserContext } from "../../configs/Contexts";

const Login = () => {
  const userInfo = [
    { field: "username", label: "Tên đăng nhập", type: "text" },
    { field: "password", label: "Mật khẩu", type: "password" }
  ];

  const [user, setUser] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(MyUserContext);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      let res = await Apis.post(endpoints["login"], { ...user });
      cookies.save("token", res.data.token);
      let p = await authApis().get(endpoints["profile"]);
      cookies.save("user", p.data);
      dispatch({ type: "LOGIN", payload: p.data });      
      const roleId = p.data.roleId?.id ? String(p.data.roleId.id) : String(p.data.roleId);      
      if (roleId === "1") {
        nav("/admin");
      } else {
        nav("/");
      }
    } catch (ex) {
      console.error(ex);
      if (ex.response && ex.response.status === 403) {
        setMsg("Tài khoản đang chờ Admin phê duyệt.");
      } else if (ex.response && ex.response.status === 401) {
        setMsg("Sai tên đăng nhập hoặc mật khẩu!");
      } else {
        setMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "450px" }} className="mt-5">
      <Card className="shadow-sm p-4 border-0 rounded-3">
        <h2 className="text-center mb-4 fw-bold text-dark">ĐĂNG NHẬP</h2>
        {msg && <Alert variant="danger" className="py-2 small">{msg}</Alert>}
        
        <Form onSubmit={login}>
          {userInfo.map((u) => (
            <Form.Group key={u.field} className="mb-3" controlId={u.field}>
              <Form.Label className="small fw-bold text-secondary">{u.label}</Form.Label>
              <Form.Control
                type={u.type}
                placeholder={`Nhập ${u.label.toLowerCase()}...`}
                value={user[u.field] || ""}
                onChange={(e) => setUser({ ...user, [u.field]: e.target.value })}
                required
              />
            </Form.Group>
          ))}
          
          <div className="d-grid mt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </Button>
          </div>
        </Form>
        
        <div className="text-center mt-3 small">
          Chưa có tài khoản? <Link to="/register" className="text-decoration-none fw-bold">Đăng ký ngay</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;