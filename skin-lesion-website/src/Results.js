import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaArrowLeft, FaDownload, FaInfoCircle } from 'react-icons/fa';
import './Results.css';

function Results() {
  const location = useLocation();
  const { image, prediction, confidence, probabilities, segmentedImage, segmentationMask, segmentedROI } = location.state || {};
  const [animatedData, setAnimatedData] = useState([]);

  // Class names mapping
  const classMapping = {
    'MEL': 'Melanoma',
    'NV': 'Melanocytic nevus',
    'BCC': 'Basal cell carcinoma',
    'AK': 'Actinic keratoses',
    'BKL': 'Benign keratosis',
    'DF': 'Dermatofibroma',
    'VASC': 'Vascular lesion',
    'SCC': 'Squamous cell carcinoma'
  };

  // Risk levels and colors
  const riskInfo = {
    'MEL': { level: 'High Risk', color: '#FF4444', description: 'Malignant melanoma - requires immediate medical attention' },
    'BCC': { level: 'Moderate Risk', color: '#FF8800', description: 'Basal cell carcinoma - most common skin cancer' },
    'SCC': { level: 'Moderate Risk', color: '#FF8800', description: 'Squamous cell carcinoma - requires medical evaluation' },
    'AK': { level: 'Precancerous', color: '#FFB366', description: 'Precancerous lesion - monitor closely' },
    'NV': { level: 'Low Risk', color: '#4CAF50', description: 'Benign mole - generally harmless' },
    'BKL': { level: 'Benign', color: '#4CAF50', description: 'Benign keratosis - non-cancerous' },
    'DF': { level: 'Benign', color: '#4CAF50', description: 'Dermatofibroma - benign skin lesion' },
    'VASC': { level: 'Benign', color: '#4CAF50', description: 'Vascular lesion - typically benign' }
  };

  // Color palette for chart bars (vibrant colors for better visibility)
  const chartColorPalette = {
    'MEL': '#E74C3C',     // Red
    'NV': '#3498DB',      // Blue  
    'BCC': '#E67E22',     // Orange
    'AK': '#F39C12',      // Yellow
    'BKL': '#27AE60',     // Green
    'DF': '#9B59B6',      // Purple
    'VASC': '#1ABC9C',    // Teal
    'SCC': '#E91E63'      // Pink
  };

  useEffect(() => {
    console.log('Results component received:', { image, prediction, confidence, probabilities, segmentedImage, segmentationMask }); // Debug log
    console.log('Image type:', typeof image, 'Image value:', image); // Debug image specifically
    
    if (probabilities && Object.keys(probabilities).length > 0) {
      // Animate the chart data
      const timer = setTimeout(() => {
        const chartData = Object.entries(probabilities).map(([className, prob]) => ({
          name: classMapping[className] || className,
          probability: parseFloat((prob * 100).toFixed(2)),
          fullName: classMapping[className] || className,
          shortName: className,
          // Use vibrant colors from palette instead of gray for non-primary predictions
          color: chartColorPalette[className] || '#8884d8'
        })).sort((a, b) => b.probability - a.probability);
        
        console.log('Chart data:', chartData); // Debug log
        setAnimatedData(chartData);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('No probabilities data received'); // Debug log
      // Create fallback data if probabilities are missing
      if (prediction && confidence) {
        const fallbackData = Object.keys(classMapping).map(className => ({
          name: classMapping[className],
          probability: className === prediction ? parseFloat((confidence * 100).toFixed(2)) : 0,
          fullName: classMapping[className],
          shortName: className,
          // Use vibrant colors from palette instead of gray for non-primary predictions
          color: chartColorPalette[className] || '#8884d8'
        })).sort((a, b) => b.probability - a.probability);
        
        setAnimatedData(fallbackData);
      }
    }
  }, [probabilities, prediction, confidence]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.fullName}</p>
          <p className="tooltip-value">
            Probability: <span style={{ color: data.color }}>{data.probability}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const downloadResults = async () => {
    // Check if jsPDF is available
    if (!window.jspdf) {
      alert('PDF library not loaded. Please make sure jsPDF is included in your project.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Prepare data
    const results = {
      prediction: classMapping[prediction] || prediction,
      confidence: `${(confidence * 100).toFixed(2)}%`,
      riskLevel: riskInfo[prediction]?.level || 'Unknown',
      timestamp: new Date().toISOString(),
      probabilities: probabilities
    };
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;
    
    // Header with background color
    doc.setFillColor(41, 128, 185); // Blue background
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    // Title in white
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('SKIN LESION ANALYSIS REPORT', pageWidth / 2, 17, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 40;
    
    // Timestamp with light background
    doc.setFillColor(236, 240, 241);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date(results.timestamp).toLocaleString()}`, margin + 5, yPosition + 3);
    yPosition += 25;
    
    // Main results in a box
    doc.setDrawColor(189, 195, 199);
    doc.setLineWidth(1);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 60);
    
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('PRIMARY ANALYSIS', margin + 5, yPosition);
    
    yPosition += 12;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Create two columns for main results
    const colWidth = (pageWidth - 2 * margin - 10) / 2;
    
    // Left column
    doc.setFont(undefined, 'bold');
    doc.text('Classification:', margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(results.prediction, margin + 5, yPosition + 6);
    
    doc.setFont(undefined, 'bold');
    doc.text('Risk Level:', margin + 5, yPosition + 18);
    doc.setFont(undefined, 'normal');
    doc.text(results.riskLevel, margin + 5, yPosition + 24);
    
    // Description
    const predictionInfo = riskInfo[prediction];
    if (predictionInfo && predictionInfo.description) {
      doc.setFont(undefined, 'bold');
      doc.text('Description:', margin + 5, yPosition + 36);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      const splitDescription = doc.splitTextToSize(predictionInfo.description, colWidth * 2 - 10);
      doc.text(splitDescription, margin + 5, yPosition + 42);
    }
    
    // Right column
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('Confidence Score:', margin + colWidth + 5, yPosition);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(16);
    doc.text(results.confidence, margin + colWidth + 5, yPosition + 8);
    
    yPosition += 75;
    
    // Probabilities section
    if (results.probabilities && Object.keys(results.probabilities).length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('DETAILED PROBABILITY BREAKDOWN', margin, yPosition);
      yPosition += 15;
      
      // Table header
      doc.setFillColor(52, 73, 94);
      doc.setTextColor(255, 255, 255);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Classification', margin + 5, yPosition + 7);
      doc.text('Probability', pageWidth - margin - 35, yPosition + 7);
      
      yPosition += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      // Table rows
      let isEvenRow = true;
      Object.entries(results.probabilities)
        .sort(([,a], [,b]) => b - a) // Sort by probability descending
        .forEach(([key, value]) => {
          if (isEvenRow) {
            doc.setFillColor(248, 249, 250);
            doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 10, 'F');
          }
          
          const probability = (value * 100).toFixed(2);
          const className = classMapping[key] || key;
          
          doc.text(className, margin + 5, yPosition + 3);
          doc.text(`${probability}%`, pageWidth - margin - 30, yPosition + 3);
          
          yPosition += 10;
          isEvenRow = !isEvenRow;
          
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
            isEvenRow = true;
          }
        });
    }
    
    // Medical Disclaimer
    yPosition += 15;
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFillColor(255, 243, 205);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('⚠️ MEDICAL DISCLAIMER', margin + 5, yPosition + 8);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('This is an AI prediction for educational purposes only. Always consult with a qualified', margin + 5, yPosition + 16);
    doc.text('dermatologist for proper medical diagnosis and treatment. This analysis should not', margin + 5, yPosition + 22);
    doc.text('replace professional medical advice, diagnosis, or treatment.', margin + 5, yPosition + 28);
    
    // Recommended Next Steps
    yPosition += 45;
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('RECOMMENDED NEXT STEPS:', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const nextSteps = [
      '• Save or screenshot these results for your records',
      '• Consult with a dermatologist for professional evaluation',
      '• Monitor any changes in the lesion',
      '• Follow up as recommended by your healthcare provider'
    ];
    
    nextSteps.forEach(step => {
      doc.text(step, margin + 5, yPosition);
      yPosition += 7;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount} | Generated by AI Skin Lesion Analysis System`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Download
    doc.save('skin-lesion-analysis-report.pdf');
  };

  if (!prediction) {
    return (
      <div className="results-container">
        <div className="no-results">
          <h2>No results to display</h2>
          <Link to="/predict" className="back-button">
            <FaArrowLeft /> Go to Prediction
          </Link>
        </div>
      </div>
    );
  }

  const predictionInfo = riskInfo[prediction] || {};

  return (
    <div className="results-container">
      <motion.div 
        className="results-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/predict" className="back-button">
          <FaArrowLeft /> Back to Prediction
        </Link>
        <h1>Analysis Results</h1>
        <button onClick={downloadResults} className="download-button">
          <FaDownload /> Download Report
        </button>
      </motion.div>

      <div className="results-content">
        {/* Left Column - Images */}
        <motion.div 
          className="images-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="image-card">
            <h3>Original Image</h3>
            <div className="image-container">
              {image ? (
                <img 
                  src={image} 
                  alt="Original" 
                  className="result-image"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666'}}>
                  No image available
                </div>
              )}
              <div style={{display: 'none', textAlign: 'center', color: '#666', padding: '20px'}}>
                Failed to load image
              </div>
            </div>
          </div>
          
          {segmentationMask && (
            <div className="image-card">
              <h3>Segmentation Mask</h3>
              <div className="image-container">
                <img 
                  src={segmentationMask} 
                  alt="Segmentation Mask" 
                  className="result-image"
                  onError={(e) => {
                    console.error('Segmentation mask failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none', textAlign: 'center', color: '#666', padding: '20px'}}>
                  Failed to load segmentation mask
                </div>
              </div>
            </div>
          )}
          
          {/* {segmentedROI && (
            <div className="image-card">
              <h3>Segmented ROI</h3>
              <div className="image-container">
                <img 
                  src={segmentedROI} 
                  alt="Segmented ROI" 
                  className="result-image"
                  onError={(e) => {
                    console.error('Segmented ROI failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none', textAlign: 'center', color: '#666', padding: '20px'}}>
                  Failed to load segmented ROI
                </div>
              </div>
            </div>
          )} */}

          {segmentedImage && (
            <div className="image-card">
              <h3>Segmented Overlay</h3>
              <div className="image-container">
                <img 
                  src={segmentedImage} 
                  alt="Segmented Overlay" 
                  className="result-image"
                  onError={(e) => {
                    console.error('Segmented overlay failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none', textAlign: 'center', color: '#666', padding: '20px'}}>
                  Failed to load segmented overlay
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column - Results */}
        <div className="analysis-section">
          {/* Prediction Summary */}
          <motion.div 
            className="prediction-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="prediction-header">
              <div className="prediction-main">
                <h2>Primary Prediction</h2>
                <div className="prediction-result">
                  <span className="prediction-name">{classMapping[prediction] || prediction}</span>
                  <span className="prediction-confidence">{(confidence * 100).toFixed(2)}%</span>
                </div>
                <div 
                  className="risk-badge"
                  style={{ backgroundColor: predictionInfo.color }}
                >
                  {predictionInfo.level || 'Unknown Risk'}
                </div>
              </div>
              <FaInfoCircle className="info-icon" />
            </div>
            
            {predictionInfo.description && (
              <div className="prediction-description">
                <p>{predictionInfo.description}</p>
              </div>
            )}

            <div className="medical-disclaimer">
              <strong>⚠️ Medical Disclaimer:</strong> This is an AI prediction for educational purposes only. 
              Always consult with a qualified dermatologist for proper medical diagnosis and treatment.
            </div>
          </motion.div>

          {/* Probability Chart */}
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3>Model Prediction Probabilities</h3>
            {animatedData.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                      stroke="#666666"
                    />
                    <YAxis 
                      domain={[0, 100]}
                      label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
                      fontSize={12}
                      stroke="#666666"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="probability" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    >
                      {animatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="no-chart-data">
                <p>Chart data is loading... If this persists, there may be an issue with the prediction data.</p>
              </div>
            )}
          </motion.div>

          {/* Additional Information */}
          <motion.div 
            className="info-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3>Learn More</h3>
            <p>
              For detailed information about <strong>{classMapping[prediction] || prediction}</strong>, 
              visit our <Link to={`/lesions#${prediction.toLowerCase()}`} className="info-link">
                lesion types page
              </Link>.
            </p>
            
            <div className="next-steps">
              <h4>Recommended Next Steps:</h4>
              <ul>
                <li>Save or screenshot these results for your records</li>
                <li>Consult with a dermatologist for professional evaluation</li>
                <li>Monitor any changes in the lesion</li>
                <li>Follow up as recommended by your healthcare provider</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Results;