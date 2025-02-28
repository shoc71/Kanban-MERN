import React, { useEffect, useState } from "react";
import { Container, Card, Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
}

const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Board ID
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "todo" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks",
        { board_id: id, ...newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Tasks</h2>
      <Button onClick={() => setShowModal(true)}>Add Task</Button>

      <div className="d-flex gap-4 mt-3">
        {["todo", "in-progress", "done"].map((status) => (
          <div key={status} className="w-100 p-3 border rounded">
            <h4 className="text-capitalize">{status}</h4>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} className="mb-2 p-2">
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                    <div className="d-flex gap-2">
                      {status !== "todo" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id, status === "in-progress" ? "todo" : "in-progress")}
                        >
                          Move Left
                        </Button>
                      )}
                      {status !== "done" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id, status === "todo" ? "in-progress" : "done")}
                        >
                          Move Right
                        </Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddTask}>
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Board;
