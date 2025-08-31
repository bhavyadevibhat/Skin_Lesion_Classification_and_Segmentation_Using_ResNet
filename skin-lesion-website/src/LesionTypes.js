import React, { useState } from 'react';
import './LesionTypes.css';

const LesionTypes = () => {
  const [activeCard, setActiveCard] = useState(null);

  const lesionTypes = [
    {
      id: 'ak',
      name: 'AK - Actinic Keratoses',
      description: 'Actinic keratoses are rough, scaly patches caused by sun damage. They appear as small, dry, or crusty patches of skin and are considered precancerous lesions. Most commonly found on sun-exposed areas like the face, ears, hands, and forearms.',
      characteristics: ['Rough, scaly texture', 'Red, pink, or brown color', 'Usually less than 1 inch in size', 'May feel tender or itchy'],
      riskLevel: 'Precancerous',
      image: '/images/Skin_AK.jpeg'
    },
    {
      id: 'bcc',
      name: 'BCC - Basal Cell Carcinoma',
      description: 'The most common form of skin cancer, basal cell carcinoma typically appears as a small, shiny bump or a flat, scaly area. It grows slowly and rarely spreads to other parts of the body, but should be treated promptly.',
      characteristics: ['Pearly or waxy appearance', 'May bleed easily', 'Central depression or ulcer', 'Slow-growing'],
      riskLevel: 'Malignant (Low metastasis risk)',
      image:'/images/Skin_BCC.jpeg'
    },
    {
      id: 'bkl',
      name: 'BKL - Benign Keratosis-like Lesions',
      description: 'These are non-cancerous growths that include seborrheic keratoses and other benign skin lesions. They often appear as warty, stuck-on patches and are more common with aging.',
      characteristics: ['Waxy, stuck-on appearance', 'Brown, black, or tan color', 'Well-defined borders', 'Various sizes'],
      riskLevel: 'Benign',
      image: '/images/Skin_BKL.jpg'
    },
    {
      id: 'df',
      name: 'DF - Dermatofibroma',
      description: 'Dermatofibromas are small, benign growths that feel like hard lumps under the skin. They are usually brown or reddish-brown and commonly occur on the legs, though they can appear anywhere on the body.',
      characteristics: ['Firm, hard nodule', 'Brown to reddish-brown color', 'Usually less than 1 cm', 'May be slightly raised'],
      riskLevel: 'Benign',
      image: '/images/Skin_DF.jpg'
    },
    {
      id: 'mel',
      name: 'MEL - Melanoma',
      description: 'Melanoma is the most serious type of skin cancer. It can develop from existing moles or appear as new growths. Early detection and treatment are crucial as melanoma can spread rapidly to other parts of the body.',
      characteristics: ['Asymmetrical shape', 'Irregular borders', 'Multiple colors', 'Diameter larger than 6mm', 'Evolving appearance'],
      riskLevel: 'Malignant (High metastasis risk)',
      image: '/images/Skin_MEL.jpg'
    },
    {
      id: 'nv',
      name: 'NV - Melanocytic Nevi',
      description: 'Common moles (melanocytic nevi) are benign growths made up of melanocytes. Most people have 10-40 moles, which are usually harmless but should be monitored for changes that might indicate malignancy.',
      characteristics: ['Round or oval shape', 'Even color distribution', 'Smooth borders', 'Usually smaller than 6mm', 'Stable appearance over time'],
      riskLevel: 'Benign (Monitor for changes)',
      image: '/images/Skin_NV.jpeg'
    },
    {
      id: 'scc',
      name: 'SCC - Squamous Cell Carcinoma',
      description: 'Squamous cell carcinoma is the second most common skin cancer. It typically appears as a firm, red nodule or a flat lesion with a scaly surface. It can spread to other parts of the body if left untreated.',
      characteristics: ['Firm, red nodules', 'Scaly, crusted surface', 'May ulcerate or bleed', 'Grows more quickly than BCC'],
      riskLevel: 'Malignant (Moderate metastasis risk)',
      image: '/images/Skin_SCC.jpeg'
    },
    {
      id: 'vasc',
      name: 'VASC - Vascular Lesions',
      description: 'Vascular lesions include hemangiomas, cherry angiomas, and other blood vessel abnormalities. Most are benign and appear as red, purple, or blue marks on the skin.',
      characteristics: ['Red, purple, or blue color', 'May blanch with pressure', 'Various sizes and shapes', 'Usually painless'],
      riskLevel: 'Benign',
      image: '/images/Skin_VASC.jpg'
    }
  ];

  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="lesion-types-container">
      {/* Hero Section */}
      <section className="hero-section1">
        <div className="hero-content1">
          <h1 className="hero-title1">Skin Lesion Types</h1>
          <div className="hero-description1">
            <p>
              A skin lesion is an area of the skin that looks or feels different from the surrounding skin, 
              such as a lump, bump, sore, ulcer, or area with abnormal color or texture. Skin lesions are 
              commonly divided into two main types:
            </p>
            <div className="lesion-categories">
              <div className="category benign">
                <h3>Benign lesions:</h3>
                <p>
                  These are non-cancerous, harmless growths or discolorations on the skin, such as moles, 
                  freckles, or skin tags. They usually remain stable over time and do not spread to other 
                  parts of the body.
                </p>
              </div>
              <div className="category malignant">
                <h3>Malignant lesions (such as melanoma):</h3>
                <p>
                  These are cancerous, abnormal growths. Melanoma is a serious form of skin cancer that can 
                  change quickly, spread (metastasize), and can be life-threatening if not treated early.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lesion Types Grid */}
      <section className="lesion-grid-section">
        <div className="section-header">
          <h2>8 Common Types of Skin Lesions</h2>
          <p>Click on each card to learn more about the characteristics and risk levels</p>
        </div>
        
        <div className="lesion-grid">
          {lesionTypes.map((lesion) => (
            <div 
              key={lesion.id}
              className={`lesion-card ${activeCard === lesion.id ? 'active' : ''}`}
              onClick={() => handleCardClick(lesion.id)}
            >
              <div className="card-image">
                <img src={lesion.image} alt={lesion.name} />
                <div className={`risk-badge ${lesion.riskLevel.toLowerCase().replace(/\s+/g, '-')}`}>
                  {lesion.riskLevel}
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="lesion-name">{lesion.name}</h3>
                <p className="lesion-description">{lesion.description}</p>
                
                {activeCard === lesion.id && (
                  <div className="expanded-content">
                    <h4>Key Characteristics:</h4>
                    <ul>
                      {lesion.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="card-footer">
                  <button className="learn-more-btn">
                    {activeCard === lesion.id ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Note */}
      <section className="important-note">
        <div className="note-content">
          <h3>⚠️ Important Medical Disclaimer</h3>
          <p>
            This information is for educational purposes only and should not replace professional medical advice. 
            If you notice any suspicious skin lesions or changes in existing moles, please consult a dermatologist 
            or healthcare provider for proper evaluation and diagnosis.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LesionTypes;