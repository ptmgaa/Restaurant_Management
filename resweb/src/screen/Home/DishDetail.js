import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Card, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";

const DishDetail = () => {
  const { dishId } = useParams(); 
  const nav = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishDetail = async () => {
      try {
        setLoading(true);
        let res = await Apis.get(endpoints["dish-details"](dishId));
        setDish(res.data);
      } catch (ex) {
        console.error("Lỗi lấy chi tiết món ăn:", ex);
      } finally {
        setLoading(false);
      }
    };
    loadDishDetail();
  }, [dishId]);

  const handleOrder = () => {
    alert(`Đã thêm món [${dish?.name}] vào giỏ hàng thành công!`);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" size="lg" />
        <p className="mt-3 text-muted">Đang tải thông tin chi tiết món ăn...</p>
      </Container>
    );
  }

  if (!dish) {
    return (
      <Container className="text-center my-5">
        <h3 className="text-danger">Món ăn không tồn tại hoặc đã bị xóa khỏi hệ thống!</h3>
        <Button variant="primary" className="mt-3" onClick={() => nav("/")}>
          Quay lại Trang Chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ fontFamily: "'Playfair Display', serif" }}>
      <Button variant="outline-secondary" className="mb-4" onClick={() => nav("/")} style={{ borderRadius: "8px" }}>
        ← Quay lại thực đơn
      </Button>

      <Row className="g-5 align-items-center">
        <Col lg={6} md={12}>
          <div style={{ overflow: "hidden", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}>
            <img 
              src={dish.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
              alt={dish.name}
              style={{
                width: "100%",
                height: "450px",
                objectFit: "cover",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
            />
          </div>
        </Col>

        <Col lg={6} md={12} className="text-start">
            <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="warning" text="dark" style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
                ⭐ 4.9 (Đánh giá cao)
                </Badge>
                <Badge bg="success" style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
                Còn hàng
                </Badge>
            </div>

            <h1 style={{ fontSize: "3rem", fontWeight: "700", color: "#110687", marginBottom: "15px" }}>
                {dish.name}
            </h1>

            <h2 style={{ color: "#dc3545", fontWeight: "bold", fontSize: "2rem", marginBottom: "25px" }}>
                {dish.price ? dish.price.toLocaleString("vi-VN") : "0"} VNĐ
            </h2>
            <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-2 border">
                <strong>Thời gian chuẩn bị:</strong> { dish.prepTime  ? `${dish.prepTime} phút` : "Đang cập nhật" }            
            </div>

            <Card className="border-0 bg-light p-4 mb-4" style={{ borderRadius: "12px" }}>
                <h5 className="text-dark fw-bold mb-2">Mô tả món ăn:</h5>
                <p className="text-muted" style={{ fontSize: "1.05rem", lineHeight: "1.6", fontFamily: "sans-serif" }}>
                {dish.description || "Món ăn tinh hoa được chế biến từ những nguyên liệu tươi ngon nhất trong ngày bởi bếp trưởng của MyChi Restaurant, mang đến hương vị đẳng cấp khó quên."}
                </p>
            </Card>

            <Row className="g-3">
                <Col sm={8} xs={12}>
                <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100 py-3 fw-bold shadow-sm" 
                    style={{ borderRadius: "10px" }}
                    onClick={handleOrder}
                >
                    Đặt mua món này ngay
                </Button>
                </Col>
                <Col sm={4} xs={12}>
                <Button 
                    variant="outline-danger" 
                    size="lg" 
                    className="w-100 py-3 fw-bold" 
                    style={{ borderRadius: "10px" }}
                    onClick={() => alert("Đã thêm món ăn vào danh sách yêu thích!")}
                >
                    ♥ Yêu thích
                </Button>
                </Col>
            </Row>
            </Col>
        </Row>
    </Container>
  );
};

export default DishDetail;