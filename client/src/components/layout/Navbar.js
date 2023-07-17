import React,{Component} from "react";
import {Link} from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
import './navbar.css'

class Navbar extends Component{
    onLogout = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    
    render(){
        return(
            <>
            <nav className="navbar">
              <div className="col-md-2">
                <span className="logo">
                  <img className="logo" src="logo.png" alt="logo"></img>
                  <h2 className="text-dark logo-text" style={{margin:"10px"}} to="/" >thinkstant</h2>
                </span>
              </div>
              <div className="col-md-6">
                <span className="nav-feature">
                  <Link className="tab">Chatpdf</Link>
                  <Link className="tab">Features</Link>
                  <Link className="tab">Pricing</Link>
                  <Link className="tab">Support</Link>
                </span>
              </div>
              <div className="col-md-2">
                <span className="nav-button">
                  <button className="free">Start Free Trial</button>   
                </span>            
              </div>
            </nav>
            </>
        ) 
    }
}

// Navbar.PropTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired
//   };
  
const mapStateToProps = state => ({
    auth: state.auth
  });
  
export default connect(
    mapStateToProps,
    { logoutUser }
  )(Navbar);