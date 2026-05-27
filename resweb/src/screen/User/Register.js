import React, { useState, useContext } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import cookies from "react-cookies";
import { MyUserContext } from "../../configs/Contexts";

const Register = () => {
  const userInfo = [
    { field: "fullName", label: "Họ và tên", type: "text" },
    { field: "username", label: "Tên đăng nhập", type: "text" },
    { field: "password", label: "Mật khẩu", type: "password" },
    { field: "confirmPassword", label: "Xác nhận mật khẩu", type: "password" },
    { field: "email", label: "Email", type: "email" },
    { field: "phone", label: "Số điện thoại", type: "text" },
    { field: "roleId", label: "Vai trò", type: "select" }
  ];

  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState("");
  const { dispatch } = useContext(MyUserContext);
  const [isError, setIsError] = useState(false);
  const nav = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setIsError(false);

    if (user.password !== user.confirmPassword) {
      setMsg("Mật khẩu và xác nhận mật khẩu không khớp!");
      setIsError(true);
      return;
    }

    if (!avatar) {
      setMsg("Vui lòng chọn ảnh đại diện để hoàn tất đăng ký!");
      setIsError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      formData.append("password", user.password);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("roleId", user.roleId);
      formData.append("avatar", avatar);

      let res = await Apis.post(endpoints["users"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      cookies.save("user", res.data);
      dispatch({ type: "LOGIN", payload: res.data });

      if (user.roleId === "2") {
        setMsg("Đăng ký thành công! Tài khoản CHEF đang chờ Admin phê duyệt.");
      setIsError(false);
      } else {
        nav("/"); 
      }
    } catch (ex) {
      setIsError(true);
      if (ex.response && ex.response.data) {
        const backendError = typeof ex.response.data === 'string' 
          ? ex.response.data 
          : (ex.response.data.message || "Đăng ký thất bại!");
        setMsg(backendError);
      } else {
        setMsg("Không thể kết nối đến máy chủ hoặc lỗi CORS hệ thống!");
      }
    }
  };

  return (
    <Container style={{ maxWidth: "500px" }} className="mt-5 mb-5">
      <h2 className="text-center">ĐĂNG KÝ</h2>
      {msg && <Alert variant={isError ? "danger" : "success"}>{msg}</Alert>}
      <Form onSubmit={register}>
        {userInfo.map((u) => (
          <Form.Group key={u.field} className="mb-3" controlId={u.field}>
            <Form.Label>{u.label}</Form.Label>
            {u.type === "select" ? (
              <Form.Select
                value={user.roleId || ""}
                onChange={(e) => setUser({ ...user, roleId: e.target.value })}
                required
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="3">Khách hàng</option>
                <option value="2">Đầu bếp</option>
              </Form.Select>
            ) : (
              <Form.Control
                type={u.type}
                placeholder={u.label}
                value={user[u.field] || ""}
                onChange={(e) => setUser({ ...user, [u.field]: e.target.value })}
                required
              />
            )}
          </Form.Group>
        ))}
        <Form.Group className="mb-3" controlId="avatar">
          <Form.Label>Ảnh đại diện</Form.Label>
          <Form.Control type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        </Form.Group>
        <div className="d-grid mt-3 mb-5">
          <Button type="submit" variant="success">Đăng ký</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
