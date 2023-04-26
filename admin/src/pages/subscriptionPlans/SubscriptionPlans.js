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
} from "../../store/api/subscriptionPlans";
import { basePath } from "../../configs";

class SubscriptionPlans extends Component {
  state = {
    subscriptionPlans: [],
  };

  componentDidMount = async () => {
    this.props.getPlans({
      onSuccess: (res) => {
        this.setState({ subscriptionPlans: res.data.data });
      },
    });
  };

  deleteItem = (id) => {
    const con = window.confirm("Are you sure you want to delete?");
    if (!con) return;
    this.props.deletePlan({ id });
    this.setState({
      subscriptionPlans: this.state.subscriptionPlans.filter(
        (p) => p._id !== id
      ),
    });
  };

  renderPlans = () => {
    const { subscriptionPlans } = this.state;
    return (
      <ListGroup>
        <SortableList
          data={subscriptionPlans}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          onListSort={(list) => {
            const sorted = list.map((opt, index) => {
              opt.sortOrder = index;
              return opt;
            });
            this.setState({ subscriptionPlans: sorted });
            this.props.rearrangePlans({
              body: { orderIds: sorted.map((s) => s._id) },
            });
          }}
          renderItem={(plan) => {
            return (
              <ListGroupItem className="rounded mb-1">
                <span>{`${plan.name} (${
                  plan.category && plan.category.name
                })`}</span>

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
                      basePath + "/subscription_plans/" + plan._id
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

  render() {
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Card className="shadow">
            <CardHeader>
              <div className="clearfix">
                <h2 className="mb-0 float-left">Subscription Plans</h2>
                <Link
                  to={basePath + "/subscription_plans/add"}
                  className="btn btn-sm btn-primary float-right"
                >
                  <i className="fas fa-plus"></i> Add
                </Link>
              </div>
            </CardHeader>

            <CardBody className="bg-secondary">{this.renderPlans()}</CardBody>
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
  getPlans: (params) => dispatch(getPlans(params)),
  deletePlan: (params) => dispatch(deletePlan(params)),
  rearrangePlans: (params) => dispatch(rearrangePlans(params)),
});

export default connect(mapStateToProps, mapDispatchToprops)(SubscriptionPlans);
