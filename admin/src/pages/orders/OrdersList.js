import React, { Component } from "react";
import { Container, Card, CardHeader, CardBody } from "reactstrap";

import Header from "components/Headers/Header.jsx";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { basePath } from "../../configs";
import { getAllOrders } from "../../store/api/orders";
import Loader from "../../components/Loader";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

class OrdersList extends Component {
  state = {
    orders: [],
    showLoader: true,
  };

  componentDidMount = () => {
    this.loadOrders();
  };

  loadOrders = () => {
    this.props.getAllOrders({
      onSuccess: (res) => {
        this.setState({ orders: res.data.data });
      },
      onEnd: () => {
        this.setState({ showLoader: false });
        setTimeout(() => {
          $("#myOrderTable").DataTable({
            order: [[0, "desc"]],
            language: {
              paginate: {
                next:
                  '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
                previous:
                  '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
              },
            },
          });
        }, 150);
      },
    });
  };

  renderOrdersTable = () => {
    const { orders } = this.state;

    return (
      <table
        id="myOrderTable"
        className="table table-striped table-bordered"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Order Date</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Payment Method</th>
            <th>Payment Done</th>
            <th>Coupon</th>
            <th>Total Amount</th>
            <th>Amount Paid</th>
            <th>Refunded</th>
            <th>Checkout Completed</th>
            <th>Enrollment Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((ord, ordIndex) => {
            let userName = "",
              userEmail = "";

            if (ord.user) {
              if (ord.user.firstName || ord.user.lastName)
                userName = ord.user.firstName + " " + ord.user.lastName;
              if (ord.user.email) userEmail = ord.user.email;
            }
            return (
              <tr key={`${ord._id} ${ordIndex}`}>
                <td data-order={`${moment(ord.createdAt).format("X")}`}>
                  {moment(ord.createdAt).format("D MMM, YYYY")}
                </td>
                <td>{userName}</td>
                <td>{userEmail}</td>
                <td>{ord.method}</td>
                <td>{ord.paymentDone ? "Done" : "Pending"}</td>
                <td>{ord.couponApplied}</td>
                <td>{ord.totalAmount}</td>
                <td>{ord.amountPayed}</td>
                <td>{ord.refunded ? "Refunded" : "Not Refunded"}</td>
                <td>{ord.checkoutCompleted ? "Completed" : "Pending"}</td>
                <td>{ord.courseEnroled ? "Enrolled" : "Pending"}</td>
                <td>
                  <Link
                    className="btn btn-primary"
                    to={basePath + "/orders/" + ord._id}
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

  render() {
    const { showLoader } = this.state;
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Orders</h2>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">
              {showLoader ? (
                <Loader />
              ) : (
                <div style={{ overflowX: "scroll" }}>
                  {this.renderOrdersTable()}
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    cms: { navbar },
  } = state;
  return { navbar };
};
const mapDispatchToprops = (dispatch) => ({
  getAllOrders: (params) => dispatch(getAllOrders(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(OrdersList);
