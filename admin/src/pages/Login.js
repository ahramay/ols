import React from "react";
import { Button, Card, CardBody, Form, Row, Col, Container } from "reactstrap";
import Joi from "joi-browser";
import { HashLoader } from "react-spinners";
import AuthNavbar from "components/Navbars/AuthNavbar.jsx";
import logoImg from "../assets/img/logo.png";
import IconInput from "./../components/Inputs/IconInput";
import validateSchema from "../helpers/validation";
import { connect } from "react-redux";

import { signinUser } from "../store/api/auth";

const schema = {
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(5).max(25).required(),
};

class Login extends React.Component {
  state = {
    form: {
      email: "",
      password: "",
    },
    errors: {},
    loading: false,
  };

  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }

  loginHandler = async (e) => {
    e.preventDefault();
    const { form } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });
    const { email, password } = form;
    this.props.signinUser({
      body: { email, password },
      onSuccess: (res) => {
        this.props.history.replace("/dashboard");
      },
    });
  };

  showForm = () => {
    const { errors, form } = this.state;
    return (
      <Form role="form" onSubmit={this.loginHandler}>
        <IconInput
          icon="ni ni-email-83"
          placeholder="Email"
          onChange={(email) => {
            form.email = email;
            errors.email = "";
            this.setState({ form, errors });
          }}
          name="email"
          type="text"
          value={form.email}
          autoFocus={true}
          error={errors.email}
        />

        <IconInput
          icon="ni ni-lock-circle-open"
          placeholder="Password"
          onChange={(password) => {
            form.password = password;
            errors.password = "";
            this.setState({ form, errors });
          }}
          type="password"
          value={form.password}
          error={errors.password}
        />

        <div className="d-flex justify-content-center mt-4">
          <Button color="primary" type="submit">
            Sign in
          </Button>
        </div>
      </Form>
    );
  };

  showLoader = () => {
    return (
      <div className="d-flex justify-content-center my-5">
        <HashLoader width={25} height={25} color="#5e72e4" />
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <>
        <div className="main-content">
          <AuthNavbar />
          <div className="header bg-gradient-info py-7 py-lg-8">
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>
          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
              <Col lg="5" md="7">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="d-flex justify-content-center mb-4">
                      <img src={logoImg} style={{ height: 100 }} alt="Logo" />
                    </div>
                    {loading ? this.showLoader() : this.showForm()}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  signinUser: (params) => dispatch(signinUser(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
