import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFreeVideosImageSec } from "../store/api/subscriptionPageCms";
import { setSubscriptionModal } from "../store/ui/subscriptionModal";
import { setLoginModalVisibility } from "../store/ui/loginModal";
import storage from "../services/storage";
import renderHTML from "react-render-html";
import { Helmet } from "react-helmet";

const FreeVideos = (props) => {
  const dispatch = useDispatch();
  const [selectedCategory, setStelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const categories = useSelector((state) => state.entities.categories);
  const courses = useSelector((state) => state.entities.courses);
  const authToken = useSelector((state) => state.auth.token);

  const subscriptionPlans = useSelector(
    (state) => state.entities.subscriptionPlans
  );
  const subscriptionPageCMS = useSelector(
    (state) => state.ui.subscriptionPage.data
  );

  const filteredCategoriesList = useMemo(() => {
    return categories.list.filter((cat) => {
      const coursesInCategory = courses.list.filter((c) => {
        return cat._id === c.category._id;
      });
      return coursesInCategory.length > 0;
    });
  }, [categories.list, courses.list]);

  useEffect(() => {
    if (!selectedCategory && filteredCategoriesList[0]) {
      setCategoryName(filteredCategoriesList[0].name);
      setStelectedCategory(filteredCategoriesList[0]._id);
    }
  }, [filteredCategoriesList]);

  useEffect(() => {
    const category = categories.list.find((c) => {
      return c._id === props.match.params.category;
    });
    const name = category ? category.name : categories.list[0].name;
    const id = category ? category._id : categories.list[0]._id;
    if (!selectedCategory) {
      setCategoryName(name);
      setStelectedCategory(id);
    }
    dispatch(getFreeVideosImageSec({}));
  }, []);

  const renderCategories = () => {
    return (
      <>
        {(filteredCategoriesList || []).map((cat) => {
          return (
            <li
              className="nav-item"
              role="presentation"
              key={cat._id + "home course"}
            >
              <a
                className={
                  selectedCategory === cat._id ? "nav-link active" : "nav-link"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setStelectedCategory(cat._id);
                  setCategoryName(cat.name);
                }}
                id="marketing-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="marketing"
                aria-selected="false"
              >
                {cat.name}
              </a>
            </li>
          );
        })}
      </>
    );
  };

  const renderSubscriptionCards = () => {
    if (!selectedCategory) return null;
    const plansForThisCategory = subscriptionPlans.list.filter(
      (sp) => sp.category._id === selectedCategory
    );

    return (
      <div className="row justify-content-center">
        {plansForThisCategory.map((subscriptinPlan) => {
          return (
            <div className="col-sm-4 mt-3">
              <div className="mx-5 mx-md-0">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (!authToken) {
                      dispatch(setLoginModalVisibility(true));
                      storage.store("GO_TO_SUBSCRIPTION", {
                        visible: true,
                        category: selectedCategory,
                        plan,
                      });
                      return;
                    }

                    dispatch(
                      setSubscriptionModal({
                        visible: true,
                        category: selectedCategory,
                        plan: subscriptinPlan,
                      })
                    );
                  }}
                >
                  <img className="w-100" src={subscriptinPlan.cardImage} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <meta property="og:title" content={subscriptionPageCMS.metaTitle} />
        <meta
          name="description"
          content={subscriptionPageCMS.metaDescription}
        />
        <meta name="keywords" content={subscriptionPageCMS.metaKeyWords} />
      </Helmet>

      <div className="container" style={{ marginTop: "200px" }}>
        <img className="w-100" src={subscriptionPageCMS.image} />
      </div>
      <div className="container">
        <h2 className="text-center mt-4">{subscriptionPageCMS.heading}</h2>
      </div>
      <div className="container mt-2 subscription-page-top-text">
        {renderHTML(subscriptionPageCMS.text)}
      </div>

      <div>
        <section className="popular">
          <div className="bg_cover">
            <div className="container">
              <h2>
                {categoryName ? categoryName + " " : "All "}Subscription Plans
              </h2>
              <ul className="nav nav-tabs" id="courseTab" role="tablist">
                {renderCategories()}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="container">
        <div
          className="home_sub_top_text"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <div>{renderHTML(subscriptionPageCMS.text2)}</div>
        </div>
      </div>

      <div className="container mb-5" style={{ marginTop: "30px" }}>
        {renderSubscriptionCards()}
      </div>
    </>
  );
};

FreeVideos.loadData = ({ store, matchedRoute }) => {
  const { token } = store.getState().auth;
  const { dispatch } = store;
  const promiseArray = [];
  // if (token) {

  // }
  promiseArray.push(dispatch(getFreeVideosImageSec({})));
  return Promise.all(promiseArray);
};

export default FreeVideos;
