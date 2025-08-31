import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Upload Image",
      desc: "Upload a clear image of the skin lesion. Our system works with various image formats and qualities.",
      icon: "🖱️",
      img: "/images/upload.jpg"  // Place actual images in /public/images/
    },
    {
      id: "02",
      title: "AI Analysis",
      desc: "Our AI models analyze the image using segmentation, and Resnet Models to identify the skin condition.",
      icon: "🧠",
      img: "/images/Ai.jpg"
    },
    {
      id: "03",
      title: "Get Results",
      desc: "Receive detailed classification results with confidence scores and visual explanations of the diagnosis.",
      icon: "✅",
      img: "/images/result.jpg"
    }
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">
        Our platform combines multiple AI approaches to deliver accurate skin lesion classification in just a few simple steps.
      </p>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-header">
              <div className="step-number">{step.id}</div>
              <div className="step-icon">{step.icon}</div>
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
            <img className="step-image" src={step.img} alt={step.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
