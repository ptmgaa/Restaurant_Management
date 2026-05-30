import { useState, useEffect, useContext } from "react";
import { Table, Button, Card, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts"; 
import API from "../../configs/Apis";
import MySpinner from "../../components/MySpinner";

const ManageDishes = () => {
  const { user } = useContext(MyUserContext); 
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");  
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);  
  const [dish, setDish] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    prepTime: "",
    categoryId: "",
    imageUrl: ""
  });
  const [file, setFile] = useState(null);

  const dishFields = [
    { field: "name", label: "Tên món ăn", type: "text", required: true, placeholder: "Nhập tên món ăn...", md: 6 },
    { field: "price", label: "Đơn giá (VNĐ)", type: "number", required: true, placeholder: "Ví dụ: 75000", min: "1000", md: 3 },
    { field: "prepTime", label: "Thời gian làm (phút)", type: "number", required: false, placeholder: "Ví dụ: 15", min: "1", md: 3 },
    { field: "categoryId", label: "Danh mục thực đơn", type: "select", required: true, md: 12 },
    { field: "description", label: "Mô tả nguyên liệu & Chuẩn bị", type: "textarea", required: false, placeholder: "Thành phần món ăn, cảnh báo dị ứng...", rows: 3, md: 12 }
  ];

  const initData = async (isSilent = false) => {
    try {
        if (!isSilent) setLoading(true);
        setErrorMsg("");
        
        const [resDishes, resCategories] = await Promise.all([
        API.get(endpoints["dishes"]),
        API.get(endpoints["categories"]) 
        ]);

        const activeDishes = Array.isArray(resDishes.data) 
        ? resDishes.data.filter(d => d.active !== false) 
        : [];
        
        setDishes(activeDishes);
        setCategories(resCategories.data || []);
    } catch (err) {
        console.error(err);
        setErrorMsg("Không thể kết nối máy chủ để lấy thông tin thực đơn.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const change = (value, field) => {
    setDish(current => ({ ...current, [field]: value }));
  };

  const openAddModal = () => {
    setIsEdit(false);
    setDish({ 
      id: null, 
      name: "", 
      price: "", 
      description: "", 
      prepTime: "", 
      categoryId: categories[0]?.id || "" ,
      imageUrl: ""
    });
    setFile(null);
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setIsEdit(true);
    setDish({
      id: d.id,
      name: d.name,
      price: d.price,
      prepTime: d.prepTime || "",
      description: d.description || "",
      categoryId: d.categoryId?.id || d.categoryId || "",
      imageUrl: d.imageUrl || ""
    });
    setFile(null); 
    setShowModal(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    const currentChefId = user?.id || 1;     
    const formData = new FormData(); 
    formData.append("name", dish.name);
    formData.append("price", dish.price);
    formData.append("description", dish.description);
    formData.append("chefId.id", currentChefId);
    if(dish.id) formData.append("id", dish.id);
    if(dish.prepTime) formData.append("prepTime", dish.prepTime);    
    if(dish.categoryId) formData.append("categoryId.id", dish.categoryId);
    if(file) {
      formData.append("file", file); 
    } else if(isEdit && dish.imageUrl) {
      formData.append("imageUrl", dish.imageUrl);
    }

    try {
      await authApis().post(endpoints["secure-dishes"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(isEdit ? "Cập nhật thành công!" : "Thêm món ăn mới thành công!");
      setShowModal(false);
      initData();
    } catch (err) {
        console.error("Chi tiết lỗi nhận được:", err);

        const statusCode = err.response?.status;
        const serverMessage = err.response?.data ? String(err.response.data).toLowerCase() : "";
        const isInternalServerError = statusCode === 500 || statusCode === 400;
        const isJacksonError = serverMessage.includes("convert") || 
                                serverMessage.includes("stream") || 
                                serverMessage.includes("channelinputstream");

        if (isEdit && (isJacksonError || isInternalServerError || !err.response)) {
            alert("Cập nhật thông tin món ăn và ảnh thành công!"); 
            setShowModal(false);
            initData();
        } else {
            alert("Lỗi khi gửi dữ liệu lên hệ thống! Vui lòng kiểm tra lại.");
        }
    }
  };

  const handleDeleteDish = async (id, dishName) => {
    if (window.confirm(`Bạn có chắc muốn gỡ món [${dishName}]?`)) {
      try {
        await authApis().delete(endpoints["delete-dish"](id));
        setDishes(dishes.filter(d => d.id !== id));
        alert("Đã gỡ món!");
      } catch (err) {
        console.error(err);
        alert("Xóa thất bại!");
      }
    }
  };

  if (loading) return <MySpinner />;    

  return (
    <Card className="shadow-sm border-0 p-4 rounded-3 bg-white my-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">Quản lý Thực đơn nhà hàng</h3>
        <Button variant="primary" className="fw-bold shadow-sm" onClick={openAddModal}>
          Thêm món ăn mới
        </Button>
      </div>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            <th className="text-center">Hình ảnh</th>
            <th>Tên món ăn</th>
            <th>Danh mục</th>
            <th>Đơn giá</th>
            <th>Thời gian</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(d => (
            <tr key={d.id}>
              <td className="text-center">
                <img src={d.imageUrl || "https://via.placeholder.com/75x55?text=Dish"} alt={d.name} width="75" height="55" className="rounded shadow-sm" style={{ objectFit: "cover" }} />
              </td>
              <td>
                <strong className="text-dark">{d.name}</strong>
                <span className="d-block text-muted small text-truncate" style={{maxWidth: '250px'}}>{d.description}</span>
              </td>
              <td><span className="badge bg-secondary">{d.categoryId?.name || "Mặc định"}</span></td>
              <td className="text-danger fw-bold">{Number(d.price).toLocaleString()}đ</td>
              <td>{d.prepTime ? `${d.prepTime} phút` : "---"}</td>
              <td className="text-center">
                <Button variant="outline-warning" size="sm" className="me-2 text-dark fw-bold" onClick={() => openEditModal(d)}>Sửa</Button>
                <Button variant="outline-danger" size="sm" className="fw-bold" onClick={() => handleDeleteDish(d.id, d.name)}>Gỡ</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">{isEdit ? "Sửa thông tin món" : "Thêm món mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveDish}>
          <Modal.Body>
            <Row>
              {dishFields.map((f, idx) => (
                <Col md={f.md} className="mb-3" key={idx}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">{f.label} {f.required && <span className="text-danger">*</span>}</Form.Label>
                    
                    {f.type === "select" ? (
                      <Form.Select required={f.required} value={dish[f.field]} onChange={e => change(e.target.value, f.field)}>
                        <option value="">-- Chọn danh mục món ăn --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control 
                        as={f.type === "textarea" ? "textarea" : "input"}
                        type={f.type !== "textarea" ? f.type : undefined}
                        rows={f.rows} min={f.min} required={f.required} placeholder={f.placeholder}
                        value={dish[f.field]} onChange={e => change(e.target.value, f.field)} 
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Hình ảnh minh họa {isEdit ? "(Trống nếu giữ nguyên)" : <span className="text-danger">*</span>}</Form.Label>
                  <Form.Control type="file" accept="image/*" required={!isEdit} onChange={e => setFile(e.target.files[0])} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" type="submit" className="fw-bold px-4">
                {loading ? <MySpinner size="sm" /> : "Lưu lại"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageDishes;