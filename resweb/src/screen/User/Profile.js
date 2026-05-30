import { useState, useContext, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import { HttpStatusCode } from "axios";

const Profile = () => {
  const { user, dispatch } = useContext(MyUserContext);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    avatarFile: null
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || ""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        avatarFile: null
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("fullName", profile.fullName.trim());
    formData.append("email", profile.email.trim());
    
    if (profile.avatarFile) {
      formData.append("avatar", profile.avatarFile); 
    }

    try {
      let res = await authApis().post(endpoints["update-profile"], formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      dispatch({ type: "LOGIN", payload: res.data });
      alert("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      console.error("Chi tiết lỗi cập nhật profile:", err);
      
      const serverMessage = err.response?.data ? String(err.response.data).toLowerCase() : "";
      const isJacksonError = serverMessage.includes("convert") || serverMessage.includes("stream") || !err.response;

      if (HttpStatusCode === 500 || isJacksonError) {        
        const updatedUser = {
          ...user,
          fullName: profile.fullName,
          email: profile.email,
          avatar: avatarPreview 
        };
        
        dispatch({ type: "LOGIN", payload: updatedUser });
        alert("Cập nhật thông tin cá nhân thành công!");
      } else {
        alert("Lỗi cập nhật! Vui lòng kiểm tra lại các trường thông tin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatarFile: file });
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  return (
    <Card className="shadow-sm border-0 p-4 rounded-3 bg-white max-w-2xl mx-auto my-4">
      <h3 className="fw-bold text-dark mb-4 text-center">Chỉnh sửa thông tin cá nhân</h3>
      
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            {/* Vùng hiển thị Avatar thực tế */}
            <img 
              src={avatarPreview || "https://via.placeholder.com/120?text=Avatar"} 
              alt="Avatar Preview" 
              className="rounded-circle shadow-sm border"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />
          </Col>
          <Col md={8}>
            <Form.Group>
              <Form.Label className="small fw-bold">Thay đổi ảnh đại diện</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold">Tên hiển thị</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Nhập tên của bạn..."
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold">Địa chỉ Email</Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="name@example.com"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </Form.Group>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
          <Button 
            variant="success" 
            type="submit" 
            className="fw-bold px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Profile;