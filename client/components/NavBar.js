import React, { createRef, useState } from "react";
import AppHeader from "./AppHeader";
import {
  Navbar,
  Nav,
  Form,
  InputGroup,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import { Link } from "react-router-dom";
import storage from "../services/storage";
import { useSelector } from "react-redux";

let searchLink = createRef();

let toggleRef = null;
const NavBar = (props) => {
  const cart = useSelector((state) => state.entities.cart);
  const courses = useSelector((state) => state.entities.courses);
  const categories = useSelector((state) => state.entities.categories);
  const navMenus = useSelector((state) => state.ui.navbarMenus);
  const activities = useSelector((state) => {
    return state.entities.activities.list;
  });

  const makeCourseParentStructure = () => {
    const courseParents = {};

    courses.list.forEach((co) => {
      if (!courseParents[co.category._id]) courseParents[co.category._id] = [];
      courseParents[co.category._id].push(co);
    });

    const categoryTree = [];

    const parentCategories = categories.list.filter((c) => !c.parent);

    parentCategories.forEach((pc) => {
      categoryTree.push({
        id: pc._id,
        name: pc.name,
        type: "category",
        children: getChildren(pc._id),
      });
    });
    return categoryTree;
  };

  const getChildren = (id) => {
    const children = [];

    const catChildren = categories.list.filter((category) => {
      return id === category.parent;
    });
    catChildren.forEach((category) => {
      children.push({
        name: category.name,
        id: category._id,
        type: "category",
      });
    });

    const courseChildren = courses.list.filter((course) => {
      return id === course.category._id;
    });
    courseChildren.forEach((course) => {
      children.push({
        name: course.name,
        id: course.slug,
        type: "course",
        _id: course._id,
      });
    });

    //deep populating by recurring this function
    children.forEach((chil, index) => {
      if (chil.type === "category")
        children[index].children = getChildren(chil.id);
    });
    return children;
  };

  const coursesDropdownArray = makeCourseParentStructure();

  const renderCoursesDropdown = (items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <DropdownSubmenu key={item.id} title={item.name}>
            {renderCoursesDropdown(item.children)}
          </DropdownSubmenu>
        );
      } else {
        if (item.type !== "course") return;
        let courseLink = "";

        let thisActivity;
        if (item.type === "course") {
          thisActivity = activities.find((ac) => {
            return item._id == ac.course;
          });

          courseLink = thisActivity
            ? `/course/${item.id}/${thisActivity.lesson.slug}`
            : `/course/${item.id}`;
        }

        return (
          <NavDropdown.Item
            key={item.id}
            // to={courseLink}
            onClick={() => {
              if (thisActivity && thisActivity.lesson.type === "video") {
                storage.store("continue_video", thisActivity.duration);
              }

              props.history.push(courseLink);
              toggleNavBar();
            }}
          >
            {item.name}
          </NavDropdown.Item>
        );
      }
    });
  };

  const [searchString, setSearchString] = useState("");

  const toggleNavBar = () => {
    if (toggleRef) toggleRef.click();
  };
  return (
    <>
      <header id="header" className="home_header sticky-top">
        <Link
          className="d-none"
          to={"/search/" + searchString}
          ref={searchLink}
          onClick={toggleNavBar}
        />
        <AppHeader />

        <Navbar className="main_nav" expand="lg">
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            ref={(ref) => {
              toggleRef = ref;
            }}
          />
          <Link
            className=" d-block  custom_link d-sm-block d-md-block position-relative d-lg-none"
            to="/cart"
            onClick={toggleNavBar}
          >
            {cart && cart.items && cart.items != 0 ? (
              <span
                className="badge badge-warning badge-sm position-absolute"
                style={{ top: "-3px", right: "-3px" }}
              >
                {cart.items.length || 0}
              </span>
            ) : null}
            <i className="fal fa-shopping-cart"></i>
          </Link>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              className="navbar-nav justify-content-center mx-auto"
              id="primary-menu"
            >
              {navMenus.list.map((nm) => {
                return nm.name.toLowerCase().trim() === "courses" ? (
                  <NavDropdownMenu
                    title="Courses"
                    id="collasible-nav-dropdown"
                    key={nm._id}
                    className="navbar_courses"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/all-courses"
                      onClick={toggleNavBar}
                      className="navbar_all_courses"
                    >
                      All Courses
                    </NavDropdown.Item>
                    {renderCoursesDropdown(coursesDropdownArray)}
                  </NavDropdownMenu>
                ) : (
                  <Nav.Item as="li" key={nm._id}>
                    <Nav.Link as={Link} to={nm.link} onClick={toggleNavBar}>
                      {nm.name}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}

              <Nav.Item as="li">
                <Form
                  className="form-inline"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!searchString) return;
                    if (searchLink.current) searchLink.current.click();
                    toggleNavBar();
                  }}
                >
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Search Courses"
                      onChange={(e) => {
                        setSearchString(e.target.value.trim());
                      }}
                    />
                    <InputGroup.Prepend>
                      <Button className="btn btn-submit" type="submit">
                        <i className="far fa-search"></i>
                      </Button>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Form>
              </Nav.Item>
              <Nav.Item
                as="li"
                className="  d-none  d-sm-none d-md-none d-lg-block"
              >
                <Nav.Link as={Link} className="position-relative" to="/cart">
                  {cart && cart.items && cart.items != 0 ? (
                    <span
                      className="badge badge-warning badge-sm position-absolute"
                      style={{ top: "-3px", right: "-3px" }}
                    >
                      {cart.items.length || 0}
                    </span>
                  ) : null}
                  <i className="fal fa-shopping-cart"></i>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
};

export default NavBar;
