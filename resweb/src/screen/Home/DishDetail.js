import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Card, Badge, Form, ListGroup, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import MySpinner from "../../components/MySpinner";

const DishDetail = () => {
  const { dishId } = useParams(); 
  const nav = useNavigate();
  const { user } = useContext(MyUserContext); // Lấy thông tin user đã đăng nhập
  
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]); // State lưu danh sách đánh giá
  const [loading, setLoading] = useState(true);
  
  // State phục vụ Form thêm đánh giá
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  // Hàm tải dữ liệu chi tiết món và bình luận song song
  const loadData = async () => {
    try {
      setLoading(true);
      const [resDish, resReviews] = await Promise.all([
        Apis.get(endpoints["dish-details"](dishId)),
        Apis.get(endpoints["dish-reviews"](dishId)) // API lấy danh sách review công khai
      ]);
      setDish(resDish.data);
      setReviews(resReviews.data || []);
    } catch (ex) {
      console.error("Lỗi lấy dữ liệu món ăn hoặc đánh giá:", ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dishId]);

  // Xử lý gửi đánh giá mới lên hệ thống
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSending(true);
      // Cấu trúc payload gửi đi tương thích với Object POJO Review ở Spring Boot
      const reviewPayload = {
        rating: parseInt(rating, 10),
        content: content.trim(),
        userId: { id: user.id } // Map khóa ngoại user nếu cấu trúc entity yêu cầu dạng lồng Object
      };

      const res = await authApis().post(endpoints["add-review"](dishId), reviewPayload, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Cảm ơn bạn đã để lại đánh giá thực tế!");
      setContent("");
      setRating(5);
      
      // Cập nhật ngầm danh sách bình luận mới lên màn hình lập tức
      setReviews(current => [res.data, ...current]);
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Không thể gửi đánh giá, vui lòng kiểm tra lại quyền truy cập.");
    } finally {
      setSending(false);
    }
  };

  const handleOrder = () => {
    alert(`Đã thêm món [${dish?.name}] vào giỏ hàng thành công!`);
  };

  if (loading) return <MySpinner />;

  if (!dish) {
    return (
      <Container className="text-center my-5">
        <h3 className="text-danger">Món ăn không tồn tại hoặc đã bị xóa khỏi hệ thống!</h3>
        <Button variant="primary" className="mt-3" onClick={() => nav("/")}>
          Quản lý Thực đơn nhà hàng
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ fontFamily: "'Playfair Display', serif" }}>
      <Button variant="outline-secondary" className="mb-4" onClick={() => nav("/")} style={{ borderRadius: "8px" }}>
        ← Quay lại thực đơn
      </Button>

      <Row className="g-5 align-items-center mb-5">
        <Col lg={6} md={12}>
          <div style={{ overflow: "hidden", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}>
            <img 
              src={dish.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
              alt={dish.name}
              style={{ width: "100%", height: "450px", objectFit: "cover", transition: "transform 0.3s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
            />
          </div>
        </Col>

        <Col lg={6} md={12} className="text-start">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge bg="warning" text="dark" style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
              ⭐ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "5.0"} ({reviews.length} đánh giá)
            </Badge>
            <Badge bg="success" style={{ fontSize: "0.9rem", padding: "6px 12px" }}>Còn hàng</Badge>
          </div>

          <h1 style={{ fontSize: "3rem", fontWeight: "700", color: "#110687", marginBottom: "15px" }}>{dish.name}</h1>
          <h2 style={{ color: "#dc3545", fontWeight: "bold", fontSize: "2rem", marginBottom: "25px" }}>
            {dish.price ? dish.price.toLocaleString("vi-VN") : "0"} VNĐ
          </h2>
          
          <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-2 border mb-3">
            <strong>Thời gian chuẩn bị:</strong> {dish.prepTime ? `${dish.prepTime} phút` : "Đang cập nhật"}
          </div>

          <Card className="border-0 bg-light p-4 mb-4" style={{ borderRadius: "12px" }}>
            <h5 className="text-dark fw-bold mb-2">Mô tả món ăn:</h5>
            <p className="text-muted" style={{ fontSize: "1.05rem", lineHeight: "1.6", fontFamily: "sans-serif" }}>
              {dish.description || "Món ăn tinh hoa được chế biến từ những nguyên liệu tươi ngon nhất."}
            </p>
          </Card>

          <Row className="g-3">
            <Col sm={8} xs={12}>
              <Button variant="success" size="lg" className="w-100 py-3 fw-bold shadow-sm" style={{ borderRadius: "10px" }} onClick={handleOrder}>
                Đặt mua món này ngay
              </Button>
            </Col>
            <Col sm={4} xs={12}>
              <Button variant="outline-danger" size="lg" className="w-100 py-3 fw-bold" style={{ borderRadius: "10px" }} onClick={() => alert("Đã thêm vào danh sách yêu thích!")}>
                ❤️ Yêu thích
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <hr className="my-5" />

      <Row style={{ fontFamily: "sans-serif" }}>
        <Col md={5} className="mb-4">
          <h4 className="fw-bold text-dark mb-3">Gửi đánh giá của bạn</h4>
          {user ? (
            <Form onSubmit={handleReviewSubmit} className="p-4 bg-white border rounded-3 shadow-sm">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Mức độ hài lòng</Form.Label>
                <Form.Select value={rating} onChange={e => setRating(e.target.value)}>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Sao - Xuất sắc</option>
                  <option value="4">⭐⭐⭐⭐ 4 Sao - Rất ngon</option>
                  <option value="3">⭐⭐⭐ 3 Sao - Tạm ổn</option>
                  <option value="2">⭐⭐ 2 Sao - Chưa tốt</option>
                  <option value="1">⭐ 1 Sao - Tệ</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Nội dung đánh giá</Form.Label>
                <Form.Control 
                  as="textarea" rows={4} required
                  placeholder="Hãy chia sẻ cảm nhận thực tế của bạn về hương vị, cách đóng gói..."
                  value={content} onChange={e => setContent(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={sending}>
                {sending ? "Đang gửi bình luận..." : "Gửi bình luận công khai"}
              </Button>
            </Form>
          ) : (
            <Alert variant="info" className="text-center py-4 rounded-3">
              <h5>Bạn muốn để lại bình luận?</h5>
              <p className="small text-muted">Vui lòng đăng nhập hệ thống để thực hiện đánh giá món ăn.</p>
              <Link to="/login" className="btn btn-primary btn-sm fw-bold px-4">Đăng nhập ngay</Link>
            </Alert>
          )}
        </Col>

        <Col md={7}>
          <h4 className="fw-bold text-dark mb-3">Phản hồi từ thực khách ({reviews.length})</h4>
          {reviews.length === 0 ? (
            <div className="text-center text-muted p-5 bg-light rounded-3 border border-dashed">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm!
            </div>
          ) : (
            <ListGroup variant="flush" className="border rounded-3 overflow-hidden shadow-sm">
              {reviews.map((r) => (
                <ListGroup.Item key={r.id} className="p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold text-dark m-0">{r.userId?.username || "Thực khách ẩn danh"}</h6>
                      <small className="text-warning fw-bold">{"⭐".repeat(r.rating)}</small>
                    </div>
                    <span className="text-muted small">
                      {r.createdDate ? new Date(r.createdDate).toLocaleDateString("vi-VN") : "Vừa xong"}
                    </span>
                  </div>
                  <p className="text-secondary m-0 small" style={{ lineHeight: "1.5" }}>{r.content}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DishDetail;