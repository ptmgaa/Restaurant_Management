import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, InputGroup, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis"; 

const Home = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [dishes, setDishes] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [searchKey, setSearchKey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let resCat = await Apis.get(endpoints["categories"] || "/api/categories/");
        setCategories(resCat.data);
        
        let kw = searchParams.get("kw") || "";
        let catId = searchParams.get("categoryId") || "";
        let resDishes = await Apis.get(`${endpoints["dishes"] || "/api/dishes/"}?kw=${kw}&categoryId=${catId}`);
        setDishes(resDishes.data);
      } catch (ex) {
        console.error("Lỗi lấy dữ liệu món ăn:", ex);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    nav(`/?kw=${searchKey}&categoryId=${selectedCategory}`);
  };

  const addToMenu = (e, dishName) => {
    e.stopPropagation(); 
    alert(`Đã thêm món [${dishName}] vào thực đơn!`);
  };

  return (
    <div>
      <Container className="mt-4">
        <Row className="justify-content-center mb-5">
          <div 
            style={{
              height: "300px",
              width: "150vw",
              position: "relative",
              backgroundImage: `url('https://noithatanthinhphat.vn/wp-content/uploads/2024/10/thiet-ke-nha-hang-phong-cach-co-dien-13.jpg')`, // Nền nhà hàng cổ điển sang trọng của bạn
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              fontFamily: "'Playfair Display', serif"
            }}
          >
            <div style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.25)", 
              padding: "30px 25px",
              backdropFilter: "blur(1px)",
              textAlign: "center", 
              maxWidth: "100%",
              borderRadius: "12px"
            }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: "700", color: "#110687", margin: 0 }}>
                MyChi Restaurant
              </h1>
              <p style={{ fontSize: "1rem", color: "#110687", margin: "10px auto 15px auto", fontWeight: "500" }}>
                Hệ thống quản lý đặt món trực tuyến nâng tầm trải nghiệm tinh hoa ẩm thực đẳng cấp.
              </p>

              <Form onSubmit={handleSearch}>
                <InputGroup size="sm">
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ maxWidth: "130px", fontSize: "0.9rem", borderRadius: "8px 0 0 8px" }}
                  >
                    <option value="">Tất cả loại</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="text"
                    placeholder="Tìm tên món ăn..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    style={{ fontSize: "0.9rem" }}
                  />
                  <Button type="submit" variant="success" style={{ borderRadius: "0 8px 8px 0", fontWeight: "600" }}>
                    Tìm kiếm
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="text-center mb-4 text-dark" style={{ fontWeight: "bold", fontFamily: "'Playfair Display', serif" }}>
          Danh Mục Món Ăn Đặc Sắc
        </h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted">Đang tải món ăn từ hệ thống...</p>
          </div>
        ) : dishes.length === 0 ? (
          <p className="text-center my-5" style={{ color: "#d89f2c", fontSize: "1.1rem" }}>
            Không tìm thấy món ăn nào phù hợp từ hệ thống.
          </p>
        ) : (
          <Row xs={1} sm={2} md={4} className="g-4">
            {dishes.map((dish) => (
              <Col key={dish.id}>
                <Card 
                  className="h-100 shadow border-0"
                  style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s" }}
                  onClick={() => nav(`/dishes/${dish.id}`)} 
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                >
                  <div style={{ position: "relative", height: "180px" }}>
                    <Card.Img 
                      variant="top" 
                      src={dish.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                    <span 
                      style={{
                        position: "absolute", top: "10px", right: "10px",
                        backgroundColor: "rgba(255,193,7,0.95)", color: "#000",
                        padding: "3px 9px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold"
                      }}
                    >
                      ⭐ 4.8
                    </span>
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ fontSize: "1rem", fontWeight: "bold", color: "#b8931d" }} className="mb-1">
                      {dish.name}
                    </Card.Title>
                    <Card.Text className="text-muted text-truncate mb-2" style={{ fontSize: "0.85rem" }}>
                      {dish.description || "Chưa có mô tả chi tiết cho món ăn này."}
                    </Card.Text>
                    <Card.Text style={{ color: "#dc3545", fontWeight: "bold", fontSize: "1.05rem" }} className="mb-3">
                      {dish.price ? dish.price.toLocaleString("vi-VN") : "0"} VNĐ
                    </Card.Text>
                    
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="mt-auto w-100"
                      style={{ borderRadius: "8px", fontWeight: "500" }}
                      onClick={(e) => addToMenu(e, dish.name)}
                    >
                      ＋ Thêm vào thực đơn
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;