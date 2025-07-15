import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id ='footer'>
        <div className="footer-content">
          <div className="footer-content-left">
              <img src={assets.logo} alt="" />
              <p>From our kitchen to your doorstep, we deliver not just food, but warmth, flavor, and a little joy in every bite — because you deserve the best, every time.</p>
             <div className="footer-social-icons">
                  <img src={assets.facebook_icon} alt="" />
                  <img src={assets.twitter_icon} alt="" />
                  <img src={assets.linkedin_icon} alt="" />
             </div>
          </div>
          <div className="footer-content-center">
              <h2>COMPANY</h2>
              <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delievery</li>
                <li>Privacy policy</li>
              </ul>
          </div>
          <div className="footer-content-right">
             <h2>GET IN TOUCH</h2>
             <ul>
             <li>contact@tomato.com</li>
             <li>+1-212-457-9890</li>
             </ul>
          </div>
        </div>
        <hr />
        <p className="footer-copyright">
          Copyright 2024 @ Tomato.com - All Right Reserved.
        </p>
    </div>
  )
}

export default Footer