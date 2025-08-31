from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
import io
import base64
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import tensorflow as tf
tf.keras.backend.clear_session() 


app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model("epoch_26 (1).h5") 
segmentation_model = tf.keras.models.load_model("Segmentation_model_Unet.h5") # Replace with your model path
class_names = ['MEL', 'NV', 'BCC', 'AK', 'BKL', 'DF', 'VASC', 'SCC'] # adjust if needed

# Set your model input size
target_width, target_height = 224, 224
segmentation_target_size = (384, 256)

# --- Preprocessing functions ---
def remove_hair(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    kernel = cv2.getStructuringElement(1, (17, 17))
    blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
    _, mask = cv2.threshold(blackhat, 10, 255, cv2.THRESH_BINARY)
    result = cv2.inpaint(img, mask, 1, cv2.INPAINT_TELEA)
    return result

def apply_CLAHE(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    merged = cv2.merge((cl, a, b))
    enhanced_img = cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)
    return enhanced_img

def preprocess_image(img):

    img = img.copy()
    img = cv2.resize(img, (224, 224), interpolation=cv2.INTER_LINEAR)
    img = remove_hair(img)
    img = apply_CLAHE(img)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return (img.astype(np.float32) / 255.0).reshape(1, 224, 224, 3) 

def preprocess_segmentation_image(img):
    img = cv2.resize(img, segmentation_target_size, interpolation=cv2.INTER_LINEAR)
    img = remove_hair(img)
    img = apply_CLAHE(img)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return (img.astype(np.float32) / 255.0).reshape(1, *segmentation_target_size[::-1], 3)

def create_segmentation_overlay(original_img, mask):
    """Create overlay of original image and segmentation mask"""
    # Resize mask to match original image dimensions
    mask = cv2.resize(mask, (original_img.shape[1], original_img.shape[0]))
    
    # Convert mask to 3-channel and color it (e.g., red)
    mask_colored = np.zeros_like(original_img)
    mask_colored[mask > 0.5] = [255, 0, 0]  # Red color for segmented area
    
    # Create overlay
    overlay = cv2.addWeighted(original_img, 0.7, mask_colored, 0.3, 0)
    
    # Convert to base64 for sending to frontend
    _, buffer = cv2.imencode('.png', overlay)
    return base64.b64encode(buffer).decode('utf-8')
def create_segmentation_overlay(original_img, mask):
    """Create overlay of original image and segmentation mask"""
    # Ensure mask is 2D
    if len(mask.shape) > 2:
        mask = mask[:, :, 0] if mask.shape[2] == 1 else mask
    
    # Resize mask to match original image dimensions
    mask_resized = cv2.resize(mask, (original_img.shape[1], original_img.shape[0]), 
                             interpolation=cv2.INTER_NEAREST)
    
    # Create binary mask (threshold at 0.5)
    binary_mask = (mask_resized > 0.5).astype(np.uint8)
    
    # Create colored mask overlay
    mask_colored = np.zeros_like(original_img)
    mask_colored[binary_mask == 1] = [0, 255, 0]  # Green color for segmented area
    
    # Create overlay with better blending
    overlay = cv2.addWeighted(original_img, 0.6, mask_colored, 0.4, 0)
    
    # Convert to base64
    _, buffer = cv2.imencode('.png', overlay)
    return base64.b64encode(buffer).decode('utf-8')

def create_segmentation_mask_image(mask):
    """Create clean black-and-white segmentation mask with smooth borders"""
    # Ensure mask is 2D
    if len(mask.shape) > 2:
        mask = mask[:, :, 0] if mask.shape[2] == 1 else mask
    
    # Convert probability mask to binary (threshold at 0.5)
    mask_bin = (mask > 0.5).astype(np.uint8) * 255
    
    # Apply morphological operations to clean up the mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask_bin = cv2.morphologyEx(mask_bin, cv2.MORPH_CLOSE, kernel)  # Fill holes
    mask_bin = cv2.morphologyEx(mask_bin, cv2.MORPH_OPEN, kernel)   # Remove noise
    
    # Apply Gaussian blur for smoother edges
    mask_bin = cv2.GaussianBlur(mask_bin, (3, 3), 0)
    
    # Re-threshold after blur
    _, mask_bin = cv2.threshold(mask_bin, 127, 255, cv2.THRESH_BINARY)
    
    # Convert to 3-channel for consistency
    mask_img = cv2.cvtColor(mask_bin, cv2.COLOR_GRAY2BGR)
    
    # Resize for frontend display (maintain aspect ratio)
    display_size = 256
    h, w = mask_img.shape[:2]
    if h > w:
        new_h, new_w = display_size, int(w * display_size / h)
    else:
        new_h, new_w = int(h * display_size / w), display_size
    
    mask_img = cv2.resize(mask_img, (new_w, new_h), interpolation=cv2.INTER_NEAREST)
    
    # Convert to base64
    _, buffer = cv2.imencode('.png', mask_img)
    return base64.b64encode(buffer).decode('utf-8')


# Optional: Add function to create a contour overlay
def create_contour_overlay(original_img, mask):
    """Create overlay showing just the contour/boundary of the segmentation"""
    # Ensure mask is 2D
    if len(mask.shape) > 2:
        mask = mask[:, :, 0] if mask.shape[2] == 1 else mask
    
    # Resize mask to match original image dimensions
    mask_resized = cv2.resize(mask, (original_img.shape[1], original_img.shape[0]), 
                             interpolation=cv2.INTER_NEAREST)
    
    # Create binary mask
    binary_mask = (mask_resized > 0.5).astype(np.uint8) * 255
    
    # Find contours
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Create overlay with contours
    overlay = original_img.copy()
    cv2.drawContours(overlay, contours, -1, (0, 255, 0), 3)  # Green contours, thickness 3
    
    # Convert to base64
    _, buffer = cv2.imencode('.png', overlay)
    return base64.b64encode(buffer).decode('utf-8')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        input_tensor = preprocess_image(img)
        
        # Verify preprocessing
        print("Input stats:")
        print(f"Shape: {input_tensor.shape}")  # Should be (1, 224, 224, 3)
        print(f"Range: {input_tensor.min():.2f}-{input_tensor.max():.2f}")  # Should be 0.0-1.0
        
        # Predict classification
        preds = model.predict(input_tensor)
        print("Raw probabilities:", preds)
        print("Predicted index:", np.argmax(preds))
        
        probabilities = {}
        for i, class_name in enumerate(class_names):
            probabilities[class_name] = float(preds[0][i])
        
        # Predict segmentation
        segmentation_input = preprocess_segmentation_image(img)
        pred_mask = segmentation_model.predict(segmentation_input)[0, :, :, 0]  # Get first mask
        
        print(f"Segmentation mask shape: {pred_mask.shape}")
        print(f"Segmentation mask range: {pred_mask.min():.3f} to {pred_mask.max():.3f}")
        print(f"Original image shape: {img.shape}")
        
        # Create all visualization outputs
        segmented_image = create_segmentation_overlay(img, pred_mask)
        segmentation_mask = create_segmentation_mask_image(pred_mask)
        
        contour_overlay = create_contour_overlay(img, pred_mask)  # Optional additional output
        
        return jsonify({
            'prediction': class_names[np.argmax(preds)],
            'confidence': float(np.max(preds)),
            'probabilities': probabilities,
            'segmentedImage': segmented_image,
            'segmentationMask': segmentation_mask,
            
            'contourOverlay': contour_overlay,  # Optional: add this to your frontend
            'originalImage': base64.b64encode(cv2.imencode('.png', img)[1]).decode('utf-8')
        })
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500
    

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

if __name__ == '__main__':
    app.run(debug=True)
