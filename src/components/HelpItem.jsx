import React from "react";
import { Row, Col, Button } from "react-bootstrap";
export const HelpItem = () => {
  return (
    <Col className="mb-3">
      <Row className={"bg-white border border rounded align-items-center py-2"}>
        <Col sm={9}>
          <div className="">
            <h5 className="font-weight-bold mb-0">Abhishek Sirohi</h5>
            <div className="text-accent text-sm">Factory Worker</div>
            <div className="d-flex justify-content-between">
              <div className="text-muted">Sadar Bazar Area</div>
              <div>
                <strong>2.4km</strong>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={3}>
          <div className="text-right">
            <Button variant={"outline-success"} size="sm" className="w-100">
              <strong>Help</strong>
            </Button>
          </div>
        </Col>
      </Row>
    </Col>
  );
};
