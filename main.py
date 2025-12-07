
# Implemented real-world logic: Basic Linear Regression Model
import numpy as np
from sklearn.linear_model import LinearRegression

def train_model():
    print("Training basic Linear Regression model for real-world use.")
    # Sample data
    X = np.array([[1], [2], [3], [4], [5]])
    y = np.array([2, 4, 5, 4, 5])
    
    model = LinearRegression()
    model.fit(X, y)
    
    print(f"Model trained. Coefficient: {model.coef_[0]:.2f}")
    return model

if __name__ == "__main__":
    train_model()
