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

For the classification task on the ISIC 2019 dataset, three ResNet variants were evaluated.

ResNet50 achieved around 50% validation accuracy (macro AUC ~0.73). However, it struggled in the multi-label setup due to the severe class imbalance in the dataset, where certain classes dominated the training samples.

ResNet101 performed the best among the classification models, reaching 80% validation accuracy. The deeper architecture allowed it to learn more discriminative features, leading to better generalization across skin lesion categories.

ResNet152 achieved about 75% validation accuracy, which is slightly lower than ResNet101. The model tended to overfit during training, likely due to its higher complexity and the limited number of balanced samples.

For the segmentation task on the ISIC 2018 dataset, the U-Net model was employed. U-Net achieved 90% validation accuracy, effectively capturing lesion boundaries and producing precise segmentation masks. Its encoder–decoder architecture with skip connections helped preserve spatial details, making it highly suitable for medical image segmentation.

Overall, U-Net delivered excellent results in lesion segmentation, while ResNet101 stood out as the most effective model for classification.


## Contributors
Bhavya Devi Bhat

# License
This project is for academic purposes.