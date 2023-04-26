import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "../../../components/Headers/Header.jsx";
import Loader from "../../../components/Loader";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";
import Toggle from "../../../components/Inputs/Toggle";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import { getPages } from "../../../store/api/dynamicPages";
import { editHomeJoin, getHomeJoin } from "../../../store/api/homeJoin";
import RichEditor from "../../../components/Inputs/RichEditor";

const schema = {
  heading: Joi.string().optional().allow(""),
  text: Joi.string().optional().allow(""),
  buttonText: Joi.string().optional().allow(""),
  buttonLink: Joi.string().optional().allow(""),
  buttonText2: Joi.string().optional().allow(""),
  buttonLink2: Joi.string().optional().allow(""),
};

class EditSliderPage extends Component {
  state = {
    id: "",
    pages: [],
    form: {
      heading: "",
      text: "",
      buttonText: "",
      buttonLink: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadSlider(id);
    this.loadPages();
  };

  loadPages = () => {
    this.props.getPages({
      onSuccess: (res) => {
        this.setState({ pages: res.data.data });
      },
    });
  };

  loadSlider = (id) => {
    this.setState({ showLoader: true });
    this.props.getHomeJoin({
      id,
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];

        const imagePreview = res.data.data.image || "";
        this.setState({ form, imagePreview });
      },

      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };
  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id, imageSource } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    if (imageSource) {
      form.image = imageSource;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.editHomeJoin({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview, pages = [] } = this.state;
    const selectList = pages.map((p) => {
      return { label: p.title, value: "/page/" + p.slug };
    });
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
              label="Heading"
              placeholder="Heading"
              name="heading"
              onChange={(heading) => {
                form.heading = heading;
                errors.heading = "";
                this.setState({ form, errors });
              }}
              value={form.heading}
              error={errors.heading}
            />
          </div>

          <div className="col-12">
            <Input
              label="Text"
              type="textarea"
              rows={3}
              placeholder="Text"
              name="text"
              onChange={(text) => {
                form.text = text;
                errors.text = "";
                this.setState({ form, errors });
              }}
              value={form.text}
              error={errors.text}
            />
          </div>

          <div className="col-12">
            <Input
              label="Button Text"
              placeholder="Button Text"
              name="buttonText"
              onChange={(buttonText) => {
                form.buttonText = buttonText;
                errors.buttonText = "";
                this.setState({ form, errors });
              }}
              value={form.buttonText}
              error={errors.buttonText}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Link"
              placeholder="Link"
              name="Link"
              options={this.props.links}
              onChange={(e) => {
                const buttonLink = e.target.value;
                form.buttonLink = buttonLink;
                errors.buttonLink = "";
                this.setState({ form, errors });
              }}
              value={form.buttonLink}
              error={errors.buttonLink}
            />
          </div>

          <div className="col-12">
            <Input
              label="Button Text 2"
              placeholder="Button Text 2"
              name="buttonText"
              onChange={(buttonText2) => {
                form.buttonText2 = buttonText2;
                errors.buttonText2 = "";
                this.setState({ form, errors });
              }}
              value={form.buttonText2}
              error={errors.buttonText2}
            />
          </div>

          <div className="col-12">
            <MySelect
              label="Link 2"
              placeholder="Link 2"
              name="Link2"
              options={this.props.links}
              onChange={(e) => {
                const buttonLink2 = e.target.value;
                form.buttonLink2 = buttonLink2;
                errors.buttonLink2 = "";
                this.setState({ form, errors });
              }}
              value={form.buttonLink2}
              error={errors.buttonLink2}
            />
          </div>
          <div className="col-12 text-center">
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
                <h2 className="mb-0 float-left">Edit Home Join Section</h2>
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

const mapStateToProps = (state) => ({
  links: state.cms.links.list,
});
const mapDispatchToprops = (dispatch) => ({
  editHomeJoin: (params) => dispatch(editHomeJoin(params)),
  getHomeJoin: (params) => dispatch(getHomeJoin(params)),
  getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditSliderPage);
