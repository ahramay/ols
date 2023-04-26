import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import RichEditor from "../../components/Inputs/RichEditor";
import Input from "../../components/Inputs/Input";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";
import { editPlan, getPlan, editPlanImage } from "../../store/api/pricePlans";

const schema = {
  price: Joi.number().min(1).required(),
  subscriptionPlan: Joi.string().min(5).max(30).required(),
  numberOfDays: Joi.number().min(1).required(),
  accessText: Joi.string().required(),
  saleText: Joi.string().optional().allow(""),
};

class EditCategory extends Component {
  state = {
    id: "",
    categories: [],
    form: {
      price: "",
      subscriptionPlan: this.props.match.params.subscriptionPlan,
      numberOfDays: "",
      accessText: "",
      saleText: "",
      bottomAccessText: "",
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
  };

  loadPlan = (id) => {
    this.setState({ showLoader: true });
    this.props.getPlan({
      id,
      onSuccess: (res) => {
        const { price, numberOfDays, saleText, accessText, bottomAccessText } =
          res.data.data;

        this.setState({
          form: {
            ...this.state.form,
            price,
            numberOfDays,
            subscriptionPlan: this.props.match.params.subscriptionPlan,
            saleText,
            accessText,
            bottomAccessText,
          },
        });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
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
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  renderForm = () => {
    const { form, errors } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            <Input
              label="Price"
              placeholder="Price"
              name="price"
              onChange={(price) => {
                form.price = price;
                errors.price = "";
                this.setState({ form, errors });
              }}
              value={form.price}
              error={errors.price}
            />
          </div>

          <div className="col-12">
            <Input
              label="Number of Days"
              placeholder="Number of Days"
              name="numberOfDays"
              onChange={(numberOfDays) => {
                form.numberOfDays = numberOfDays;
                errors.numberOfDays = "";
                this.setState({ form, errors });
              }}
              value={form.numberOfDays}
              error={errors.numberOfDays}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Access Duration Text"
              placeholder="Access Duration Text"
              autoFocus={true}
              value={form.accessText}
              name="accessText"
              onChange={(accessText) => {
                form.accessText = accessText;
                errors.accessText = "";
                this.setState({ form, errors });
              }}
              error={errors.accessText}
              toolbar={["bold", "italic", "strikethrough"]}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Sale Text"
              placeholder="Sale Text"
              autoFocus={true}
              value={form.saleText}
              name="saleText"
              onChange={(saleText) => {
                form.saleText = saleText;
                errors.saleText = "";
                this.setState({ form, errors });
              }}
              error={errors.saleText}
              toolbar={["bold", "italic", "strikethrough"]}
            />
          </div>

          <div className="col-12">
            <RichEditor
              label="Bottom Access Text"
              placeholder="Bottom Access Text"
              autoFocus={true}
              value={form.bottomAccessText}
              name="bottomAccessText"
              onChange={(bottomAccessText) => {
                form.bottomAccessText = bottomAccessText;
                errors.bottomAccessText = "";
                this.setState({ form, errors });
              }}
              error={errors.bottomAccessText}
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
                <h2 className="mb-0 float-left">Edit Price Plan</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary position-relative">
              {showLoader && (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              )}
              {!this.state.showLoader && this.renderForm()}
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
  getPlan: (params) => dispatch(getPlan(params)),
  editPlanImage: (params) => dispatch(editPlanImage(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(EditCategory);
