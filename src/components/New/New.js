import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../utils/funcs";
import "./New.css";

const New = () => {
  const [itemName, setItemName] = useState();
  const [itemDescription, setItemDescription] = useState();
  const [itemImage, setItemImage] = useState();
  const [itemPrice, setItemPrice] = useState();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    create(itemName, itemImage, itemDescription, itemPrice);
  };

  const create = async (name, imageUrl, description, price) => {
    const itemObj = { name, imageUrl, description, price };
    try {
      await createItem(itemObj).then(() => {
        navigate("/");
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="form-new">
      <div className="form-heading">Add a new item to the arena</div>
      <div className="form-form">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Enter name here</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>Enter image link</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setItemImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Enter Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
            <Form.Label>Enter price</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="button" onClick={() => navigate("/")}>
            Exit
          </Button>
          <Button variant="dark" type="submit">
            Add
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default New;
