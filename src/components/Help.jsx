import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { HelpItem } from "./HelpItem";
import { FaSpinner, FaCircleNotch } from "react-icons/fa";
import { MyModal } from "./Modal";
import auth from "../lib/auth";
import api from "../api";
import { Loader } from "./Loader";

export const Help = () => {
  const [finding, setFinding] = useState(false);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const handleClose = () => {
    setShowModal(false);
  };

  const findPeople = () => {
    const { latitude, longitude } = position.coords || {};
    api
      .getNearbyPerson({ latitude, longitude })
      .then(res => {
        if (res.status === "Success") {
          setData(res.data);
          if (!res.data.length) {
            setError("No people found.");
          }
        } else {
          setError("Error finding persons.");
        }
      })
      .catch(err => setError("Error finding persons."))
      .finally(() => {
        setFinding(false);
      });
  };

  React.useEffect(() => {
    if (position.coords) {
      findPeople();
    }
  }, [position.coords]);

  const doHelp = needy_id => {
    const helper_id = auth.isAuthenticated();
    api
      .doHelp(needy_id, helper_id)
      .then(res => {
        if (res.status === "Success") {
          setSuccess("Wonderful, you can now contact person to help him.");
        } else {
          setError("Oops, There is problem somewhere.");
        }
      })
      .catch(error => setError("Some error has occured."));
  };

  const findnearByPeople = () => {
    setFinding(true);
    navigator &&
      navigator.permissions &&
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function(result) {
          if (result.state === "granted") {
            getPosition(setPosition, setError);
          } else if (result.state === "prompt") {
            getPosition(setPosition, setError);
          } else if (result.state === "denied") {
            setError("Please enable location access in site setting.");
            setFinding(false);
          }
        });
  };

  const getPosition = (setPosition, setError) => {
    console.log("GET POSTITON");
    navigator.geolocation.getCurrentPosition(setPosition, error =>
      setError(error.message)
    );
  };

  const helpPress = helpitem => {
    if (!auth.isAuthenticated()) {
      window.location.href = "adduser?c=helpothers";
      return;
    }
    setShowModal(true);
    setModalItem(helpitem);
  };

  return (
    <>
      {showModal && (
        <MyModal
          showModal={showModal}
          handleClose={handleClose}
          onSave={doHelp}
          item={modalItem}
        />
      )}
      <Row className="py-5">
        <Col md={9} sm={12} className="text-center  mx-auto ">
          <h4>People looking for help</h4>
          {!finding && (
            <Button
              className="mt-3"
              variant="primary"
              onClick={findnearByPeople}
            >
              <strong>{data.length ? "Refresh" : "Find people"}</strong>
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={9} sm={12} className="mx-auto">
          <div className="text-center">
            {error && <h6 className="text-danger">{error}</h6>}
            {success && <h6 className="text-success">{success}</h6>}
          </div>

          {/* <h5>No results found.</h5> */}
        </Col>
        <Col md={9} className={"mt-4 mx-auto"}>
          <Loader loading={finding} />
          {!finding && data.length
            ? data.map((i, k) => (
                <HelpItem
                  data={i}
                  key={k}
                  onHelpPress={() => {
                    helpPress(i);
                  }}
                />
              ))
            : ""}
        </Col>
      </Row>
    </>
  );
};
