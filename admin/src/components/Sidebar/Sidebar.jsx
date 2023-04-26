import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { basePath } from "../../configs";
import { connect } from "react-redux";
import { signoutUser } from "../../store/api/auth";
class Sidebar extends React.Component {
  //
  state = {
    collapseOpen: false,
    navItems: [
      { icon: "ni ni-planet text-blue", name: "Dashboard", link: "/dashboard" },

      { icon: "ni ni-single-02 text-danger", name: "Users", link: "/users" },
      {
        icon: "ni ni-bullet-list-67 text-orange",
        name: "Categories",
        link: "/categories",
      },
      {
        icon: "ni ni-bullet-list-67 text-orange",
        name: "Blog Categories",
        link: "/blog_categories",
      },
      {
        icon: "ni ni-bullet-list-67 text-primary",
        name: "Languages",
        link: "/languages",
      },

      {
        icon: "ni ni-bullet-list-67 text-dark",
        name: "Levels",
        link: "/levels",
      },

      {
        icon: "ni ni-book-bookmark text-orange",
        name: "Courses",
        link: "/courses",
      },
      {
        icon: "ni ni-book-bookmark text-orange",
        name: "Feedbacks",
        link: "/course_feedbacks",
      },
      {
        icon: "ni ni-book-bookmark text-orange",
        name: "Subscription Plans",
        link: "/subscription_plans",
      },

      {
        icon: "ni ni-book-bookmark text-danger",
        name: "Coupons",
        link: "/coupons",
      },
      {
        icon: "ni ni-book-bookmark text-danger",
        name: "Events & Webinars",
        link: "/events",
      },
      {
        icon: "ni ni-book-bookmark text-danger",
        name: "Orders",
        link: "/orders",
      },
      {
        icon: "ni ni-book-bookmark text-danger",
        name: "Trial Requests",
        link: "/trial_requests",
      },
      {
        icon: "ni ni-book-bookmark text-danger",
        name: "Enrollments",
        link: "/enrollments",
      },
      {
        icon: "ni ni-bullet-list-67 text-primary",
        name: "Free Videos",
        link: "/cms/free_videos",
      },
      { type: "heading", heading: "Web CMS" },
      {
        icon: "ni ni-collection text-success",
        name: "Common Data",
        link: "/cms/common_data",
      },

      {
        icon: "ni ni-collection text-success",
        name: "Login Image",
        link: "/cms/login_image",
      },
      {
        icon: "ni ni-collection text-success",
        name: "Register Image",
        link: "/cms/register_image",
      },
      {
        icon: "ni ni-collection text-success",
        name: "Dynamic Pages",
        link: "/cms/dynamic_pages",
      },

      {
        icon: "ni ni-collection text-success",
        name: "Team Members",
        link: "/cms/team_members",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Navbar",
        link: "/cms/navbar",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Info Cards",
        link: "/cms/info_cards",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Course Testimonials",
        link: "/cms/testimonials",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Universities",
        link: "/cms/universities",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Student Reviews",
        link: "/cms/student_reviews",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Statistic Slider",
        link: "/cms/stats",
        ///cms/stats
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Home Sliders",
        link: "/cms/home_sliders",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Home Join Section",
        link: "/cms/home_join_section",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Home Free Video Section",
        link: "/cms/home_free_video_section",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Course Menu",
        link: "/course_menu",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Home Page CMS",
        link: "/cms/home_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "All Courses Page",
        link: "/cms/all_courses_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Free Videos Page CMS",
        link: "/cms/freevideos_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Free Videos Image Section",
        link: "/cms/freevideos_sec",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Subscription Page",
        link: "/cms/subscription_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "About Page CMS",
        link: "/cms/about_page_cms",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "About Story Section",
        link: "/cms/about_story_section",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "About Info Cards",
        link: "/cms/about_info_cards",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Why Page CMS",
        link: "/cms/why_outclass_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Why Page Boards",
        link: "/cms/why_page_boards",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "How To Pay",
        link: "/cms/how_to_pay",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Payment Methods",
        link: "/cms/payment_methods",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Teacher Page CMS",
        link: "/cms/teacher_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Cart Page",
        link: "/cms/cart",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Contact Page CMS",
        link: "/cms/contact_page",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Contact Info Cards",
        link: "/cms/contact_info_cards",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Faqs",
        link: "/cms/faqs",
      },
      {
        icon: "ni ni-money-coins text-pink",
        name: "Edit Footer",
        link: "/cms/footer",
      },

      {
        icon: "ni ni-money-coins text-pink",
        name: "Footer Links",
        link: "/cms/footer_links",
      },
    ],
  };

  activeRoute = (routeName) => {
    return this.props.location.pathname.indexOf(basePath + routeName) > -1
      ? "active"
      : "";
  };

  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };

  closeCollapse = () => {
    this.setState({
      collapseOpen: false,
    });
  };

  createNavItem = () => {
    const { navItems } = this.state;
    return navItems.map((item, key) => {
      if (item.type === "heading") {
        return (
          <h4 className="ml-4" key={item.heading}>
            {item.heading}
          </h4>
        );
      }
      const active = this.activeRoute(item.link);
      return (
        <NavItem key={key}>
          <Link
            to={basePath + item.link}
            // onClick={this.closeCollapse}
            className={"nav-link " + active}
          >
            <i className={item.icon} />
            {item.name}
          </Link>
        </NavItem>
      );
    });
  };
  render() {
    const { logo } = this.props;
    const { user } = this.props;
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}

          <NavbarBrand className="pt-0">
            <img
              className="navbar-brand-img"
              src={require("../../assets/img/logo.png")}
            />
          </NavbarBrand>

          {/* User */}
          <Nav className="align-items-center d-md-none">
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={user.image} />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.signoutUser();
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img src={require("../../assets/img/logo.png")} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img src={require("../../assets/img/logo.png")} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Navigation */}
            <Nav navbar>{this.createNavItem()}</Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signoutUser: () => dispatch(signoutUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
