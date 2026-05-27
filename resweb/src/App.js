import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { UserProvider } from "./configs/Contexts";
import Login from "./screen/User/Login";
import Register from "./screen/User/Register";
import Home from "./screen/Home/Home";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import DishDetail from "./screen/Home/DishDetail";


const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dishes/:dishId" element={<DishDetail />} /> 
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
