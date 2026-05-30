import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { UserProvider, MyUserContext } from "./configs/Contexts";
import Login from "./screen/User/Login";
import Register from "./screen/User/Register";
import Home from "./screen/Home/Home";
import { Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import DishDetail from "./screen/Home/DishDetail";
import Dashboard from "./screen/Admin/Dashboard";
import Sidebar from "./components/Sidebar";
import ChefApproval from "./screen/Admin/UserApproval";
import ManageDishes from "./screen/Chef/ManageDishes";
import Profile from "./screen/User/Profile";

const CustomerLayout = () => {
  return (
    <>
      <Header />
      <Container className="my-4" style={{ minHeight: "75vh" }}> 
        <Outlet /> 
      </Container>
      <Footer />
    </>
  );
};

const ChefProtectedRoute = ({ children }) => {
  const { user } = useContext(MyUserContext);
  const userRole = user?.roleId?.id ? String(user.roleId.id) : String(user?.roleId);
  
  if (!user || userRole !== "2") {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.isApproved !== true && user?.isApproved !== 1) {
    return (
      <div className="alert alert-warning p-5 my-4 text-center shadow-sm">
        <h3>Tài khoản đang chờ phê duyệt</h3>
      </div>
    );
  }
  
  return children;
};

const AdminLayout = () => {
  const { user } = useContext(MyUserContext);

  const userRole = user?.roleId?.id ? String(user.roleId.id) : String(user?.roleId);
  const isAdmin = user && userRole === "1";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="bg-dark min-vh-100 text-light shadow-sm">
          <Sidebar />
        </Col>
        
        <Col xs={12} md={9} lg={10} className="p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <Outlet /> 
        </Col>
      </Row>
    </Container>
  );
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dishes/:dishId" element={<DishDetail />} />
            
            <Route path="/manage-dish" element={<ChefProtectedRoute><ManageDishes /></ChefProtectedRoute>}/>
          </Route>


          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} /> 
            <Route path="/approveChef" element={<ChefApproval />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
