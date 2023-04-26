import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import renderHTML from "react-render-html";
import { useDispatch, useSelector } from "react-redux";
import { setSubscriptionModal } from "../../store/ui/subscriptionModal";

import { addBundleToCartApi } from "../../store/api/cart";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { formatPrice } from "../../helpers/priceFormater";

const SubscriptionModal = () => {
  const history = useHistory();
  const [modalStep, setModalStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedPricePlan, setSelectedPricePlan] = useState({});

  const dispatch = useDispatch();
  const subscriptionPlans = useSelector(
    (state) => state.entities.subscriptionPlans
  );
  const subscriptionModal = useSelector((state) => state.ui.subscriptionModal);
  const subscriptionPageCMS = useSelector(
    (state) => state.ui.subscriptionPage.data
  );

  const courses = useSelector((state) => state.entities.courses.list);
  const categories = useSelector((state) => state.entities.categories.list);

  const closeModal = () => {
    dispatch(setSubscriptionModal({ visible: false }));
  };

  const selectedCategory = categories.find(
    (c) => c._id === subscriptionModal.category
  );

  const plansForThisCategory = subscriptionPlans.list.filter(
    (sp) => sp.category._id === subscriptionModal.category
  );
  const filteredCourses = React.useMemo(() => {
    const { category } = subscriptionModal;
    return courses.filter((c) => c.category._id === category);
  }, [categories, courses, subscriptionModal.category]);

  let MAX_COURSE_SELECTION = subscriptionModal.plan.numberOfCourses;

  useEffect(() => {
    setModalStep(1);
  }, [subscriptionModal.visible]);

  useEffect(() => {
    setSelectedCourses([]);
    if (
      subscriptionModal.plan &&
      subscriptionModal.plan.pricePlans &&
      subscriptionModal.plan.pricePlans[0]
    ) {
      setSelectedPricePlan(subscriptionModal.plan.pricePlans[0]);
    }
  }, [subscriptionModal.plan]);

  const renderCoursesList = () => {
    return (
      <div className="courses-check-list my-3">
        <div className="row">
          {filteredCourses.map((c) => {
            const checked = selectedCourses.includes(c._id);
            return (
              <div className="col-12 col-md-6" key={c._id}>
                <div className="mr-5 mr-md-0">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        color="primary"
                        disabled={
                          !checked &&
                          selectedCourses.length >= MAX_COURSE_SELECTION
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectedCourses.push(c._id);
                            setSelectedCourses([...selectedCourses]);
                          } else {
                            setSelectedCourses(
                              selectedCourses.filter((sc) => sc !== c._id)
                            );
                          }
                        }}
                      />
                    }
                    label={c.name}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectedCoursesList = () => {
    const selectedCoursesList = filteredCourses.filter((c) =>
      selectedCourses.includes(c._id)
    );
    return (
      <div className="courses-check-list mb-3">
        <h4 className="font-weight-bold mt-4">
          {subscriptionPageCMS.coursesSelectedHeading}
        </h4>
        <div className="row">
          {selectedCoursesList.map((sc) => {
            return (
              <div className="col-12 mr-5 mr-md-0" key={sc._id}>
                <FormControlLabel
                  control={<Checkbox checked={true} color="primary" />}
                  label={sc.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPricePlans = () => {
    if (!subscriptionModal.plan || !subscriptionModal.plan.pricePlans)
      return null;

    return (
      <div className="sub-modal-wrapper px-4">
        <div className="row justify-content-center">
          {subscriptionModal.plan.pricePlans.map((pPlan) => {
            return (
              <div className="col-sm-4" key={pPlan._id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPricePlan(pPlan);
                  }}
                  style={{ textDecoration: "none" }}
                  className="text-dark"
                >
                  <div
                    className={`plan-btn ${
                      pPlan._id === selectedPricePlan._id && "active"
                    }`}
                  >
                    <span className="text-center mb-1">
                      {pPlan.accessText && renderHTML(pPlan.accessText.trim())}
                    </span>
                    <h4 className="text-center mb-1 font-weight-bold">
                      Rs. {pPlan.price && formatPrice(pPlan.price)}
                    </h4>
                    <span className="text-center mb-0 text-danger">
                      {pPlan.saleText && renderHTML(pPlan.saleText.trim())}
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center my-3">
          {selectedPricePlan.bottomAccessText &&
            renderHTML(selectedPricePlan.bottomAccessText)}
        </p>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <>
        <div className="sub-modal-wrapper px-4">
          <div className="row justify-content-center py-4">
            {plansForThisCategory.map((thisCatPlan) => {
              const isPlanSelected =
                subscriptionModal.plan._id === thisCatPlan._id;
              return (
                <div className="d-flex justify-content-center col-4">
                  <a
                    href="#"
                    style={{
                      border: "2px solid #00acf0",
                      borderRadius: "5px",
                      padding: "10px 20px",
                      color: isPlanSelected ? "#ffffff" : "#00acf0",
                      background: isPlanSelected ? "#00acf0" : "#ffffff",
                      textDecoration: "none",
                      fontWeight: "bold",
                      margin: "auto",
                      marginTop: "10px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSubscriptionModal({ plan: thisCatPlan }));
                    }}
                  >
                    {/* <img src={thisCatPlan.smallImage} className="w-100" /> */}
                    {thisCatPlan.name && thisCatPlan.name.toUpperCase()} PLAN
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container">
          <div className="text-center">
            {subscriptionModal.plan.chooseText ? (
              renderHTML(subscriptionModal.plan.chooseText)
            ) : (
              <h2 className="text-center pt-4">
                You can choose{" "}
                <span className="text-main">ANY {MAX_COURSE_SELECTION}</span>
                {" " + selectedCategory?.name + " "}
                Courses
              </h2>
            )}
          </div>
          {renderCoursesList()}
        </div>

        {renderPricePlans()}
        <div className="d-flex justify-content-center">
          <button
            href="#"
            className="next-btn"
            disabled={selectedCourses.length !== MAX_COURSE_SELECTION}
            onClick={(e) => {
              e.preventDefault();
              setModalStep(2);
            }}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <div>
        <h1 className="text-center mt-3">{subscriptionPageCMS.topHeading}</h1>

        <div className="sub-modal-wrapper">
          <div className="row">
            <div className="col-md-6">{renderSelectedCoursesList()}</div>
            <div className="col-md-6">
              <h4 className="font-weight-bold mt-4">
                {subscriptionModal.plan &&
                  subscriptionModal.plan.name.toUpperCase()}{" "}
                PLAN
              </h4>
              <div className="sub-details px-4 pt-3 pb-2 mb-4 ">
                <p className="text-lg">
                  {subscriptionPageCMS.priceLabel}{" "}
                  {selectedPricePlan && formatPrice(selectedPricePlan.price)}{" "}
                </p>
                <h5>{subscriptionPageCMS.confirmation}</h5>

                <p className="mt-4">{subscriptionPageCMS.subPer}</p>
                <h5>
                  {selectedPricePlan && selectedPricePlan.numberOfDays} Days
                  from payment.
                </h5>
              </div>
            </div>
          </div>

          <h4 className="font-weight-bold mt-4 text-center">
            {subscriptionPageCMS.bottomHeading}
          </h4>

          <div className="d-flex justify-content-center mt-5">
            <button
              href="#"
              className="next-btn"
              onClick={(e) => {
                e.preventDefault();
                const body = {
                  courses: selectedCourses,
                  subscriptionType: subscriptionModal.subscriptionType,
                  bundlePrice: selectedPricePlan.price,
                  numberOfDays: selectedPricePlan.numberOfDays,
                };
                dispatch(
                  addBundleToCartApi({
                    body,
                    onSuccess: (res) => {
                      closeModal();
                      history.push("/cart");
                    },
                    onError: (err) => {
                      alert("Something went wrong");
                    },
                    onEnd: () => {
                      console.log("On End");
                    },
                  })
                );
              }}
            >
              Confirm
            </button>
            <button
              href="#"
              className="sub-back-btn ml-4"
              onClick={(e) => {
                e.preventDefault();
                setModalStep(1);
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal show={subscriptionModal.visible} onHide={closeModal}>
      <a
        href="#"
        className="text-dark"
        onClick={(e) => {
          e.preventDefault();
          closeModal();
        }}
        className="modal-close-btn"
      >
        <i className="fas fa-times"></i>
      </a>
      <div className="container">
        {modalStep === 1 ? renderStep1() : renderStep2()}
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
