# Skin Lesion Classification and Segmentation using ResNet

This project implements skin lesion segmentation and classification using the ISIC dataset.  
It uses **ResNet-based models** for classification and includes preprocessing, training, and evaluation scripts.

---

## Project Structure
- `Segmentation/` → Scripts and notebooks for lesion segmentation  
- `Classification/` → Scripts and notebooks for lesion classification  
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

## Contributors
Bhavya Devi Bhat

# License
This project is for academic purposes.