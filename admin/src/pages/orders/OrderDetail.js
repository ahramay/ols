import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import Joi from "joi-browser";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Header from "components/Headers/Header.jsx";
import Loader from "../../components/Loader";
import Input from "../../components/Inputs/Input";
import Toggle from "../../components/Inputs/Toggle";
import MySelect from "../../components/Inputs/MySelect";
import {
  completeCashCheckout,
  initiateCashCollection,
} from "../../store/api/cart";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import validateSchema from "../../helpers/validation";

import { getOrder, refundOrder } from "../../store/api/orders";
import { handleErrors } from "../../helpers/error";

const schema = {
  name: Joi.string().min(2).max(50).required(),
};

class OrderDetail extends Component {
  state = {
    id: "",
    order: {
      items: [],
    },
    showLoader: false,
  };
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.setState({ id });
    this.loadOrder(id);
  };

  loadOrder = (id) => {
    this.setState({ showLoader: true });

    this.props.getOrder({
      id,
      onSuccess: (res) => {
        this.setState({ order: res.data.data });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
      },
    });
  };

  updateRefund = (refunded) => {
    const { id, order } = this.state;
    order.refunded = refunded;
    this.setState(order);

    this.props.refundOrder({
      id,
      body: { refunded: refunded ? true : false },
      onError: (err) => {
        handleErrors(err);
        order.refunded = !refunded;
        this.setState({ order });
      },
    });
  };

  getCordsFromAddress = async () => {
    const { id } = this.state;
    this.props.initiateCashCollection({
      id,
      onSuccess: (res) => {
        const order = res.data.data;
        this.setState({ order });
      },
    });
  };

  renderOrderDetail = () => {
    const { order } = this.state;

    return (
      <Card>
        <div className="row no-gutters">
          <div className="col-12">
            <table className="table table-borderless ">
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td>
                    Payment
                    <br />
                    Method
                  </td>
                  <td>{order.method} </td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td>Subtotal</td>
                  <td>{order.totalAmount} Rs.</td>
                </tr>

                {order.couponApplied && (
                  <tr
                    className="discount"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <td>Coupon</td>
                    <td>{order.couponApplied}</td>
                  </tr>
                )}
                <tr
                  className="discount"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <td>Discount</td>
                  <td>
                    {order.totalAmount - order.amountPayed
                      ? order.totalAmount - order.amountPayed
                      : 0}{" "}
                    Rs.
                  </td>
                </tr>

                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <th>Total</th>
                  <th>{order.amountPayed} Rs.</th>
                </tr>

                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <th>Refunded</th>
                  <th>
                    <Toggle
                      checked={order.refunded}
                      onChange={this.updateRefund}
                    />
                  </th>
                </tr>
              </tbody>
            </table>

            {order.method === "CASH_COLLECTION" &&
              !order.cashCollectionInitiated && (
                <div
                  className="mx-3 mt-2 clearfix"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  Collect Cash
                  <button
                    className="btn btn-primary float-right"
                    onClick={this.getCordsFromAddress}
                  >
                    Initiate
                  </button>
                </div>
              )}

            {order.method === "CASH_COLLECTION" &&
              order.cashCollectionInitiated && (
                <div
                  className="mx-3 mt-2 clearfix"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  Track Cash collection
                  <a
                    className="btn btn-success float-right"
                    target="_blank"
                    href={`https://sandbox.bykea.dev/api/v1/trip/route/${order.cashCollectionDetail.bykeyaBookingId}`}
                  >
                    Tack
                  </a>
                </div>
              )}

            {(order.method === "CASH_COLLECTION" ||
              order.method === "PAYPRO") &&
              !order.courseEnroled && (
                <div className="mx-3 mt-2 clearfix">
                  Enroll
                  <button
                    className="btn btn-primary float-right"
                    onClick={() => {
                      const { id } = this.state;
                      const conf = window.confirm(
                        "Are you sure you want to complete this order"
                      );
                      if (!conf) return;

                      this.props.completeCashCheckout({
                        id,
                        onSuccess: () => {
                          order.courseEnroled = true;
                          this.setState({ order });
                          alert("Checkout Completed");
                        },
                      });
                    }}
                  >
                    Enroll
                  </button>
                </div>
              )}
          </div>
          {order.method === "CASH_COLLECTION" && order.paymentReciptImage && (
            <div className="col-12">
              <h4 className="ml-3 mt-3">Payment Receipt</h4>
              <img src={order.paymentReciptImage} className="w-100" />
            </div>
          )}
        </div>
      </Card>
    );
  };

  renderSingleItem = (cartItem) => {
    return (
      <div className="card-body">
        <div className="left_block">
          <img src={cartItem.course.image} alt="" className="img-fluid" />
        </div>
        <div className="right_block">
          <h3>{cartItem.course.name}</h3>
          {!cartItem.completeCourse && this.renderChapters(cartItem.chapters)}
          {cartItem.completeCourse && (
            <div className="badge badge-success badge-lg mx-1 mt-1 float-left p-2 font-weight-normal">
              Complete Course
            </div>
          )}
        </div>
      </div>
    );
  };

  renderBundleItem = (cartItem) => {
    return (
      <div className="card-body">
        <div className="row">
          {cartItem.courses.map((c) => (
            <div className="col-md-4">
              <div className="card">
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundImage: `url("${c.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* <img src={c.image} alt="" className="img-fluid" /> */}
                </div>
                <h4 className="text-center mt-2">{c.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderCartItems = () => {
    const { order } = this.state;
    return (
      <>
        {order.items.map((cartItem, cartItemIndex) => {
          return (
            <div
              className="card"
              key={cartItem._id + "cart page item" + cartItemIndex}
            >
              <div className="card-body clearfix">
                {cartItem.itemType === "BUNDLE"
                  ? this.renderBundleItem(cartItem)
                  : this.renderSingleItem(cartItem)}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  renderChapters = (chapters) => {
    return (
      <div className="clearfix">
        {chapters.map((chap) => {
          return (
            <div
              key={chap._id}
              className="badge badge-secondary badge-lg mx-1 mt-1 float-left p-2 font-weight-normal"
            >
              {chap.name}
            </div>
          );
        })}
      </div>
    );
  };

  renderCashCollectionForm = () => {
    const { cashCollectionDetail = {} } = this.state.order;
    const {
      firstName = "",
      lastName = "",
      address = "",
      address2 = "",
      city = "",
      country = "",
      phone = "",
      email = "",
      otherInstructions = "",
    } = cashCollectionDetail;
    return (
      <Formik
        initialValues={{
          firstName,
          lastName,
          address,
          address2,
          city,
          country,
          phone,
          email,
          otherInstructions,
        }}
        enableReinitialize={true}
      >
        {({ setFieldValue, values }) => {
          return (
            <div className="checkout-form">
              <h3 className="text-cener">Cash Collection Details</h3>
              <Form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="firstName"
                        className="form-control"
                        placeholder="First Name *"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="lastName"
                        className="form-control"
                        placeholder="Last Name *"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="address"
                        className="form-control"
                        placeholder="Street Address*"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="address2"
                        className="form-control"
                        placeholder="Apartment, suit, unit etc.(Optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="city"
                        className="form-control"
                        placeholder="City*"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="country"
                        className="form-control"
                        placeholder="Country*"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    {/* <div className="covering">
                      <PhoneInput
                        value={values.phone}
                        placeholder="Phone"
                        onChange={(phoneNumber) => {
                          setFieldValue("phone", phone);
                        }}
                      />
                      <ErrorMessage name="phone" component={TextError} />
                    </div> */}

                    <div className="form-group">
                      <div className="covering">
                        <Field
                          type="text"
                          disabled={true}
                          name="phone"
                          className="form-control"
                          placeholder="E-mail (Optional)*"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="email"
                        disabled={true}
                        name="email"
                        className="form-control"
                        placeholder="E-mail (Optional)*"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        disabled={true}
                        type="text"
                        name="otherInstructions"
                        className="form-control"
                        placeholder="Other Instruction"
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    );
  };

  renderPayProFormForm = () => {
    const { payproPaymentDetails = {}, payproDetails = {} } = this.state.order;
    const {
      name = "",
      address = "",
      phone = "",
      email = "",
    } = payproPaymentDetails;
    return (
      <Formik
        initialValues={{
          name,
          address,
          phone,
          email,
        }}
        enableReinitialize={true}
      >
        {({ setFieldValue, values }) => {
          return (
            <div className="checkout-form">
              <h3 className="text-cener">Pay Pro Details</h3>
              <Form>
                <div className="row">
                  <div className="col-12">
                    <h3>Pay Pro ConnectPayId = {payproDetails.ConnectPayId}</h3>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="name"
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <div className="covering">
                        <Field
                          type="text"
                          disabled={true}
                          name="phone"
                          className="form-control"
                          placeholder="E-mail (Optional)*"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="email"
                        disabled={true}
                        name="email"
                        className="form-control"
                        placeholder="E-mail (Optional)*"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        disabled={true}
                        name="address"
                        className="form-control"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    );
  };

  render() {
    const { showLoader, order } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Order Details</h2>
              </div>
            </CardHeader>

            <CardBody
              className="bg-secondary position-relative"
              style={{ minHeight: "150px" }}
            >
              {showLoader ? (
                <div className="overlapping-loader">
                  <Loader />
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-8  order-2 order-md-1">
                    {this.renderCartItems()}

                    {order.method == "CASH_COLLECTION" && (
                      <div className="mt-3">
                        {this.renderCashCollectionForm()}
                      </div>
                    )}

                    {order.method == "PAYPRO" && (
                      <div className="mt-3">{this.renderPayProFormForm()}</div>
                    )}
                  </div>

                  <div className="col-md-4 order-1 order-md-2">
                    {this.renderOrderDetail()}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToprops = (dispatch) => ({
  getOrder: (params) => dispatch(getOrder(params)),
  refundOrder: (params) => dispatch(refundOrder(params)),
  completeCashCheckout: (params) => dispatch(completeCashCheckout(params)),
  initiateCashCollection: (params) => dispatch(initiateCashCollection(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(OrderDetail);
