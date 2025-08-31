import React from 'react';
import './About.css';

import { Award, BookOpen, Brain } from 'lucide-react';

// Timeline data
const timeline = [
  {
    id: 1,
    year: "March-April 2025",
    title: "Project Inception",
    description: "Started as a final year project idea to develop a skin lesion classification and segmentation platform."
  },
  {
    id: 2,
    year: "April-May 2025",
    title: "Data Collection",
    description: "Gathered and preprocessed thousands of labeled skin lesion images for model training."
  },
  {
    id: 3,
    year: "June-July 2025",
    title: "Model Development",
    description: "Trained skin lesion classification and segmentation models using deep learning techniques."
  },
  {
    id: 4,
    year: "July-August 2025",
    title: "Integration & Testing",
    description:  "Integrated models with the UI; fine-tuned model performance and resolved deployment bugs."
  },
  {
    id: 5,
    year: "August 2025",
    title: "Project Completion",
    description: "Finalized all components, prepared documentation and demo materials, and wrapped up the DermaCare project."
  }
];

// Journey Component
function Journey() {
  return (
    <section className="journey-section">
      <h2 className="journey-heading">My Journey</h2>
      <p className="journey-subtitle">
        The evolution of DermaCare from concept to real-world healthcare innovation.
      </p>
      <div className="timeline">
        {timeline.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Main About Component
function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About DermaCare</h1>
        <p>
          DermaCare is an AI-powered skin lesion detection and classification platform that helps users identify potential skin conditions from uploaded images. Using advanced deep learning models, it provides quick, accurate results along with detailed information on each lesion type.
        </p>
      </section>

      <section className="mission-section">
  <div className="mission-container">
    {/* Left: Text */}
    <div className="mission-text">
      <h2 className="mission-title">Mission</h2>
      <p className="mission-paragraph">
        At DermaCare, i believe that advanced technology should be accessible to healthcare providers everywhere. My mission is to leverage artificial intelligence to improve the accuracy and speed of skin lesion diagnosis, ultimately leading to better patient outcomes.
      </p>
      <p className="mission-paragraph">
        By combining convolutional neural networks, image segmentation, I've created a comprehensive platform that assists dermatologists and general practitioners in identifying skin conditions with high precision.
      </p>

      <div className="mission-features">
        <div className="mission-feature">
          <div className="feature-icon">
            <Award size={24} className="icon-blue" />
          </div>
          <div>
            <h4 className="feature-title">Excellence</h4>
            <p className="feature-description">Committed to the highest standards in AI and healthcare.</p>
          </div>
        </div>
        <div className="mission-feature">
          <div className="feature-icon">
            <BookOpen size={24} className="icon-blue" />
          </div>
          <div>
            <h4 className="feature-title">Education</h4>
            <p className="feature-description">Dedicated to advancing medical knowledge through technology.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right: Image with Research Badge */}
    <div className="mission-image-container">
      <div className="mission-image-wrapper">
        <img
          src="/images/doctor.jpg"
          alt="Medical AI Research"
          className="mission-image"
        />
        <div className="research-badge">
          <div className="badge-icon">
            <Brain size={24} className="icon-blue" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* Our Journey Section */}
      <Journey />
    </div>
  );
}

export default About;
