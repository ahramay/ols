import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import loadable from "@loadable/component";
import { getMyOrder, addPaymentRecipt } from "../store/api/orders";
import Loader from "../components/Loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import moment from "moment";

const MyOrdersTable = loadable(
  () => import("../components/Tables/MyOrderTable"),
  {
    ssr: false,
  }
);

const OrderDetails = (props) => {
  const { orderId } = props.match.params;
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [myOrder, setMyOrder] = useState({
    items: [],
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setShowLoader(true);
    dispatch(
      getMyOrder({
        id: orderId,
        onSuccess: (res) => {
          setImagePreview(res.data.data.paymentReciptImage);
          setMyOrder(res.data.data);
        },
        onEnd: () => {
          setShowLoader(false);
        },
      })
    );
  }, []);

  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderSingleItem = (cartItem) => {
    return (
      <div className="card-body">
        <div className="left_block">
          <img src={cartItem.course.image} alt="" className="img-fluid" />
        </div>
        <div className="right_block">
          <h3>{cartItem.course.name}</h3>
          {!cartItem.completeCourse && renderChapters(cartItem.chapters)}
          {cartItem.completeCourse && (
            <div className="badge badge-success badge-lg mx-1 mt-1 float-left p-2 font-weight-normal">
              Complete Course
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBundleItem = (cartItem) => {
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

  const renderCartItems = () => {
    return (
      <>
        {myOrder.items.map((cartItem, cartItemIndex) => {
          return (
            <tr key={cartItem._id + "cart page item" + cartItemIndex}>
              <td>
                <div className="card">
                  {cartItem.itemType === "BUNDLE"
                    ? renderBundleItem(cartItem)
                    : renderSingleItem(cartItem)}
                </div>
              </td>
              {/* <td>{cartItem.price} Rs.</td> */}
              <td>{cartItem.price} Rs.</td>
            </tr>
          );
        })}
      </>
    );
  };

  const renderChapters = (chapters) => {
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

  const renderCashCollectionForm = () => {
    const { cashCollectionDetail = {} } = myOrder;
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

  const renderPayProFormForm = () => {
    const { payproPaymentDetails = {}, payproDetails = {} } = myOrder;
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

  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>My Order</h1>
        </div>
      </section>
      <div className="position-relative" style={{ minHeight: "200px" }}>
        {showLoader ? (
          renderLoader()
        ) : (
          <div className="container py-5">
            <h3>Items</h3>

            <section
              className="pro_cart position-relative"
              style={{ paddingTop: "10px" }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-md-8 order-2 order-md-1">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            {/* <th scope="col">Total</th> */}
                          </tr>
                        </thead>
                        <tbody>{renderCartItems()}</tbody>
                      </table>
                    </div>

                    {myOrder.method == "CASH_COLLECTION" &&
                      renderCashCollectionForm()}

                    {myOrder.method === "PAYPRO" && renderPayProFormForm()}
                  </div>

                  <div className="col-md-4 order-1 order-md-2">
                    <div className="bill">
                      <div className="card">
                        <div className="card-body">
                          <h5>Order Details</h5>
                          <table className="table table-borderless ">
                            <tbody>
                              <tr>
                                <td>Payment Method</td>
                                <td>{myOrder.method} </td>
                              </tr>
                              <tr>
                                <td>Subtotal</td>
                                <td>{myOrder.totalAmount} Rs.</td>
                              </tr>

                              {myOrder.couponApplied && (
                                <tr className="discount">
                                  <td>Coupon</td>
                                  <td>{myOrder.couponApplied}</td>
                                </tr>
                              )}
                              <tr className="discount">
                                <td>Discount</td>
                                <td>
                                  {myOrder.totalAmount - myOrder.amountPayed}{" "}
                                  Rs.
                                </td>
                              </tr>

                              <tr>
                                <th>Total</th>
                                <th>{myOrder.amountPayed} Rs.</th>
                              </tr>
                            </tbody>
                          </table>

                          {imagePreview && (
                            <img src={imagePreview} className="w-100" />
                          )}
                          {myOrder.method === "CASH_COLLECTION" && (
                            <label>
                              <span className="btn btn-primary m-2">
                                Add Payment Receipt
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="d-none"
                                multiple={false}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = function () {
                                      setImagePreview(reader.result);
                                    };

                                    const formData = new FormData();
                                    formData.append("image", file);

                                    dispatch(
                                      addPaymentRecipt({
                                        body: formData,
                                        id: myOrder._id,
                                        onSuccess: () => {
                                          alert("Payment Receipt Submitted");
                                        },
                                      })
                                    );
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetails;
