import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

export default (props) => {
  const { orders } = props;

  useEffect(() => {
    $("#myOrderTable").DataTable();
  }, []);

  return (
    <table
      id="myOrderTable"
      className="table table-striped table-bordered"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>Order Date</th>
          <th>Payment Method</th>
          <th>Payment Done</th>
          <th>Coupon</th>
          <th>Total Amount</th>
          <th>Amount Paid</th>
          <th>Checkout Completed</th>
          <th>Enrollment Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((ord, ordIndex) => {
          return (
            <tr key={`${ord._id} ${ordIndex}`}>
              <td>{moment(ord.createdAt).format("D MMM, YYYY")}</td>
              <td>{ord.method}</td>
              <td>{ord.paymentDone ? "Done" : "Pending"}</td>
              <td>{ord.couponApplied}</td>
              <td>{ord.totalAmount}</td>
              <td>{ord.amountPayed}</td>
              <td>{ord.checkoutCompleted ? "Completed" : "Pending"}</td>
              <td>{ord.courseEnroled ? "Enrolled" : "Pending"}</td>
              <td>
                <Link
                  className="btn btn-secondary"
                  to={"/my-orders/" + ord._id}
                >
                  Details
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
