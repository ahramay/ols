import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import AdminFooter from "components/Footers/AdminFooter.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import { authenticatedRoutes } from "../routes";
import { basePath } from "../configs";
import {connect} from "react-redux"
import {getPages} from "../store/api/dynamicPages"

class Admin extends React.Component {

  componentDidMount = () => {
    this.props.getPages({})
  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          logo={{
            innerLink: "/admin/index",
            imgSrc: "",
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar {...this.props} brandText="Outclass" />
          <Suspense fallback={<div>loading...</div>}>
            <Switch>
              {authenticatedRoutes.map((route) => {
                const { path, component: Component, exact = true } = route;
                return (
                  <Route
                    path={basePath + path}
                    key={path}
                    exact={true}
                    component={Component}
                  />
                );
              })}
            </Switch>
          </Suspense>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {}
}
const mapDispatchToProps = dispatch => {
  return {
    getPages: params => dispatch(getPages(params))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Admin);
