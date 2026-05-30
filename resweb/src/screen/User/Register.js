import React, { useState, useContext } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
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
    { field: "roleId", label: "Vai trò người dùng", type: "select" }
  ];

  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(MyUserContext);
  const nav = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setIsError(false);

    if (user.password !== user.confirmPassword) {
      setMsg("Mật khẩu không trùng khớp!");
      setIsError(true);
      return;
    }

    if (!avatar) {
      setMsg("Vui lòng tải lên một ảnh đại diện!");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName || "");
      formData.append("username", user.username || "");
      formData.append("password", user.password || "");
      formData.append("email", user.email || "");
      formData.append("phone", user.phone || "");
      formData.append("roleId", user.roleId || "3"); 
      formData.append("avatar", avatar);

      let res = await Apis.post(endpoints["users"], formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (String(user.roleId) === "2") {
        setMsg("Đăng ký thành công! Tài khoản Đầu bếp đang chờ xét duyệt.");
        setIsError(false);
        setUser({});
        setAvatar(null);
      } else {
        cookies.save("user", res.data);
        dispatch({ type: "LOGIN", payload: res.data });
        nav("/"); 
      }
    } catch (ex) {
      setIsError(true);
      if (ex.response && ex.response.data) {
        setMsg(typeof ex.response.data === 'string' ? ex.response.data : "Dữ liệu đăng ký không hợp lệ!");
      } else {
        setMsg("Lỗi kết nối máy chủ!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "550px" }} className="mt-4 mb-5">
      <Card className="shadow-sm p-4 border-0 rounded-3">
        <h2 className="text-center mb-4 fw-bold text-dark">ĐĂNG KÝ TÀI KHOẢN</h2>
        {msg && <Alert variant={isError ? "danger" : "success"} className="py-2 small">{msg}</Alert>}
        
        <Form onSubmit={register}>
          {userInfo.map((u) => (
            <Form.Group key={u.field} className="mb-2" controlId={u.field}>
              <Form.Label className="small mb-1 fw-bold text-secondary">{u.label}</Form.Label>
              {u.type === "select" ? (
                <Form.Select
                  value={user.roleId || ""}
                  onChange={(e) => setUser({ ...user, roleId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn vai trò hệ thống --</option>
                  <option value="3">Khách hàng</option>
                  <option value="2">Đầu bếp</option>
                </Form.Select>
              ) : (
                <Form.Control
                  type={u.type}
                  placeholder={`Nhập ${u.label.toLowerCase()}...`}
                  value={user[u.field] || ""}
                  onChange={(e) => setUser({ ...user, [u.field]: e.target.value })}
                  required
                />
              )}
            </Form.Group>
          ))}
          
          <Form.Group className="mb-3" controlId="avatar">
            <Form.Label className="small mb-1 fw-bold text-secondary">Ảnh đại diện</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])} 
              required={!isError}
            />
          </Form.Group>
          
          <div className="d-grid mt-4">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Đang xử lý đăng ký..." : "Đăng ký thành công"}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3 small">
          Đã có tài khoản hệ thống? <Link to="/login" className="text-decoration-none fw-bold">Đăng nhập</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;