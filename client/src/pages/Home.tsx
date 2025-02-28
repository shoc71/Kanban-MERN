import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to Kanban Board</h1>
      <p>Manage your tasks efficiently.</p>
      <Button variant="primary" onClick={() => navigate("/login")} className="me-2">
        Login
      </Button>
      <Button variant="success" onClick={() => navigate("/register")}>
        Register
      </Button>
    </Container>
  );
};

export default Home;
