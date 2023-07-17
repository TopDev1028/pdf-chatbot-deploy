import React,{Component} from "react";
import {Link} from "react-router-dom";
import './footer.css'

const Footer = () =>{
    
    

    return(
        <div className="footer">
            <span className="logo-footer">
                <img className="logo" src="logo.png" alt="logo"></img>
                <h1 className="text-dark logo-text" style={{margin:"10px"}} to="/" >thinkstant</h1>
            </span>
            <span className="nav-footer">
                <Link className="tab">Account</Link>
                <Link className="tab">ChatPDF</Link>
                <Link className="tab">Features</Link>
                <Link className="tab">Pricing</Link>
                <Link className="tab">Support</Link>
                <Link className="tab">Contact</Link>
            </span>
            <div className="icon-footer">
                <span className="lowest-footer">
                    <p>@2023 ChatPDF</p>
                    <p>Privac Policy</p>
                    <p>Terms of Use</p>
                </span>
                <span className="icon-group">
                    <a href="#" class="fa fa-facebook"></a>  
                    <a href="#" class="fa fa-twitter"></a>  
                    <a href="#" class="fa fa-pinterest"></a>  
                    <a href="#" class="fa fa-linkedin"></a>  
                    <a href="#" class="fa fa-instagram"></a>  
                    <a href="#" class="fa fa-youtube"></a>  
                </span>
            </div>
        </div>        
    ) 
}

export default Footer