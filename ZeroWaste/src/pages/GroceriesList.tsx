import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader, IonButtons, IonInput, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { checkmarkCircleOutline } from 'ionicons/icons';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import { getRecords, modifyRecords } from './Home';


let model: any, maxPredictions: any;
if (window.location.href.endsWith("/groceries-list")) {
    const onBackButton = (event: Event) => {
        event.preventDefault();
        window.location.href = "/home";
    };

    document.addEventListener('ionBackButton', onBackButton as EventListener);
}

export function setInfoStyle(info: string) {
    let infoStyle = "";
    if (info === "exception" || info.toLowerCase().includes("risk")) {
        infoStyle = "item-risk";
    } else if (info.toLowerCase().includes("quantity")) {
        infoStyle = "item-warning";
    } else if (info.toLowerCase().includes("favourite")) {
        infoStyle = "item-favourite";
    }
    return infoStyle;
}

const GroceriesList: React.FC = () => {
    sessionStorage.setItem("groceryRead", "1");

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

    const predict = async (imageData: any) => {
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
            "Bottled Water", "Soda", "Juice Boxes", "Wine", "Beer", "Chips Ahoy", "Popcorn", "Canned Soup",
            "Instant Noodles", "Spaghetti Sauce", "Cheddar Cheese", "Sour Cream", "Sliced Ham", "Pineapple",
            "Avocado", "Ground Turkey", "Oatmeal", "Pancake Mix", "Maple Syrup"
        ];

        const randomProduct = productsDB[Math.floor(Math.random() * productsDB.length)];
        addListElement(randomProduct);
    }

    const storageGrocery = getRecords("groceryList");
    const storedGrocery = (storageGrocery as { name: string, info: string, selected: string }[]).map(x => [x.name, x.info, x.selected]);
    console.log(storedGrocery);
    const [items, setItems] = useState(storedGrocery);

    const addListElement = (str: string) => {
        const newItems = [...items];
        newItems.push([str, "normal", "0"]);
        setItems(newItems);

        storageGrocery.push({ name: str, info: "normal", "selected": "0" });
        modifyRecords("groceryList", storageGrocery);
    }


    function storeItems() {
        const items = document.getElementsByClassName("item");
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.getElementsByClassName("item-name")[0].textContent;
            const info = item.getElementsByClassName("item-info")[0].textContent;
            const selected = (item.getElementsByClassName("item-icon")[0] as HTMLElement).style.display !== "none" ? "1" : "0";
            const updatedItem = { name, info, selected };
            storageGrocery.splice(i, 1, updatedItem);
        }
        modifyRecords("groceryList", storageGrocery);
        modifyRecords("finalList", JSON.stringify((storageGrocery as { name: string, info: string, selected: string }[]).filter(x => x.selected === "1").map(x => [x.name, x.info])));
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

    //   ------------- Manual addition -------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    function setOpen(isOpen: boolean) {
        setIsModalOpen(isOpen);
    }

    function addItemFromModal() {
        const itemName = (document.getElementById("input-item-name") as HTMLInputElement).value.trim();
        const updatedList = [...items];
        updatedList.push([itemName, "normal", "0"]);
        setItems(updatedList);

        storageGrocery.push({ name: itemName, info: "normal", "selected": "0" });
        modifyRecords("groceryList", storageGrocery);
        setOpen(false);
    }

    function setItemStyle(selected: string) {
        let itemStyle = "item";
        if (selected === "1") {
            itemStyle += " item-selected";
        } 
        return itemStyle;
    }

    return (
        <IonPage className='body'>
            <IonHeader>

            </IonHeader>
            <IonContent fullscreen>
                <div className='custom-background'>

                    <h2><b style={{ marginLeft: '5px' }}>Grocery List</b></h2>
                    <sub style={{ fontSize: '15px' }}>Press to select the items you want to add</sub>
                    <IonButton href="/final-grocery-list" fill="clear" id='button-next' onClick={storeItems}>Next</IonButton>

                    <section id="items-list">
                        {items.map((item, index) => (
                            <div className={setItemStyle(item[2])} key={`${item[0]} ${index}`} onClick={(event) => setSelected(event)}>
                                <div className="item-name">{item[0]}</div>
                                <div className={`item-info ${setInfoStyle(item[1])}`}>{item[1] === "normal" ? "" : item[1]}</div>
                                <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: item[2] === "0" ? "none" : "block" }} />
                            </div>
                        ))}
                    </section>
                </div>
            </IonContent>

            {/* Modal for manual addition */}
            <IonModal isOpen={isModalOpen}>
                <div>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle className='ion-title'>Add Product</IonTitle>

                            <IonButtons slot="end">
                                <IonButton onClick={() => setOpen(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent id="modalContent">
                        <div className='custom-background'>
                            <h5><b>Type in the name of the product:</b></h5>
                            <IonInput id="input-item-name" label="Enter product" labelPlacement="floating" fill="outline" placeholder="Product Name"></IonInput>
                            <IonButton onClick={() => addItemFromModal()} fill="clear" expand="full" className='foot-btn' id="add-product">Add Product</IonButton>
                        </div>
                    </IonContent>
                </div>
            </IonModal>

            <footer className="foot-buttons">
                <IonButton onClick={() => setOpen(true)} fill="clear" expand="full" className='button-add foot-btn'>Add Product</IonButton>
                <IonButton onClick={addSuggestion} fill="clear" expand="full" className='button-stat foot-btn'>Get Suggestions</IonButton>
                <IonButton href="/statistics" fill="clear" expand="full" className='button-stat foot-btn'>Favourites & Exceptions</IonButton>
            </footer>
        </IonPage>
    )
};

export default GroceriesList;
