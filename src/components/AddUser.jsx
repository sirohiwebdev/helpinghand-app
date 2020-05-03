import React, { useState, useContext } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import api from "../api";
import { DetailsForm } from "./DetailsForm";
import { VerifyOTPForm } from "./VerifyOTPForm";
import randomNumber from "../lib/random";
import auth from "../lib/auth";
import { useLocation, Redirect } from "react-router";
import userContext from "../context/userContext";

export const Adduser = props => {
  const { search } = useLocation();
  const [values, setValues] = useState({ name: "", mobile: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user, setUser } = useContext(userContext);
  const [resending, setResending] = useState(false);

  const sendOTP = (v, { setSubmitting }) => {
    setError(null);
    setSubmitting(true);
    setValues(v);
    const r = randomNumber();
    const newOtp = otp || r;
    setOtp(newOtp);

    api
      .sendOtp(v.mobile, newOtp)
      .then(res => {
        if (res.Status === "Success") {
          setSuccess("OTP sent successfully");
          setOtpSent(true);
          setSessionId(res.Details);
        } else {
          setError("Error sending otp please check mobile entered");
        }
      })
      .catch(err => {
        setError("Error proccessing request. Try again later.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const resendOTP = () => {
    setError(null);
    setResending(true);
    const r = randomNumber();
    const newOtp = otp || r;
    setOtp(newOtp);

    api
      .sendOtp(values.mobile, newOtp)
      .then(res => {
        if (res.Status === "Success") {
          setOtpSent(true);
          setSessionId(res.Details);
          setSuccess("OTP sent successfully");
        } else {
          setError("Error sending otp please check mobile entered");
        }
      })
      .catch(err => {
        setError("Error proccessing request. Try again later.");
      })
      .finally(() => {
        setResending(false);
      });
  };

  const verifyOTP = (v, { setSubmitting }) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    api
      .verifyOtp(sessionId, v.otp)
      .then(res => {
        if (res.Status === "Success") {
          api
            .createNewHelper(values)
            .then(res => {
              if (res.status === "Success") {
                setSuccess("Authentication Successfull");
                auth.setAuthentication(res.data.id);
                setUser();

                window.location.href = search ? search.split("=")[1] : "/";
              } else {
                setError("Error processing request.");
              }
            })
            .catch(err => setError("Error processing request."));
        } else {
          setError("Invalid OTP entered");
        }
      })
      .catch(err => {
        setError("Error proccessing request. Try again later.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (user) return <Redirect to="/" />;
  return (
    <>
      <Row className="py-5">
        <Col md="9" sm="12" className="mx-auto">
          <h2 className="text-center font-weight-bold">
            Please fill the details to continue
          </h2>
        </Col>

        <Col md="4" sm="12" className="mx-auto mt-5">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {!otpSent ? (
            <DetailsForm formSubmit={sendOTP} />
          ) : (
            <VerifyOTPForm
              formSubmit={verifyOTP}
              resendOtp={resendOTP}
              resending={resending}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
