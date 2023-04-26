import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const regex = new RegExp("^/course/.*/.*", "i");
      const passed = regex.test(this.props.location.pathname);
      if (passed) {
        window.scrollTo(0, 400);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }

  render() {
    return <React.Fragment />;
  }
}

export default withRouter(ScrollToTop);
