import React, { Component } from "react";
import {
  Button,
  Container,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import Header from "components/Headers/Header.jsx";
import SortableList from "../../components/sortable/SortableList";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  getPlans,
  rearrangePlans,
  deletePlan,
} from "../../store/api/pricePlans";
import { basePath } from "../../configs";

class SubscriptionPlans extends Component {
  state = {
    pricePlans: [],
  };

  componentDidMount = async () => {
    const { subscriptionPlan } = this.props;
    this.props.getPlans({
      subscriptionPlan,
      onSuccess: (res) => {
        this.setState({ pricePlans: res.data.data });
      },
    });
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.deletePlan({ id });
    this.setState({
      pricePlans: this.state.pricePlans.filter((p) => p._id !== id),
    });
  };

  render = () => {
    const { pricePlans } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={pricePlans}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          onListSort={(list) => {
            const sorted = list.map((opt, index) => {
              opt.sortOrder = index;
              return opt;
            });
            this.setState({ pricePlans: sorted });
            this.props.rearrangePlans({
              body: { orderIds: sorted.map((s) => s._id) },
            });
          }}
          renderItem={(plan) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <span>{`Rs.${plan.price}, ${plan.numberOfDays} Days`}</span>

                <Button
                  color="danger"
                  size="sm"
                  className="float-right"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.deleteItem(plan._id);
                  }}
                >
                  <i className="fas fa-trash"></i>
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  className="float-right mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.props.history.push(
                      `${basePath}/price_plans/${this.props.subscriptionPlan}/${plan._id}`
                    );
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </Button>
              </ListGroupItem>
            );
          }}
        />
      </ListGroup>
    );
  };
}

const mapStateToProps = (state) => {
  const {
    cms: { navbar },
  } = state;
  return { navbar };
};
const mapDispatchToprops = (dispatch) => ({
  getPlans: (params) => dispatch(getPlans(params)),
  deletePlan: (params) => dispatch(deletePlan(params)),
  rearrangePlans: (params) => dispatch(rearrangePlans(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(SubscriptionPlans);
