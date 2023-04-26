import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import loadable from "@loadable/component";
import { getMyOrders } from "../store/api/orders";
import Loader from "../components/Loader";
import moment from "moment";
const MyOrdersTable = loadable(
  () => import("../components/Tables/MyOrderTable"),
  {
    ssr: false,
  }
);

const MyOrders = (props) => {
  const dispatch = useDispatch();
  //   const cart = useSelector((state) => state.entities.cart);

  const [showLoader, setShowLoader] = useState(false);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    setShowLoader(true);
    dispatch(
      getMyOrders({
        onSuccess: (res) => {
          setMyOrders(res.data.data);
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

  return (
    <>
      <section className="other_banner">
        <div className="container">
          <h1>My Orders</h1>
        </div>
      </section>
      <div className="position-relative" style={{ minHeight: "200px" }}>
        {showLoader ? (
          renderLoader()
        ) : (
          <div className="container py-5">
            {myOrders.length > 0 ? (
              <MyOrdersTable orders={myOrders} />
            ) : (
              <h1 className="text-center pt-4">No Orders to show</h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
