import React, { useState, useEffect } from "react";
import { Table, Card, Alert, Container } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import API from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadAllReviews = async () => {
    try {
      setLoading(true);
      let res = await API.get(endpoints["reviews"]); 
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể kết nối máy chủ để lấy thông tin phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllReviews();
  }, []);

  if (loading) return <MySpinner />;

  return (
    <Container className="my-4">
      <Card className="shadow-sm border-0 p-4 rounded-3 bg-white">
        <div className="mb-4">
          <h3 className="fw-bold text-dark m-0">Quản lý Đánh giá từ Khách hàng</h3>
          <p className="text-muted small m-0">Duyệt và xử lý các phản hồi, bình luận vi phạm tiêu chuẩn</p>
        </div>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Table striped bordered hover responsive className="align-middle text-start small">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "8%" }} className="text-center">ID</th>
              <th style={{ width: "15%" }}>Khách hàng</th>
              <th style={{ width: "15%" }}>Món ăn</th>
              <th style={{ width: "12%" }} className="text-center">Điểm số</th>
              <th>Nội dung bình luận</th>
              <th style={{ width: "12%" }} className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">Hệ thống chưa nhận được đánh giá nào.</td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td className="text-center fw-bold text-secondary">#{r.id}</td>
                  <td>
                    <strong>{r.userId?.username || "Ẩn danh"}</strong>
                    <span className="d-block text-muted style-small">{r.userId?.email || ""}</span>
                  </td>
                  <td className="text-primary fw-bold">{r.dishId?.name || `Món số #${r.dishId}`}</td>
                  <td className="text-center text-warning fw-bold" style={{ fontSize: "1.1rem" }}>
                    {"⭐".repeat(r.rating)}
                  </td>
                  <td>
                    <p className="m-0 text-dark" style={{ whiteSpace: "pre-line" }}>{r.content}</p>
                    <small className="text-muted d-block mt-1">Ngày đăng: {new Date(r.createdDate).toLocaleString("vi-VN")}</small>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Reviews;