import { useState, useEffect } from "react";
import { Table, Button, Alert, Card, Spinner } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const ChefApproval = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchChefs = async () => {
    try {
      setLoading(true);
      let res = await authApis().get(endpoints["getChefs"]);
      setChefs(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đầu bếp:", err);
      setErrorMsg("Không thể tải danh sách đầu bếp từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn phê duyệt tài khoản đầu bếp này không?")) {
      try {
        let res = await authApis().post(endpoints["approve-chef"](id));
        alert(res.data); 
        
        setChefs(chefs.filter(c => c.id !== id));
      } catch (err) {
        console.error(err);
        alert("Phê duyệt thất bại hoặc lỗi hệ thống!");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" /> <p className="mt-2">Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-3 p-4">
      <h3 className="mb-4 text-dark fw-bold">👨‍🍳 Phê duyệt tài khoản Đầu bếp</h3>
      
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      
      {chefs.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          Hiện tại không có tài khoản đầu bếp nào đang chờ phê duyệt.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "8%" }}>ID</th>
              <th>Họ và tên</th>
              <th>Tên đăng nhập</th>
              <th>Email / SĐT</th>
              <th style={{ width: "15%" }} className="text-center">Trạng thái</th>
              <th style={{ width: "15%" }} className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td><strong className="text-secondary">{c.fullName || "Chưa cập nhật"}</strong></td>
                <td>{c.username}</td>
                <td>
                  <small className="d-block text-muted">{c.email}</small>
                  <small className="d-block text-muted">{c.phone}</small>
                </td>
                <td className="text-center">
                  <span className="badge bg-warning text-dark px-2 py-1">Chờ duyệt</span>
                </td>
                <td className="text-center">
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="shadow-sm fw-bold"
                    onClick={() => handleApprove(c.id)}
                  >
                    Phê duyệt
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default ChefApproval;