import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/admin/patientlist/search/${keyword}`);
    } else {
      history.push(`/admin/patientlist`);
    }
  };

  return (
    <Form className="mb-sm-2" onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Patient"
        className="mr-sm-2"
      ></Form.Control>
      <Button id="searchbutton" type="submit" variant="dark" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
