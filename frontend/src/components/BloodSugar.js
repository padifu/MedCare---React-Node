import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Row, Nav, Table, Form, Button } from "react-bootstrap";
import {
  listPatientWithDataDetails,
  createPatientBloodsugar,
} from "../actions/patientActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { PATIENT_CREATE_BLOODSUGAR_RESET } from "../constants/patientConstants";
import { LinkContainer } from "react-router-bootstrap";

const BloodSugar = ({ match }) => {
  const [chartData, setChartData] = useState({});

  const [sugar, setSugar] = useState();
  const [time, setTime] = useState("");

  const dispatch = useDispatch();

  const patient = useSelector((state) => state.patientDetailsWithData);
  const { loading, error, patientwithdata } = patient;

  let bloods = [];
  let times = [];
  for (const dataObj of patientwithdata.patient.bloodsugar) {
    bloods.push(parseInt(dataObj.sugar));
    times.push(dataObj.time);
  }
  const chart = () => {
    setChartData({
      labels: times,
      datasets: [
        {
          label: "Bloodsugar",
          data: bloods,
          backgroundColor: ["#F0F8FF"],
          borderWidth: 4,
        },
      ],
    });
  };
  useEffect(chart, []);

  const patientBloodsugarCreate = useSelector(
    (state) => state.patientBloodsugarCreate
  );
  const {
    success: successPatientBloodsugar,
    error: errorPatientBloodsugar,
  } = patientBloodsugarCreate;

  useEffect(() => {
    if (successPatientBloodsugar) {
      setSugar("");
      setTime("");
      dispatch({ type: PATIENT_CREATE_BLOODSUGAR_RESET });
    }
    dispatch(listPatientWithDataDetails(match.params.id));
  }, [dispatch, match, successPatientBloodsugar]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createPatientBloodsugar(match.params.id, { sugar, time }));
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Link className="btn btn-dark my-3" to="/admin/patientlist">
            Go Back
          </Link>
        </Col>
        <Col className="text-right">
          <h5>Patient created by: {patientwithdata.patient.nameUser}</h5>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="mb-3 border-dark">
          <Card.Header>
            <Nav variant="pills">
              <LinkContainer
                to={`/admin/patientlist/${patientwithdata.patient._id}`}
              >
                <Nav.Link eventKey="personal informations">
                  Personal Informations
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={`/admin/patientlist/${patientwithdata.patient._id}/bloodpressure`}
              >
                <Nav.Link eventKey="bloodpressure">Blood Pressure</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={`/admin/patientlist/${patientwithdata.patient._id}/heartrate`}
              >
                <Nav.Link eventKey="heartrate">Heart Rate</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={`/admin/patientlist/${patientwithdata.patient._id}/bloodsugar`}
              >
                <Nav.Link>Blood Sugar</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={`/admin/patientlist/${patientwithdata.patient._id}/saturation`}
              >
                <Nav.Link eventKey="saturation">Saturation</Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Header>
          <Card.Body>
            <h2>Blood sugar Measurement</h2>
            {errorPatientBloodsugar && (
              <Message variant="danger">{errorPatientBloodsugar}</Message>
            )}
            <h5>Add new Measure</h5>
            <Form className="mb-sm-2" inline onSubmit={submitHandler}>
              <Form.Control
                style={{ width: "250px" }}
                className="mr-sm-2"
                type="number"
                maxLength="2"
                pattern="^[0-9]*"
                data-mask="99"
                placeholder="Enter blood sugar measure"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
              ></Form.Control>

              <Form.Control
                className="mr-sm-2"
                type="datetime-local"
                placeholder="Enter date time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              ></Form.Control>

              <Button
                className="mr-sm-2"
                size="sm"
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
            </Form>
            {patientwithdata.patient.bloodsugar.length === 0 ? (
              <Message>No measurement</Message>
            ) : (
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Measure</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patientwithdata.patient.bloodsugar.reverse().map((sugar) => (
                    <tr key={sugar._id}>
                      <td>{sugar._id}</td>
                      <td>
                        {sugar.sugar >= 70 && sugar.sugar <= 125 ? (
                          <span style={{ color: "green" }}>
                            {sugar.sugar}mg/dL - the measurement is normal
                          </span>
                        ) : (
                          <span style={{ color: "red" }}>
                            {sugar.sugar}mg/dL - the measurement is below normal
                          </span>
                        )}
                      </td>
                      <td>{sugar.time}</td>
                    </tr>
                  ))}
                  {patientwithdata.data.map((datas) =>
                    datas.message.bloodsugar.map((sugar) => (
                      <tr key={sugar._id}>
                        <td>{datas.message.id}</td>
                        <td>
                          {sugar.sugar >= 70 && sugar.sugar <= 125 ? (
                            <span style={{ color: "green" }}>
                              {sugar.sugar}mg/dL - the measurement is normal
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>
                              {sugar.sugar}mg/dL - the measurement is below
                              normal
                            </span>
                          )}
                        </td>
                        <td>{sugar.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
      <div>
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Bloodsugar measurement", display: true },
            scales: {
              yAxes: [
                {
                  tricks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </>
  );
};

export default BloodSugar;
