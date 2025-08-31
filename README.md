# Skin Lesion Classification and Segmentation using ResNet

This project implements skin lesion segmentation and classification using the ISIC dataset.  
It uses **ResNet-based models** for classification and includes preprocessing, training, and evaluation scripts.

---

## Project Structure
- `Notebooks/` → Scripts and notebooks for lesion segmentation and classification  
- `Documents/` → Documents about This Projects
- `skin-lesion-website/` → Web Application Scripts
- `README.md` → Project overview  
- `.gitignore` → Files and folders excluded from Git  

---

## Features
- Data preprocessing (CLAHE, resizing, hair removal)
- ResNet-based classification
- Model training with callbacks (EarlyStopping, ReduceLROnPlateau, Checkpoints)
- Support for imbalanced dataset handling (class weights, oversampling)

---

## How to Run
1. Clone this repo:
   ```bash
   git clone https://github.com/bhavyadevibhat/Skin_Lesion_Classification_and_Segmentation_Using_ResNet.git

2. Install dependencies:

pip install -r requirements.txt

## Dataset

ISIC 2018 (Segmentation)

ISIC 2019 (Classification)
(Datasets are not included in the repo. Please download them from ISIC Archive
)

## 📊 Experiments & Results

We experimented with multiple deep learning architectures for skin lesion classification. Below are the brief results obtained:

Classification (ISIC 2019)
Model	    Validation Accuracy	                    Remarks
ResNet50	    ~50% (AUC ~0.73)	   Multi-label setup struggled due to class imbalance.
ResNet101	        80%	              Achieved the best performance among classifiers.
ResNet152	        75%	              Slightly lower than ResNet101,likely due to overfitting.

Segmentation (ISIC 2018)

Model	Validation Accuracy	                 Remarks
U-Net	    90%	                    Effectively segmented skin lesion regions.

✅ Best classifier: ResNet101 (80%)
✅ Best segmentation model: U-Net (90%)


## Contributors
Bhavya Devi Bhat

# License
This project is for academic purposes.