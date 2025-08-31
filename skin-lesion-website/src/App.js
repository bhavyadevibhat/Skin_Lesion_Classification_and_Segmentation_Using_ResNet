import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import About from './About';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import LesionTypes from './LesionTypes';
import Predict from './Predict';
import Results from './Results';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const nodeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Set scroll position immediately when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  // ✅ Remove the onEntered callback since we're handling it above
  // const handleEntered = () => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'instant'
  //   });
  // };

  return (
    <div>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""} ${!isHome ? "subpage" : ""}`}>
        <div className="logo">DermaCare</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/lesions">Lesion Types</Link></li>
          <li><Link to="/predict">Predict</Link></li> 
        </ul>
      </nav>

      {/* Smooth Page Transitions */}
      <div className="page-container">
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="page"
            timeout={300}
            unmountOnExit
            nodeRef={nodeRef}
            // ✅ Remove onEntered callback
          >
            <div className="page" ref={nodeRef}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <div className="hero">
                      <div className="hero-content">
                        <h1>Advanced&nbsp;AI&nbsp;for&nbsp;Skin Lesion Classification</h1>
                        <p className="highlight-text">
                          Leveraging deep learning, image segmentation and classification techniques to provide accurate and reliable skin lesion diagnosis.
                        </p>
                        <div className="hero-buttons">
                          <Link to="/predict">
                            <button>Try it Now</button>
                          </Link>
                          <Link to="/about">
                            <button className="secondary">Learn More</button>
                          </Link>
                        </div>

                      </div>
                    </div>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/lesions" element={<LesionTypes />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
        {location.pathname === '/' && <HowItWorks />}
        <Footer />
      </div>
    </div>
  );
}

export default App;