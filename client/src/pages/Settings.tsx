import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container className="mt-5">
      <h2>Settings</h2>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Settings;
