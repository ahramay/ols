import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";

import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import MySelect from "../../components/Inputs/MySelect";
import { connect } from "react-redux";
import validateSchema from "../../helpers/validation";

import {
  editMenuImage,
  loadCourseMenu,
  editCourseMenu,
} from "../../store/api/courseMenu";

const schema = {
  topHeading: Joi.string().required(),
  oLevelLinks: Joi.string().required(),
  satPrepLinks: Joi.string().required(),
  aLevelLinks: Joi.string().required(),
};

class SubscriptionPlans extends Component {
  state = {
    form: {
      topHeading: "",
      oLevelLinks: "",
      satPrepLinks: "",
      aLevelLinks: "",
    },
    errors: {},
    showLoader: false,
    oLevelImageSource: null,
    oLevelImagePreview: "",

    satPrepImageSource: null,
    satPrepImagePreview: "",

    aLevelImageSource: null,
    aLevelImagePreview: "",

    promoImageSource: null,
    promoImagePreview: "",
  };
  componentDidMount = () => {
    this.loadCourseMenu();
  };

  loadCourseMenu = () => {
    this.setState({ showLoader: true });
    this.props.loadCourseMenu({
      onSuccess: (res) => {
        const { form } = this.state;
        for (let key in form) form[key] = res.data.data[key];
        this.setState({ form });

        const previews = {};
        ["oLevelImage", "satPrepImage", "aLevelImage", "promoImage"].forEach(
          (img) => {
            try {
              previews[img + "Preview"] = res.data.data[img] || "";
            } catch (err) {}
          }
        );

        this.setState(previews);
      },
      onError: (err) => {
        // this.props.history.goBack();
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
    if (errors) {
      return this.setState({ errors });
    }

    this.setState({ showLoader: true });
    this.props.editCourseMenu({
      id,
      body: form,
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });

    ["oLevelImage", "satPrepImage", "aLevelImage", "promoImage"].forEach(
      (key) => {
        const source = this.state[key + "Source"];
        if (!source) return;
        const body = { image: source };
        this.props.editMenuImage({
          key,
          body,
        });
      }
    );
  };

  renderForm = () => {
    const {
      form,
      errors,
      oLevelImagePreview,
      satPrepImagePreview,
      aLevelImagePreview,
      promoImagePreview,
    } = this.state;

    return (
      <form onSubmit={this.onFormSubmit}>
        <div className="row">
          <div className="col-12">
            {promoImagePreview && (
              <img
                src={promoImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
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
                  const promoImageSource = e.target.files[0];
                  if (promoImageSource) {
                    this.setState({ promoImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(promoImageSource);
                    reader.onloadend = function () {
                      this.setState({ promoImagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <h3 className="text-center">Top Heading</h3>
          </div>

          <div className="col-12">
            <Input
              label="Top Heading"
              placeholder="Top Heading"
              name="topHeading"
              onChange={(topHeading) => {
                form.topHeading = topHeading;
                errors.topHeading = "";
                this.setState({ form, errors });
              }}
              value={form.topHeading}
              error={errors.topHeading}
            />
          </div>

          <div className="col-12">
            <h3 className="text-center">O Levels</h3>
          </div>

          <div className="col-12">
            {oLevelImagePreview && (
              <img
                src={oLevelImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
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
                  const oLevelImageSource = e.target.files[0];
                  if (oLevelImageSource) {
                    this.setState({ oLevelImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(oLevelImageSource);
                    reader.onloadend = function () {
                      this.setState({ oLevelImagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <Input
              label="O Level Course Menu"
              placeholder="Solved Past Papers, Revision Quizes"
              name="oLevelLinks"
              onChange={(oLevelLinks) => {
                form.oLevelLinks = oLevelLinks;
                errors.oLevelLinks = "";
                this.setState({ form, errors });
              }}
              value={form.oLevelLinks}
              error={errors.oLevelLinks}
            />
          </div>

          {/* <div className="col-12">
            <MySelect
              label="Link"
              placeholder="Link"
              name="Link"
              options={this.props.links}
              onChange={(e) => {
                const oLevelLinks = e.target.value;
                form.oLevelLinks = oLevelLinks;
                errors.oLevelLinks = "";
                this.setState({ form, errors });
              }}
              value={form.oLevelLinks}
              error={errors.oLevelLinks}
            />
          </div> */}

          <div className="col-12">
            <h3 className="text-center">SAT Prep</h3>
          </div>
          <div className="col-12">
            {satPrepImagePreview && (
              <img
                src={satPrepImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
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
                  const satPrepImageSource = e.target.files[0];
                  if (satPrepImageSource) {
                    this.setState({ satPrepImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(satPrepImageSource);
                    reader.onloadend = function () {
                      this.setState({ satPrepImagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <Input
              label="Plus Plan Subscription Days"
              placeholder="Solved Past Papers, Revision Quizes"
              name="satPrepLinks"
              onChange={(satPrepLinks) => {
                form.satPrepLinks = satPrepLinks;
                errors.satPrepLinks = "";
                this.setState({ form, errors });
              }}
              value={form.satPrepLinks}
              error={errors.satPrepLinks}
            />
          </div>
          {/* <div className="col-12">
            <MySelect
              label="Link"
              placeholder="Link"
              name="Link"
              options={this.props.links}
              onChange={(e) => {
                const satPrepLinks = e.target.value;
                form.satPrepLinks = satPrepLinks;
                errors.satPrepLinks = "";
                this.setState({ form, errors });
              }}
              value={form.satPrepLinks}
              error={errors.satPrepLinks}
            />
          </div> */}
          <div className="col-12">
            <h3 className="text-center">A LEVELS</h3>
          </div>

          <div className="col-12">
            {aLevelImagePreview && (
              <img
                src={aLevelImagePreview}
                style={{ maxWidth: "200px" }}
                className="mb-2"
                alt=""
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
                  const aLevelImageSource = e.target.files[0];
                  if (aLevelImageSource) {
                    this.setState({ aLevelImageSource });
                    const reader = new FileReader();
                    reader.readAsDataURL(aLevelImageSource);
                    reader.onloadend = function () {
                      this.setState({ aLevelImagePreview: reader.result });
                    }.bind(this);
                  }
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <Input
              label="A Level Course Menu"
              placeholder="Solved Past Papers, Revision Quizes"
              name="aLevelLinks"
              onChange={(aLevelLinks) => {
                form.aLevelLinks = aLevelLinks;
                errors.aLevelLinks = "";
                this.setState({ form, errors });
              }}
              value={form.aLevelLinks}
              error={errors.aLevelLinks}
            />
          </div>
          {/* <div className="col-12">
            <MySelect
              label="Link"
              placeholder="Link"
              name="Link"
              options={this.props.links}
              onChange={(e) => {
                const aLevelLinks = e.target.value;
                form.aLevelLinks = aLevelLinks;
                errors.aLevelLinks = "";
                this.setState({ form, errors });
              }}
              value={form.aLevelLinks}
              error={errors.aLevelLinks}
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
                <h2 className="mb-0 float-left">Edit Course Menu</h2>
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
  editMenuImage: (params) => dispatch(editMenuImage(params)),
  editCourseMenu: (params) => dispatch(editCourseMenu(params)),
  loadCourseMenu: (params) => dispatch(loadCourseMenu(params)),
  // getPages: (params) => dispatch(getPages(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(SubscriptionPlans);
