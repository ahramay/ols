import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import RichEditor from "../../components/Inputs/RichEditor";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import {
  editPlan,
  getPlan,
  editPlanImage,
} from "../../store/api/subscriptionPlans";
import PricePlans from "../pricePlans/PricePlans";
import { getCategories } from "../../store/api/categories";
import { basePath } from "../../configs";

const schema = {
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().min(5).max(30).required(),
  numberOfCourses: Joi.number().required(),
  // accessibleText: Joi.string().required(),
  chooseText: Joi.string().required(),
};

class EditCategory extends Component {
  state = {
    id: "",
    categories: [],
    form: {
      name: "",
      category: "",
      numberOfCourses: "",
      // accessibleText:"",
      chooseText: "",
    },
    errors: {},
    showLoader: false,

    cardImageSource: null,
    cardImagePreview: "",

    smallImageSource: null,
    smallImagePreview: "",
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadPlan(id);
    this.loadCategories();
  };

  loadPlan = (id) => {
    this.setState({ showLoader: true });
    this.props.getPlan({
      id,
      onSuccess: (res) => {
        const { name, category, numberOfCourses, chooseText } = res.data.data;
        this.setState({
          form: { name, category, numberOfCourses, chooseText },
        });

        const previews = {};
        ["cardImage", "smallImage"].forEach((img) => {
          try {
            previews[img + "Preview"] = res.data.data[img] || "";
          } catch (err) {}
        });

        this.setState(previews);
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  loadCategories = () => {
    this.props.getCategories({
      onSuccess: (res) => {
        const { data: categories } = res.data;
        this.setState({ categories });
      },
    });
  };
  onFormSubmit = (e) => {
    e.preventDefault();
    const { form, id } = this.state;
    const errors = validateSchema(form, schema);
    if (errors) return this.setState({ errors });

    this.setState({ showLoader: true });

    this.props.editPlan({
      id,
      body: form,
      onSuccess: (res) => {
        const id = res.data.data._id;
        ["cardImage", "smallImage"].forEach((key) => {
          const source = this.state[key + "Source"];
          if (!source) return;
          const body = { image: source };
          this.props.editPlanImage({
            id,
            key,
            body,
          });
        });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const {
      form,
      errors,
      categories,
      id,
      cardImagePreview,
      smallImagePreview,
    } = this.state;

    const categoriesDropdownList = categories
      .map((cat) => ({
        value: cat._id,
        label: cat.name,
      }))
      .filter((c) => c.value !== id);
    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            {smallImagePreview && (
              <img
                src={smallImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
              />
            )}
            <br />
            <label>
              <span className="btn btn-info">Choose Small Image</span>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                className="d-none"
                onChange={(e) => {
                  const smallImageSource = e.target.files[0];
                  if (smallImageSource) {
                    this.setState({ smallImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(smallImageSource);
                    reader.onloadend = function () {
                      this.setState({ smallImagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>
          <div className="col-md-6">
            {cardImagePreview && (
              <img
                src={cardImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
              />
            )}
            <br />
            <label>
              <span className="btn btn-info">Choose Card Image</span>
              <input
                type="file"
                accept="image/*"
                multiple={false}
                className="d-none"
                onChange={(e) => {
                  const cardImageSource = e.target.files[0];
                  if (cardImageSource) {
                    this.setState({ cardImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(cardImageSource);
                    reader.onloadend = function () {
                      this.setState({ cardImagePreview: reader.result });
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
              label="Number of Courses"
              placeholder="Number of Courses"
              name="numberOfCourses"
              onChange={(numberOfCourses) => {
                form.numberOfCourses = numberOfCourses;
                errors.numberOfCourses = "";
                this.setState({ form, errors });
              }}
              value={form.numberOfCourses}
              error={errors.numberOfCourses}
            />
          </div>
          <div className="col-12">
            <MySelect
              label="Category"
              placeholder="Choose a Category"
              options={categoriesDropdownList}
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

          <div className="col-12">
            <RichEditor
              label="Main Plan Modal Heading"
              placeholder="Main Plan Modal Heading"
              autoFocus={true}
              value={form.chooseText}
              name="chooseText"
              onChange={(chooseText) => {
                form.chooseText = chooseText;
                errors.chooseText = "";
                this.setState({ form, errors });
              }}
              error={errors.chooseText}
            />
          </div>

          {/* <div className="col-12">
            <RichEditor
              label="Access Duration Text"
              placeholder="Access Duration Text"
              autoFocus={true}
              value={form.accessibleText}
              name="accessibleText"
              onChange={(accessibleText) => {
                form.accessibleText = accessibleText;
                errors.accessibleText = "";
                this.setState({ form, errors });
              }}
              error={errors.accessibleText}
            />
          </div> */}

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
                <h2 className="mb-0 float-left">Edit Subscription Plan</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {!this.state.showLoader && this.renderForm()}

              <Link
                to={`${basePath}/price_plans/${this.props.match.params.id}/add`}
                className="btn btn-primary ml-auto mb-3"
              >
                Add Price Plan
              </Link>

              <PricePlans
                subscriptionPlan={this.props.match.params.id}
                history={this.props.history}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  editPlan: (params) => dispatch(editPlan(params)),
  getCategories: (params) => dispatch(getCategories(params)),
  getPlan: (params) => dispatch(getPlan(params)),
  editPlanImage: (params) => dispatch(editPlanImage(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditCategory);
