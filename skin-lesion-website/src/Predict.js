import React, { useState } from 'react';
import './Predict.css';
import { motion } from 'framer-motion';
import { FaFileImage } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Predict() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction('');
      setConfidence(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction('');
      setConfidence(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handlePredict = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);

    setLoading(true);
    setPrediction('');
    setConfidence(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      console.log('Backend response:', data); // Debug log
      
      // Navigate to results page with all the data including new segmentation images
      navigate('/results', {
        state: {
          image: data.originalImage ? `data:image/png;base64,${data.originalImage}` : preview,
          prediction: data.prediction,
          confidence: data.confidence,
          probabilities: data.probabilities,
          segmentedImage: data.segmentedImage ? `data:image/png;base64,${data.segmentedImage}` : null,
          segmentationMask: data.segmentationMask ? `data:image/png;base64,${data.segmentationMask}` : null, // NEW
          // segmentedROI: data.segmentedROI ? `data:image/png;base64,${data.segmentedROI}` : null, // NEW
          originalImage: data.originalImage ? `data:image/png;base64,${data.originalImage}` : preview
        }
      });

    } catch (error) {
      console.error('Prediction failed:', error);
      setPrediction('Prediction failed. Check backend or network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <h2 className="heading">Skin Lesion Classifier</h2>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {!preview && (
          <div className="upload-info">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <FaFileImage className="icon" />
            </motion.div>
            <p className="upload-text">Drag and drop or click to upload</p>
            <p className="upload-subtext">The model only works on skin images; other images will give unreliable results.</p>
          </div>
        )}

        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-box">
              <p className="drag-text">Drop your image here</p>
            </div>
          </div>
        )}

        {preview && (
          <div className="preview-section">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <button className="predict-btn" onClick={handlePredict} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {prediction && (
        <div className="prediction-box">
          <h3>Quick Preview</h3>
          <p>
            <strong>{prediction}</strong> ({(confidence * 100).toFixed(2)}% confidence)
          </p>
          <p className="view-details">Click "Analyze Image" again to see detailed results with charts and segmentation.</p>
        </div>
      )}
    </div>
  );
}

export default Predict;