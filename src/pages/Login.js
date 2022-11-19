import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userSignin, userSignup } from "../api/auth";

function Login() {
  const [ShowSignup, setShowSignup] = useState(true);
  const [userType, setUserType] = useState("Select");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [Message, setMessage] = useState("");
  const navigate = useNavigate();

  function updateSignupData(e) {
    if (e.target.id === "userid") {
      setUserid(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else if (e.target.id === "name") {
      setUserName(e.target.value);
    } else if (e.target.id === "email") {
      setEmail(e.target.value);
    }
  }
  const signupFn = (e) => {
    const data = {
      userId: userid,
      password: password,
      email: email,
      name: userName,
      userTypes: userType,
    };
    e.preventDefault();
    userSignup(data)
      .then((response) => {
        if (response.status === 201) {
          setShowSignup(false);
          setUserid("");
          setPassword("");
          setMessage("User Signed Up Successfully...");
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  function loginFn(e) {
    e.preventDefault();
    const data = {
      userId: userid,
      password: password,
    };
    userSignin(data)
      .then((response) => {
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userid", response.data.userId);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userTypes", response.data.userTypes);
        localStorage.setItem("userStatus", response.data.userStatus);
        localStorage.setItem("token", response.data.accessToken);
        if (response.data.userTypes === "CUSTOMER") navigate("/customer");
        else if (response.data.userTypes === "ADMIN") navigate("/admin");
        else if (response.data.userTypes === "ENGINEER") navigate("/engineer");
        else navigate("/");
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  }
  const toggleSignup = () => {
    setShowSignup(!ShowSignup);
    setUserType("SELECT");
    setUserid("");
    setPassword("");
    setEmail("");
    setUserName("");
  };
  const handleSelect = (e) => {
    setUserType(e);
  };
  return (
    <div className="bg-primary vh-100 d-flex justify-content-center  align-items-center ">
      <div
        className="bg-dark text-primary card rounded-4 shadow-lg p-3"
        style={{ width: 20 + "rem" }}
      >
        <h4 className="text-center">{ShowSignup ? "Sign UP" : "Log In"}</h4>
        <form onSubmit={ShowSignup ? signupFn : loginFn}>
          <div className="input-group">
            <input
              type="text"
              className="form-control m-1"
              placeholder="User Id"
              id="userid"
              value={userid}
              onChange={updateSignupData}
            />
          </div>
          {ShowSignup && (
            <div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control m-1"
                  placeholder="User Name"
                  id="name"
                  value={userName}
                  onChange={updateSignupData}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control m-1"
                  placeholder="Email Id"
                  id="email"
                  value={email}
                  onChange={updateSignupData}
                />
              </div>
            </div>
          )}
          <div className="input-group">
            <input
              type="password"
              className="form-control m-1"
              placeholder="Password"
              id="password"
              value={password}
              onChange={updateSignupData}
            />
          </div>
          {ShowSignup && (
            <div className="d-flex justify-content-between p-2 ">
              <span className="text-white m-1">User Type</span>
              <DropdownButton
                align="end"
                title={userType}
                id="userType"
                variant="light"
                onSelect={handleSelect}
              >
                <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>
              </DropdownButton>
            </div>
          )}
          <div className="input-group">
            <input
              type="submit"
              className="btn btn-primary form-control m-1 fw-bolder text-white"
              value={ShowSignup ? "Sign Up" : "Log In"}
            />
          </div>
          <div className="m-1 text-info text-center" onClick={toggleSignup}>
            {ShowSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </div>
        </form>
        <div className="text-white text-center">{Message}</div>
      </div>
    </div>
  );
}

export default Login;
