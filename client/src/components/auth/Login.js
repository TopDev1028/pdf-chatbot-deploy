import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import "./auth.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/payment");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/payment");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData);
  };
  render() {
    const { email, password, errors } = this.state;
    return (
      <div className="form-box">
        <form className="login-form" onSubmit={this.onSubmit}>
          <div className="login-container">
            <div className="col-md-6">
              <img
                src="login-pic.png"
                alt="image"
                className="login-left-back"
              />
              <img
                src="login-blur-pic.png"
                alt="blur-image"
                className="login-left-front"
              />
              <img
                src="login-logo.png"
                alt="log-image"
                className="login-logo"
              />
              <div className="login-txt">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Auctor dictum morbi ipsum leo eget aenean nec, porttitor.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Auctor dictum morbi ipsum leo eget aenean nec, porttitor.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                </p>
              </div>
            </div>
            <div className="col-md-6" style={{paddingLeft: "7.5%" , paddingRight: "7.5%" , paddingTop: "7.5%"}}>
              <h1 className="login-title">Welcome to Thinkstant</h1>
              <hr />
              <div className="text-center">
                Don't have an account? <Link to="/register">Click Here</Link>
              </div>
              <div className="form-group">
                <label for="email" style={{ fontSize: "17px" }}>
                  Email Address
                </label>
                <br />
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  size="50"
                  value={email}
                  error={errors}
                  onChange={this.onChange}
                  className={classnames("form-control", {
                    invalid: errors.email || errors.emailnotfound,
                  })}
                />
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="form-group">
                <label for="password" style={{ fontSize: "17px" }}>
                  User Password
                </label>
                <br />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  error={errors}
                  onChange={this.onChange}
                  className={classnames("form-control", {
                    invalid: errors.password || errors.passwordincorrect,
                  })}
                />
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="form-group">
                <button type="submit" className="login-submit-btn">
                  Log in
                </button>
              </div>
              <div className="text-center">
                Forgot Password? <Link to="/register">Click Here</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
