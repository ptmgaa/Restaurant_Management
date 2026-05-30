import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, InputGroup, Collapse, Pagination } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis"; 
import MySpinner from "../../components/MySpinner";

const Home = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();  
  const [dishes, setDishes] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [searchKey, setSearchKey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [chefId, setChefId] = useState(""); 
  const [prepTime, setPrepTime] = useState(""); 
  const [sort, setSort] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);        
        const resCat = await Apis.get(endpoints["categories"] || "/api/categories");
        setCategories(resCat.data);        
        const kw = searchParams.get("kw") || "";
        const catId = searchParams.get("cateId") || ""; 
        const fPrice = searchParams.get("fromPrice") || "";
        const tPrice = searchParams.get("toPrice") || "";
        const chef = searchParams.get("chefId") || "";
        const time = searchParams.get("prepTime") || "";
        const sortVal = searchParams.get("sort") || "";
        const pageVal = parseInt(searchParams.get("page") || "1", 10);
        
        setSearchKey(kw);
        setSelectedCategory(catId);
        setFromPrice(fPrice);
        setToPrice(tPrice);
        setChefId(chef);
        setPrepTime(time);
        setSort(sortVal);
        setCurrentPage(pageVal);
        
        const searchQueryParams = {};
        if (kw.trim() !== "") searchQueryParams.kw = kw; 
        if (catId.trim() !== "") searchQueryParams.cateId = catId; 
        if (fPrice.trim() !== "") searchQueryParams.fromPrice = fPrice;
        if (tPrice.trim() !== "") searchQueryParams.toPrice = tPrice;
        if (chef.trim() !== "") searchQueryParams.chefId = chef;
        if (time.trim() !== "") searchQueryParams.prepTime = time;
        if (sortVal.trim() !== "") searchQueryParams.sort = sortVal;
        
        searchQueryParams.page = pageVal.toString();
        const resDishes = await Apis.get(endpoints["dishes"] || "/api/dishes", {
          params: searchQueryParams
        });
        
        setDishes(resDishes.data);
      } catch (ex) {
        console.error("Lỗi lấy dữ liệu món ăn:", ex);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]); 

  const buildQueryAndNavigate = (updatedPage = 1) => {
    let query = `?kw=${encodeURIComponent(searchKey)}&cateId=${selectedCategory}&page=${updatedPage}`;
    if (fromPrice) query += `&fromPrice=${fromPrice}`;
    if (toPrice) query += `&toPrice=${toPrice}`;
    if (chefId) query += `&chefId=${chefId}`;
    if (prepTime) query += `&prepTime=${prepTime}`;
    if (sort) query += `&sort=${sort}`;
    
    nav(`/${query}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    buildQueryAndNavigate(1); 
  };

  const handlePageChange = (pageNumber) => {
    buildQueryAndNavigate(pageNumber);
  };

  return (
    <div>
      <Container className="mt-4">
        <Row className="justify-content-center mb-4">
          <div style={{
            minHeight: "340px", width: "100%", position: "relative",
            backgroundImage: `url('https://noithatanthinhphat.vn/wp-content/uploads/2024/10/thiet-ke-nha-hang-phong-cach-co-dien-13.jpg')`, 
            backgroundSize: "cover", backgroundPosition: "center", borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.2)", padding: "20px 30px",
              backdropFilter: "blur(2px)", width: "92%", maxWidth: "700px", borderRadius: "12px"
            }}>
              <h1 className="text-center" style={{ fontSize: "2rem", fontWeight: "700", color: "#851414" }}>
                MyChi Restaurant
              </h1>
              
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup size="sm" className="mb-2">
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ maxWidth: "140px", fontSize: "0.85rem" }}
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
                    style={{ fontSize: "0.85rem" }}
                  />
                  
                  <Button type="submit" variant="danger" style={{ fontWeight: "600" }}>
                    Tìm kiếm
                  </Button>
                </InputGroup>

                <div className="text-end mb-2">
                  <Button variant="link" size="sm" className="text-decoration-none text-dark p-0" onClick={() => setOpenFilter(!openFilter)}>
                    {openFilter ? "✕ Đóng bộ lọc nâng cao" : "Bộ lọc"}
                  </Button>
                </div>

                <Collapse in={openFilter}>
                  <div className="p-3 bg-light rounded border mb-2" style={{ fontSize: "0.85rem" }}>
                    <Row className="g-2">
                      <Col xs={6} sm={3}>
                        <Form.Label className="mb-0 small fw-bold">Giá tối thiểu</Form.Label>
                        <Form.Control size="sm" type="number" placeholder="Từ (VNĐ)" value={fromPrice} onChange={(e) => setFromPrice(e.target.value)} />
                      </Col>
                      <Col xs={6} sm={3}>
                        <Form.Label className="mb-0 small fw-bold">Giá tối đa</Form.Label>
                        <Form.Control size="sm" type="number" placeholder="Đến (VNĐ)" value={toPrice} onChange={(e) => setToPrice(e.target.value)} />
                      </Col>
                      <Col xs={6} sm={3}>
                        <Form.Label className="mb-0 small fw-bold">ID Đầu bếp</Form.Label>
                        <Form.Control size="sm" type="number" placeholder="Mã đầu bếp" value={chefId} onChange={(e) => setChefId(e.target.value)} />
                      </Col>
                      <Col xs={6} sm={3}>
                        <Form.Label className="mb-0 small fw-bold">Thời gian nấu (Tối đa)</Form.Label>
                        <Form.Control size="sm" type="number" placeholder="Số phút" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
                      </Col>
                      <Col xs={12}>
                        <Form.Label className="mb-0 small fw-bold">Thứ tự sắp xếp</Form.Label>
                        <Form.Select size="sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                          <option value="">Mặc định (Mới nhất)</option>
                          <option value="price_asc">Giá: Thấp đến Cao</option>
                          <option value="price_desc">Giá: Cao đến Thấp</option>
                          <option value="name">Tên món: A - Z</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <div className="text-end mt-2">
                      <Button variant="secondary" size="sm" type="submit">Áp dụng bộ lọc</Button>
                    </div>
                  </div>
                </Collapse>
              </Form>
            </div>
          </div>
        </Row>
      </Container>

      <Container className="mb-4">
        {loading ? (
          <MySpinner />
        ) : dishes.length === 0 ? (
          <p className="text-center my-5 text-muted">Không tìm thấy món ăn nào phù hợp.</p>
        ) : (
          <>
            <Row xs={1} sm={2} md={4} className="g-4">
              {dishes.map((dish) => (
                <Col key={dish.id}>
                  <Card className="h-100 shadow-sm border-0" onClick={() => nav(`/dishes/${dish.id}`)} style={{ cursor: "pointer" }}>
                    <Card.Img variant="top" src={dish.imageUrl || "https://placehold.co/600x400?text=No+Image"} style={{ height: "160px", objectFit: "cover" }} />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#851414" }}>{dish.name}</Card.Title>
                      <Card.Text className="text-muted text-truncate mb-2" style={{ fontSize: "0.8rem" }}>{dish.description}</Card.Text>
                      {dish.prepTime && <Card.Text className="mb-1 text-secondary small">⏰ Chuẩn bị: {dish.prepTime} phút</Card.Text>}
                      <Card.Text className="mt-auto fw-bold text-danger">{dish.price?.toLocaleString("vi-VN")} VNĐ</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="d-flex justify-content-center mt-5">
              <Pagination size="sm">
                <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                <Pagination.Next disabled={dishes.length < 4} onClick={() => handlePageChange(currentPage + 1)} />
              </Pagination>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;