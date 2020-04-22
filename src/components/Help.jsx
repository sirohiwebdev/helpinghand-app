import React, { useState } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { HelpItem } from "./HelpItem";

export const Help = () => {
  const [finding, setFinding] = useState(false);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  // console.log(position);

  React.useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then(function(result) {
      if (result.state === "granted") {
        getPosition(setPosition, setError);
      } else if (result.state === "prompt") {
        getPosition(setPosition, setError);
      } else if (result.state === "denied") {
        setError("User permission denied");
      }
    });
  }, []);

  const getPosition = (setPostition, setError) => {
    navigator.geolocation.getCurrentPosition(setPosition, error =>
      setError(error.message)
    );
  };

  const findPeople = () => {};
  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="py-3">
        <Col md={9} sm={12} className="text-center  mx-auto ">
          <h4>People looking for help</h4>
          <Button className="mt-3" variant="primary" onClick={findPeople}>
            <strong>Find people</strong>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={9} sm={12} className="">
          {error && <h6 className="text-danger">{error}</h6>}

          {/* <h5>No results found.</h5> */}
        </Col>
        <Col md={9} className={"mt-4 mx-auto"}>
          {finding
            ? "Finding"
            : [0, 0, 0, 0].map((i, k) => <HelpItem key={k} />)}
        </Col>
      </Row>
    </>
  );
};
