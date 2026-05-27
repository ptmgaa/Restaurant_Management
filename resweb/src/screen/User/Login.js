import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
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
  const { dispatch } = useContext(MyUserContext);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      let res = await Apis.post(endpoints["login"], { ...user });
      cookies.save("token", res.data.token);

      let p = await authApis().get(endpoints["profile"]);
      cookies.save("user", p.data);

      dispatch({ type: "LOGIN", payload: p.data });
      nav("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 403) {
        setMsg("Tài khoản đang chờ Admin phê duyệt.");
      } else {
        setMsg("Sai thông tin đăng nhập!");
      }
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-5">
      <h2 className="text-center">Đăng nhập</h2>
      {msg && <Alert variant="danger">{msg}</Alert>}
      <Form onSubmit={login}>
        {userInfo.map((u) => (
          <Form.Group key={u.field} className="mb-3" controlId={u.field}>
            <Form.Label>{u.label}</Form.Label>
            <Form.Control
              type={u.type}
              placeholder={u.label}
              value={user[u.field] || ""}
              onChange={(e) => setUser({ ...user, [u.field]: e.target.value })}
              required
            />
          </Form.Group>
        ))}
        <div className="d-grid mt-3 mb-3">
          <Button type="submit" variant="primary">Đăng nhập</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
