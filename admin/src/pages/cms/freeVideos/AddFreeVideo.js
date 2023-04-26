import React, { Component } from "react";
import Header from "components/Headers/Header.jsx";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Input from "../../../components/Inputs/Input";
import MySelect from "../../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../../helpers/validation";
import { createVideo } from "../../../store/api/freeVideos";
import { getCategories } from "../../../store/api/categories";

import Joi from "joi-browser";

const schema = {
  videoLink: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  videoTitle: Joi.string().min(1).required(),
  videoTitle: Joi.string().min(1).required(),
};

class AddFreeVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
      imagePreview: "",
      form: {
        videoLink: "",
        description: "",
        videoTitle: "",
        category: "",
      },
      categoriesList: [],
      errors: {},
      showLoader: false,
    };
  }

  componentDidMount = () => {
    this.props.getCategories({
      onSuccess: (res) => {
        this.setState({ categoriesList: res.data.data });
      },
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, imageSource } = this.state;

    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    if (imageSource) form.image = imageSource;
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);

    this.props.createVideo({
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
    const { form, errors, imagePreview, showLoader } = this.state;
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="col-12">
          {imagePreview && (
            <>
              <img
                src={imagePreview}
                style={{ maxWidth: "130px", borderRadius: "5px" }}
                className="mb-2"
                alt=""
              />
              <br />
            </>
          )}
          <label className="btn btn-primary">
            Choose Thumbnail
            <input
              type="file"
              multiple={true}
              accept="image/*"
              className="d-none"
              onChange={(e) => {
                const file = e.target.files["0"];
                if (!file) return;
                this.setState({ imageSource: file });

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                  this.setState({ imagePreview: reader.result });
                }.bind(this);
              }}
            />
          </label>
        </div>

        <div className="col-md-12">
          <Input
            label="VideoTitle"
            placeholder="VideoTitle"
            name="VideoTitle"
            onChange={(videoTitle) => {
              form.videoTitle = videoTitle;
              errors.videoTitle = "";
              this.setState({ form, errors });
            }}
            value={form.videoTitle}
            error={errors.videoTitle}
          />
        </div>
        <div className="col-12">
          <Input
            label="Video Link Here"
            placeholder="Copy and Paste Youtube Video Link Here"
            name="VideoLink"
            onChange={(videoLink) => {
              form.videoLink = videoLink;
              errors.videoLink = "";
              this.setState({ form, errors });
            }}
            value={form.videoLink}
            error={errors.videoLink}
          />
        </div>

        <div className="col-12">
          <MySelect
            label="Category"
            placeholder="Choose a category"
            options={this.state.categoriesList.map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))}
            name="category"
            onChange={(e) => {
              form.category = e.target.value;
              errors.category = "";
              this.setState({ form, errors });
            }}
            value={form.category}
            error={errors.category}
          />
        </div>
        <div className="col-12">
          <Input
            label="Description"
            placeholder="Description"
            name="Description"
            onChange={(description) => {
              form.description = description;
              errors.description = "";
              this.setState({ form, errors });
            }}
            value={form.description}
            error={errors.description}
          />
        </div>
        <div className="col-12 text-center">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={showLoader}
          >
            Save
          </button>
        </div>
      </form>
    );
  };
  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Add Outclass Video </h2>
              </div>
            </CardHeader>
            <CardBody className="bg-secondary">{this.renderForm()}</CardBody>
          </Card>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return { categories: state.categories };
};

export default connect(mapStateToProps, { createVideo, getCategories })(
  AddFreeVideo
);
