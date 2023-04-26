import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import LogoImage from "../assets/temp/logo.png";
import storage from "../services/storage";
//redux actions
import { setUser, setToken } from "../store/auth/authReducer";
import { setLoginModalVisibility } from "../store/ui/loginModal";
import { setRegisterModalVisibility } from "../store/ui/registerModal";
import { Link } from "react-router-dom";
import { signoutUser } from "../store/api/auth";

function AppHeader(props) {
  const dispatch = useDispatch();
  const commonData = useSelector((state) => state.ui.commonData);
  const user = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);
  const showLoginModal = () => {
    dispatch(setLoginModalVisibility(true));
  };
  const showRegisterModal = () => {
    dispatch(setRegisterModalVisibility(true));
  };

  //read user from localstorage
  useEffect(() => {
    const user = storage.get("user");
    const token = storage.get("xAuthToken");
    dispatch(setToken(token));
    dispatch(setUser(user));
  }, []);
  return (
    <nav className="navbar navbar-light top_nav">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={commonData.logo} alt="Logo" className="img-fluid" />
        </Link>

        {authToken ? (
          <Dropdown>
            <Dropdown.Toggle
              as={React.forwardRef(({ children, onClick }, ref) => (
                <a
                  ref={ref}
                  onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <span className="mr-2">My Account</span>
                  <div
                    className="user-nav-img"
                    style={{ backgroundImage: `url("${user.image}")` }}
                  ></div>
                </a>
              ))}
              id="dropdown-custom-components dropdown-button-drop-left"
            />

            <Dropdown.Menu>
              <Dropdown.Item>{`${user.firstName} ${user.lastName}`}</Dropdown.Item>

              <Dropdown.Item as={Link} to="/dashboard">
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/my-orders">
                My Orders
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  dispatch(signoutUser());
                }}
              >
                Signout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <ul className="nav ml-auto login_user">
            <li className="nav-item">
              <a className="nav-link" onClick={showLoginModal}>
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link btn" onClick={showRegisterModal}>
                Join For Free
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default AppHeader;
