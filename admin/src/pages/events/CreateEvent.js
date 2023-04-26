import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import RichEditor from "../../components/Inputs/RichEditor";
import MySelect from "../../components/Inputs/MySelect";

import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { createEvent } from "../../store/api/events";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const schema = {
  name: Joi.string().min(1).trim().required(),
  description: Joi.string().min(1).trim().required(),
  venue: Joi.string().min(1).trim().optional().allow(""),
  type: Joi.string().min(1).trim().required(),
  startDate: Joi.number().min(0).required(),
  endDate: Joi.number().min(0).required(),
};

class CreateCoupon extends Component {
  state = {
    categories: [],
    courses: [],
    form: {
      name: "",
      description: "",
      venue: "",
      type: "event",
      startDate: new Date(),
      endDate: new Date(),
    },
    errors: {},

    imageSource: null,
    imagePreview: "",
    showLoader: false,
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, imageSource } = this.state;
    const data = {
      ...form,
      startDate: moment(form.startDate).format("X"),
      endDate: moment(form.endDate).format("X"),
    };

    const errors = validateSchema(data, schema);
    if (errors) {
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });

    if (imageSource) data.image = imageSource;

    const formData = new FormData();
    for (let key in data) formData.append(key, data[key]);

    this.props.createEvent({
      body: formData,
      onSuccess: () => {
        this.props.history.goBack();
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            {imagePreview && (
              <img
                src={imagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
              />
            )}
            <br />
            <label>
              <span className="btn btn-info">Choose Image</span>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                className="d-none"
                onChange={(e) => {
                  const imageSource = e.target.files[0];
                  if (imageSource) {
                    this.setState({ imageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(imageSource);
                    reader.onloadend = function () {
                      this.setState({ imagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <Input
              label="Name"
              placeholder="Name"
              name="name"
              onChange={(name) => {
                form.name = name;
                errors.name = "";
                this.setState({ form, errors });
              }}
              value={form.name}
              error={errors.name}
            />
          </div>

          <div className="col-12">
            <Input
              label="Venue"
              placeholder="Venue"
              name="venue"
              onChange={(venue) => {
                form.venue = venue;
                errors.venue = "";
                this.setState({ form, errors });
              }}
              value={form.venue}
              error={errors.venue}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Description"
              value={form.description}
              onChange={(description) => {
                form.description = description;
                errors.description = "";
                this.setState({ form, errors });
              }}
              error={errors.description}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Event Type"
              placeholder="Event Type"
              options={[
                { label: "Event", value: "event" },
                { label: "Webinar", value: "webinar" },
              ]}
              name="type"
              onChange={(e) => {
                const type = e.target.value;
                form.type = type || "event";
                errors.type = "";
                this.setState({ form, errors });
              }}
              value={form.type}
              error={errors.type}
            />
          </div>

          <div className="col-6">
            <label class="form-control-label">Start Date</label>
            <br />
            <DatePicker
              selected={form.startDate}
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                form.startDate = date;
                errors.startDate = "";
                this.setState({ form, errors });
              }}
              customInput={<input className="form-control w-100" />}
            />
          </div>

          <div className="col-6">
            <label class="form-control-label">End Date</label>
            <br />
            <DatePicker
              selected={form.endDate}
              timeFormat="HH:mm"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              onChange={(date) => {
                form.endDate = date;
                errors.endDate = "";
                this.setState({ form, errors });
              }}
              customInput={<input className="form-control w-100" />}
            />
          </div>

          <div className="col-12 text-center mt-2">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    );
  };
  render() {
    const { showLoader } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Create Event</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {this.renderForm()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  createEvent: (params) => dispatch(createEvent(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(CreateCoupon);
