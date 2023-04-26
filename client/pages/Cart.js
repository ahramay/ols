import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../shared/TextError";
import {
  deleteCartItem,
  checkoutCashCollection,
  createBankAlfalahSession,
  //paypro
  checkoutPayPro,
} from "../store/api/cart";
import Loader from "../components/Loader";
import { getMyCart } from "../store/api/cart";
import { handleErrors } from "../helpers/error";
import PhoneInput from "../components/PhoneInput";

import { loadCartPageCMS } from "../store/api/cartCms";
import { formatPrice } from "../helpers/priceFormater";

import renderHTML from "react-render-html";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.entities.cart);
  const [couponCode, setCouponCode] = useState(cart.coupon || "");
  useEffect(() => {
    setCouponCode(cart.coupon);
  }, [cart]);

  const [cartLoader, setCartLoader] = useState(false);

  const [cartCms, setCartCms] = useState({
    heading1: "",
    text1: "",
    heading2: "",
    text2: "",
    heading3: "",
    text3: "",
  });

  useEffect(() => {
    dispatch(getMyCart());

    //
    dispatch(
      loadCartPageCMS({
        onSuccess: (res) => {
          setCartCms(res.data.data);
        },
      })
    );
  }, props);

  const trackGtag = (paymentMethod) => {
    if (window.gtag) {
      gtag("event", "conversion", {
        send_to: "AW-458348445/4MTOCNKе6u8CEJ2vx90B",
        value: parseFloat(cart.price),
        currency: "PKR",
        transaction_id: "",
        paymentMethod,
      });
    }
  };
  const applyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setCartLoader(true);
    dispatch(
      getMyCart({
        couponCode,
        onError: (err) => {
          handleErrors(err);
        },
        onEnd: () => {
          setCartLoader(false);
        },
      })
    );
  };

  const removeCoupon = (e) => {
    e.preventDefault();
    setCartLoader(true);
    dispatch(
      getMyCart({
        removeCoupon: 1,
        onError: (err) => {
          handleErrors(err);
        },
        onEnd: () => {
          setCartLoader(false);
        },
      })
    );
  };
  //overlapping Loader
  const renderLoader = () => {
    return (
      <div className="overlapping-loader">
        <Loader />
      </div>
    );
  };

  const renderCartItems = () => {
    return (
      <>
        {cart.items.map((cartItem, cartItemIndex) => {
          return (
            <tr key={cartItem._id + "cart page item" + cartItemIndex}>
              <td scope="row">
                <a
                  onClick={() => {
                    dispatch(deleteCartItem({ id: cartItem._id }));
                  }}
                >
                  <i className="fal fa-times"></i>
                </a>
              </td>
              <td>
                <div className="card">
                  {cartItem.itemType === "BUNDLE"
                    ? renderBundleItem(cartItem)
                    : renderSingleItem(cartItem)}
                </div>
              </td>
              {/* <td>{cartItem.price} Rs.</td> */}
              <td>{`Rs. ${formatPrice(cartItem.price)}`}</td>
            </tr>
          );
        })}
      </>
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

  const renderPayProForm = () => {
    return (
      <Formik
        initialValues={{
          name: "",
          phone: "",
          email: "",
          address: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name is required"),
          phone: Yup.string().required("Phone is required"),
          email: Yup.string().required().email("Email is not valid."),
          address: Yup.string().required("Address is required"),
        })}
        onSubmit={(form) => {
          setCheckoutLoader(true);
          trackGtag("Direct Bank Transfer");
          dispatch(
            checkoutPayPro({
              body: form,
              onSuccess: () => {
                props.history.replace("/my-orders");
              },
              onEnd: () => {
                setCheckoutLoader(false);
              },
            })
          );
        }}
      >
        {({ submitForm, setFieldValue, values }) => {
          return (
            <div className="checkout-form">
              <Form>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                      />
                      <ErrorMessage name="name" component={TextError} />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <div className="covering">
                        <PhoneInput
                          value={values.phone}
                          placeholder="Phone"
                          onChange={(phone) => {
                            setFieldValue("phone", phone);
                          }}
                        />
                        <ErrorMessage name="phone" component={TextError} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="E-mail"
                      />
                      <ErrorMessage name="email" component={TextError} />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Address"
                      />
                      <ErrorMessage name="address" component={TextError} />
                    </div>
                  </div>

                  <div className="col-12 text-right">
                    <a onClick={submitForm} className="btn more">
                      Checkout
                    </a>
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    );
  };

  const renderCashCollectionForm = () => {
    return (
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          address: "",
          address2: "",
          city: "",
          country: "",
          phone: "",
          email: "",
          otherInstructions: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("First Name is required"),
          lastName: Yup.string().required("Last Name is required"),
          address: Yup.string().required("Address is required"),
          address2: Yup.string().optional(),
          city: Yup.string().required("City is required"),
          country: Yup.string().required("Country is required"),
          phone: Yup.string().required("Phone is required"),
          email: Yup.string().required().email("Email is not valid."),
          otherInstructions: Yup.string().optional(),
        })}
        onSubmit={(form) => {
          setCheckoutLoader(true);
          trackGtag("Cash Collection");
          dispatch(
            checkoutCashCollection({
              body: form,
              onSuccess: () => {
                props.history.replace("/my-orders");
              },
              onEnd: () => {
                setCheckoutLoader(false);
              },
            })
          );
        }}
      >
        {({ submitForm, setFieldValue, values }) => {
          return (
            <div className="checkout-form">
              <Form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="firstName"
                        className="form-control"
                        placeholder="First Name *"
                      />
                      <ErrorMessage name="firstName" component={TextError} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="Last Name *"
                      />
                      <ErrorMessage name="lastName" component={TextError} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Street Address*"
                      />
                      <ErrorMessage name="address" component={TextError} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="address2"
                        className="form-control"
                        placeholder="Apartment, suit, unit etc.(Optional)"
                      />
                      <ErrorMessage name="address2" component={TextError} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="City*"
                      />
                      <ErrorMessage name="city" component={TextError} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="country"
                        className="form-control"
                        placeholder="Country*"
                      />
                      <ErrorMessage name="country" component={TextError} />
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
                        <PhoneInput
                          value={values.phone}
                          placeholder="Phone"
                          onChange={(phone) => {
                            setFieldValue("phone", phone);
                          }}
                        />
                        <ErrorMessage name="phone" component={TextError} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="E-mail"
                      />
                      <ErrorMessage name="email" component={TextError} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="otherInstructions"
                        className="form-control"
                        placeholder="Other Instruction"
                      />
                      <ErrorMessage
                        name="otherInstructions"
                        component={TextError}
                      />
                    </div>
                  </div>
                  <div className="col-12 text-right">
                    <a onClick={submitForm} className="btn more">
                      Checkout
                    </a>
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    );
  };

  const [checkoutLoader, setCheckoutLoader] = useState(false);
  const [currentPaymentOption, setCurrentPaymentOption] = useState("card");

  const renderPaymentMethods = () => {
    return (
      <div className="position-relative">
        {checkoutLoader && renderLoader()}
        <div className="payment_options">
          <div className="accordion" id="accordionExample">
            <div className="card">
              <div className="card-header" id="headingThree">
                <h2 className="mb-0">
                  <button
                    className="btn btn-block text-left collapsed"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded={currentPaymentOption === "card"}
                    aria-controls="collapseThree"
                    onClick={() => {
                      setCurrentPaymentOption("card");
                    }}
                  >
                    {cartCms.heading1}
                  </button>
                </h2>
              </div>
              <div
                id="collapseThree"
                className="collapse"
                aria-labelledby="headingThree"
                data-parent="#accordionExample"
                className={
                  currentPaymentOption === "card" ? "collapse show" : "collapse"
                }
              >
                <div className="card-body">
                  {cartCms.text1 && renderHTML(cartCms.text1)}
                  <div id="card-checkout">
                    <a
                      className="btn btn-primary"
                      onClick={() => {
                        trackGtag("Card Payment");
                        setCheckoutLoader(true);

                        dispatch(
                          createBankAlfalahSession({
                            onSuccess: (res) => {
                              Checkout.configure({
                                session: {
                                  id: res.data.data.sessionId,
                                  version: res.data.data.sessionVersion,
                                },

                                order: {
                                  amount: parseFloat(cart.price),
                                  currency: "PKR",
                                  description: "Order Goods",
                                  id: res.data.data.orderId,
                                },

                                interaction: {
                                  operation: "PURCHASE",
                                  merchant: {
                                    name: "OUT-CLASS",
                                    address: {
                                      line1: "200 Sample St",
                                      line2: "1234 Example Town",
                                    },
                                  },
                                },

                                merchant: "OUTCLASSLEAR",
                              });

                              Checkout.showPaymentPage();
                            },
                            onEnd: () => {
                              setCheckoutLoader(false);
                            },
                          })
                        );
                      }}
                    >
                      Pay with Credit Card
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header" id="headingOne">
                <h2 className="mb-0">
                  <button
                    className="btn btn-block text-left"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded={currentPaymentOption === "paypro"}
                    aria-controls="collapseOne"
                    onClick={() => {
                      setCurrentPaymentOption("paypro");
                    }}
                  >
                    {cartCms.heading2}
                  </button>
                </h2>
              </div>

              <div
                id="collapseOne"
                className={
                  currentPaymentOption === "paypro"
                    ? "collapse show"
                    : "collapse"
                }
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  {cartCms.text2 && renderHTML(cartCms.text2)}

                  {/* <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      dispatch(
                        checkoutPayPro({
                          onSuccess: (res) => {
                            console.log("CHECKOUT +> ", res);
                          },
                        })
                      );
                    }}
                  >
                    Pay with Paypro
                  </button> */}

                  {renderPayProForm()}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header" id="headingOne">
                <h2 className="mb-0">
                  <button
                    className="btn btn-block text-left"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded={currentPaymentOption === "cash"}
                    aria-controls="collapseOne"
                    onClick={() => {
                      setCurrentPaymentOption("cash");
                    }}
                  >
                    {cartCms.heading3}
                  </button>
                </h2>
              </div>

              <div
                id="collapseOne"
                className={
                  currentPaymentOption === "cash" ? "collapse show" : "collapse"
                }
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  {cartCms.text3 && renderHTML(cartCms.text3)}
                  {renderCashCollectionForm()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const taxAmount = cart.totalAmount - cart.totalAmount / 1.16;
  const subTotal = cart.totalAmount - taxAmount;
  const discount = cart.totalAmount - cart.price;

  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>Cart</h1>
        </div>
      </section>
      {cart.items.length > 0 ? (
        <>
          <section className="pro_cart position-relative">
            {cartLoader && renderLoader()}
            <div className="container">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      {/* <th scope="col">Total</th> */}
                    </tr>
                  </thead>
                  <tbody>{renderCartItems()}</tbody>
                </table>
              </div>
              <div className="row">
                <div className="col-lg-6 offset-lg-6 col-md-8 offset-md-4 col-12">
                  <form onSubmit={applyCoupon}>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-12">
                        <div className="input-group ">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      {/* removeCoupon */}
                      <div className="col-lg-3 col-md-3 col-6">
                        <button className="btn more" type="submit">
                          Apply
                        </button>
                      </div>

                      <div className="col-lg-3 col-md-3 col-6">
                        <button
                          className="btn more btn-danger bg-danger"
                          onClick={removeCoupon}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="payment_method">
            <div className="container">
              <div className="row">
                <div className="col-lg-9  col-12">{renderPaymentMethods()}</div>
                <div className="col-lg-3  col-12">
                  <div className="bill">
                    <div className="card">
                      <div className="card-body">
                        <h5>Cart totals:</h5>
                        <table className="table table-borderless ">
                          <tbody>
                            <tr>
                              <td>Subtotal</td>
                              <td>
                                {`Rs. ${formatPrice(
                                  isDecimal(subTotal)
                                    ? subTotal.toFixed(2)
                                    : subTotal
                                )}`}
                              </td>
                            </tr>

                            <tr className="discount">
                              <td>Tax</td>
                              <td>{` Rs. ${formatPrice(
                                isDecimal(taxAmount)
                                  ? taxAmount.toFixed(2)
                                  : taxAmount
                              )}`}</td>
                            </tr>

                            <tr className="discount">
                              <td>Discount</td>
                              <td>{` Rs. ${formatPrice(discount)}`}</td>
                            </tr>
                            <tr>
                              <td colspan="2">
                                <hr />
                              </td>
                            </tr>
                            <tr>
                              <th>Total</th>
                              <th>{`Rs. ${formatPrice(cart.price)}`}</th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div style={{ paddingTop: "100px" }} className="pb-5">
          <h1 className="text-center">Cart is empty</h1>
        </div>
      )}
    </>
  );
};

export default Cart;

function isDecimal(num) {
  return num % 1 != 0;
}
