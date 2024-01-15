import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { checkmarkCircleOutline } from 'ionicons/icons';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

let model:any, maxPredictions:any;

function storeItems() {
    const selectedItems = document.getElementsByClassName("item-selected");
    const items = [];
    for (const item of selectedItems) {
        const name = item.getElementsByClassName("item-name")[0].textContent;
        const info = item.getElementsByClassName("item-info")[0].textContent;
        items.push([name, info]);
    }
    sessionStorage.setItem("selectedItems", JSON.stringify(items));
}

const setSelected = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const item = event.currentTarget;
    const tick: HTMLElement | null = item.querySelector(".item-icon");
    if (item.classList.contains("item") && !item.classList.contains("item-selected")) {
        item.classList.remove("item-deselected");
        item.classList.add("item-selected");
        if (tick !== null) {
            tick.style.display = "block";
        }
        console.log("SELECTED");
        return;
    }
    item.classList.remove("item-selected");
    item.getAttribute("id") !== "items-list" && item.classList.add("item-deselected");
    if (tick !== null) {
        tick.style.display = "none";
    }
    console.log("NOT");
}

const initAI = async () => {
  // Wait for TensorFlow.js to be ready
  await tf.ready();

  // Initialize Teachable Machine
  const URL = 'https://teachablemachine.withgoogle.com/models/9OJwhBCAG/'; // Replace with your Teachable Machine model URL

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  console.log('Teachable Machine model loaded:', model);
};
(async () => {
    await initAI();
    // Other code
  })();

const predict = async (imageData:any) => {
    // Ensure model is loaded before making predictions
    if (!model) {
        console.error('Model not loaded.');
        return;
    }

    const image = new Image();
    image.src = imageData;
    await image.decode();

    const prediction = await model.predict(image);
    console.log('Image classification prediction:', prediction);

    // extract the class label and probability from the prediction array
	// [0] has the highest prediction score
    const classLabel = prediction[0].className;
    const probability = prediction[0].probability.toFixed(2);

    return prediction;
};

const takePicture = async () => {
    try {
        const result = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        console.log('Captured image data: ', result.dataUrl);

        // Predict using TensorFlow.js model
        const prediction = await predict(result.dataUrl);

        let max = -1;
        let maxString = "";

        for (let i = 0; i < maxPredictions; i++) {

            if (prediction[i].probability.toFixed(2) > max) {
                max = prediction[i].probability.toFixed(2);
                maxString = prediction[i].className;
            }
        }

        console.log('Final: ' + maxString);
        console.log('Prob: ' + max);

        addListElement(maxString);
    } catch (error) {
        console.error('Error taking picture: ', error);
    }
};

const addSuggestion = () => {
    const productsDB = [
        "Apples", "Bananas", "Milk", "Bread", "Eggs", "Chicken", "Rice", "Pasta", "Tomatoes", "Potatoes",
        "Onions", "Carrots", "Spinach", "Broccoli", "Cheese", "Yogurt", "Butter", "Olive Oil", "Cereal",
        "Orange Juice", "Coffee", "Tea", "Sugar", "Flour", "Salt", "Pepper", "Cucumber", "Bell Peppers",
        "Lettuce", "Garlic", "Honey", "Peanut Butter", "Jelly", "Bacon", "Sausages", "Ground Beef", "Salmon",
        "Shrimp", "Mayonnaise", "Mustard", "Ketchup", "Pickles", "Soy Sauce", "Vinegar", "Salsa", "Chips",
        "Cookies", "Chocolate", "Ice Cream", "Frozen Vegetables", "Frozen Pizza", "Frozen Fruits", "Almonds",
        "Walnuts", "Cashews", "Trail Mix", "Granola Bars", "Muesli",
        "Cat Food", "Dog Food", "Pet Treats",
        "Bottled Water", "Soda", "Juice Boxes", "Wine", "Beer", "Chips Ahoy", "Popcorn", "Canned Soup",
        "Instant Noodles", "Spaghetti Sauce", "Cheddar Cheese", "Sour Cream", "Sliced Ham", "Pineapple",
        "Avocado", "Ground Turkey", "Oatmeal", "Pancake Mix", "Maple Syrup"
      ];
      
   
    const randomProduct = productsDB[Math.floor(Math.random() * productsDB.length)];

    addListElement(randomProduct);
}

const addListElement = (str:String) => {
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.addEventListener('click', (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setSelected(event);
    });
    newItem.innerHTML = `
        <div class="item-name">${str}</div>
        <div class="item-info"></div>
        <ion-icon icon="${checkmarkCircleOutline}" class="item-icon" style="display: none;"></ion-icon>
    `;
    document.querySelector("#items-list")?.appendChild(newItem);
}


const GroceriesList: React.FC = () => (
    <IonPage className='body'>
        <IonHeader>

        </IonHeader>
        <IonContent fullscreen>
            <div className='custom-background'>

                <h2><b style={{ marginLeft: '5px' }}>Grocery List</b></h2>
                <sub style={{ fontSize: '15px' }}>Press to select the items you want to add</sub>
                <IonButton href="/final-grocery-list" fill="clear" id='button-next' onClick={ storeItems }>Next</IonButton>

                <section id="items-list">
                    <div className="item item-selected" onClick={ setSelected }>
                        <div className="item-name">Onions</div>
                        <div className="item-info"></div>
                        <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
                    </div>

                    <div className="item" onClick={ setSelected }>
                        <div className="item-name">Carrots</div>
                        <div className="item-info item-risk">High Risk of Wastage!</div>
                        <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                    </div>

                    <div className="item" onClick={ setSelected }>
                        <div className="item-name">Apples</div>
                        <div className="item-info item-warning">You already have a lot!</div>
                        <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                    </div>

                    <div className="item" onClick={ setSelected }>
                        <div className="item-name">Onions</div>
                        <div className="item-info"></div>
                        <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                    </div>
                </section>
            </div>
        </IonContent>

        <footer className="foot-buttons">
            <IonButton onClick={takePicture} fill="clear" expand="full" className='button-add foot-btn'>Add Product</IonButton>
            <IonButton onClick={addSuggestion} fill="clear" expand="full" className='button-stat foot-btn'>Get Suggestions</IonButton>
            <IonButton href="/statistics" fill="clear" expand="full" className='button-stat foot-btn'>See Statistics</IonButton>
        </footer>
    </IonPage>
);

export default GroceriesList;
