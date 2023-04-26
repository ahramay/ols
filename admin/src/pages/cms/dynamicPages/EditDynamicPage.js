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
import { getCategories } from "../../../store/api/blogCategories";
import { editPage, getPage } from "../../../store/api/dynamicPages";
import RichEditor from "../../../components/Inputs/RichEditor";

const schema = {
  title: Joi.string().required(),
  slug: Joi.string().required(),
  content: Joi.string().required(),
  type: Joi.string().required(),
  isActive: Joi.boolean().required(),
  metaTitle: Joi.string().required(),
  metaDescription: Joi.string().required(),
  metaKeyWords: Joi.string().required(),
};

class EditDynamicPage extends Component {
  state = {
    id: "",
    categories: [],
    form: {
      title: "",
      slug: "",
      content: "",
      type: "page",
      category: "",
      isActive: false,
      metaTitle: "",
      metaKeyWords: "",
      metaDescription: "",
    },
    errors: {},
    showLoader: false,
    imageSource: null,
    imagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadPage(id);
    this.loadCategories();
  };

  loadCategories = () => {
    this.props.getCategories({
      onSuccess: (res) => {
        this.setState({ categories: res.data.data });
      },
    });
  };

  loadPage = (id) => {
    this.setState({ showLoader: true });
    this.props.getPage({
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

    this.props.editPage({
      id,
      body: formData,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors, imagePreview, categories } = this.state;

    console.log("Form Category=> ", form.category);

    const categoriesList = categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
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
              label="Title"
              placeholder="Title"
              name="title"
              onChange={(title) => {
                form.title = title;
                errors.title = "";
                this.setState({ form, errors });
              }}
              value={form.title}
              error={errors.title}
            />
          </div>

          <div className="col-12">
            <Input
              label="Slug"
              placeholder="Slug"
              name="slug"
              onChange={(slug) => {
                form.slug = slug;
                errors.slug = "";
                this.setState({ form, errors });
              }}
              value={form.slug}
              error={errors.slug}
            />
          </div>

          <div className="col-8">
            <MySelect
              label="type"
              placeholder="Choose a Type"
              options={[
                { label: "Page", value: "page" },
                { label: "Blog", value: "blog" },
              ]}
              name="type"
              onChange={(e) => {
                const type = e.target.value;
                form.type = type;
                errors.type = "";
                this.setState({ form, errors });
              }}
              value={form.type}
              error={errors.type}
            />
          </div>
          <div className="col-4">
            <label>Is Active</label>
            <br />
            <Toggle
              checked={form.isActive}
              onChange={(ch) => {
                form.isActive = ch;
                this.setState({ form });
              }}
            />
          </div>

          {form.type === "blog" && (
            <div className="col-12">
              <MySelect
                label="Category"
                placeholder="Choose a Category"
                options={categoriesList}
                name="category"
                onChange={(e) => {
                  const category = e.target.value;
                  form.category = category;
                  errors.category = "";
                  this.setState({ form, errors });
                }}
                value={form.category}
                error={errors.category}
              />
            </div>
          )}

          <div className="col-12">
            <RichEditor
              value={form.content}
              onChange={(content) => {
                form.content = content;
                errors.content = "";
                this.setState({ form, errors });
              }}
              error={errors.content}
            />
          </div>

          <div className="col-12">
            <Input
              label="Meta Title"
              placeholder="Meta Title"
              name="metaTitle"
              onChange={(metaTitle) => {
                form.metaTitle = metaTitle;
                errors.metaTitle = "";
                this.setState({ form, errors });
              }}
              value={form.metaTitle}
              error={errors.metaTitle}
            />
          </div>
          <div className="col-12">
            <Input
              label="Meta Keywords"
              placeholder="metaKeyWords"
              name="metaKeyWords"
              onChange={(metaKeyWords) => {
                form.metaKeyWords = metaKeyWords;
                errors.metaKeyWords = "";
                this.setState({ form, errors });
              }}
              value={form.metaKeyWords}
              error={errors.metaKeyWords}
            />
          </div>
          <div className="col-12">
            <Input
              label="Meta Description"
              type="textarea"
              rows={3}
              placeholder="Meta Description"
              name="metaDescription"
              onChange={(metaDescription) => {
                form.metaDescription = metaDescription;
                errors.metaDescription = "";
                this.setState({ form, errors });
              }}
              value={form.metaDescription}
              error={errors.metaDescription}
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
                <h2 className="mb-0 float-left">Edit Dynamic Page</h2>
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
  editPage: (params) => dispatch(editPage(params)),
  getPage: (params) => dispatch(getPage(params)),
  getCategories: (params) => dispatch(getCategories(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditDynamicPage);
