import React, { useState } from 'react';
import './Footer.css';
import { Linkedin, Twitter, Github, Mail, Phone, MapPin ,Instagram } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000); // Optional: reset after 4s
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left - Brand Description */}
        <div className="footer-col">
          <h2 className="footer-logo">DermaCare</h2>
          <p>Advanced skin lesion classification using deep learning, image segmentation, and NLP techniques.</p>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/in/bhavyadevibhat" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            <a href="https://github.com/bhavyadevibhat" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            {/* <a href="#"><Twitter size={20} /></a> */}
          </div>
        </div>

        {/* Center - Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/predict">Predict</a></li>
            {/* <li><a href="/contact">Contact</a></li> */}
          </ul>
        </div>

        {/* Right - Contact Info */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p><Mail size={16} /> bhavyadevibhat@gmail.com</p>
          <p><Phone size={16} /> +91 9495402860</p>
          <p><MapPin size={16} /> Mangalore University, Mangalore</p>
        </div>

        {/* Stay Updated */}
        <div className="footer-col">
          <h4>Stay Updated</h4>
          <p>Subscribe to our newsletter for the latest updates and research.</p>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribed}
            />
            {subscribed ? (
              <span className="subscribed-message">✅ Subscribed</span>
            ) : (
              <button type="submit">Subscribe</button>
            )}
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 DermaCare. All rights reserved.</p>
        <p>Created by Bhawya Devi</p>
      </div>
    </footer>
  );
}

export default Footer;
