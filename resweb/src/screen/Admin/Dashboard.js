import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';

const Dashboard = () => {
  // Dữ liệu giả lập (Sau này bạn sẽ fetch từ API về)
  const stats = [
    { title: "Doanh thu hôm nay", value: "5,400,000 đ", color: "success", icon: "💰" },
    { title: "Đơn hàng mới", value: "12 Đơn", color: "warning", icon: "📋" },
    { title: "Món ăn đang phục vụ", value: "45 Món", color: "info", icon: "🍲" },
    { title: "Bàn đang trống", value: "8 / 20 Bàn", color: "danger", icon: "🪑" },
  ];

  const recentOrders = [
    { id: "HD001", table: "Bàn số 5", time: "12:15", total: "450,000 đ", status: "Chưa thanh toán" },
    { id: "HD002", table: "Bàn số 2", time: "11:30", total: "1,200,000 đ", status: "Đã thanh toán" },
    { id: "HD003", table: "Mang về", time: "11:15", total: "180,000 đ", status: "Đã thanh toán" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tổng quan Nhà hàng</h2>
        <Button variant="primary">🔄 Làm mới dữ liệu</Button>
      </div>

      {/* Thẻ thống kê nhanh */}
      <Row className="mb-4">
        {stats.map((item, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mb-3">
            <Card className="shadow-sm border-0">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-1">{item.title}</h6>
                  <h4 className="fw-bold mb-0">{item.value}</h4>
                </div>
                <div className={`fs-1 text-${item.color}`}>{item.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Khu vực bảng dữ liệu chi tiết */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold py-3">Đơn hàng vừa phát sinh</Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Mã HD</th>
                    <th>Vị trí</th>
                    <th>Thời gian</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.table}</td>
                      <td>{order.time}</td>
                      <td>{order.total}</td>
                      <td>
                        <span className={`badge bg-${order.status === 'Đã thanh toán' ? 'success' : 'danger'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white fw-bold py-3">Món ăn bán chạy</Card.Header>
            <Card.Body>
              <ol className="list-group list-group-numbered list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-start border-0">
                  <div className="ms-2 me-auto">Gà sốt cay Hàn Quốc</div>
                  <span className="badge bg-primary rounded-pill">42 lượt</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start border-0">
                  <div className="ms-2 me-auto">Lẩu Thái hải sản</div>
                  <span className="badge bg-primary rounded-pill">35 lượt</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start border-0">
                  <div className="ms-2 me-auto">Trà sữa trân châu hoàng kim</div>
                  <span className="badge bg-primary rounded-pill">29 lượt</span>
                </li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;