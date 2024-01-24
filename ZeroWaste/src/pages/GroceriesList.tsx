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
    if (info.toLowerCase().includes("exception") || info.toLowerCase().includes("risk")) {
        infoStyle = "item-risk";
    } else if (info.toLowerCase().includes("quantity")) {
        infoStyle = "item-warning";
    } else if (info.toLowerCase().includes("favourite")) {
        infoStyle = "item-favourite";
    }
    return infoStyle;
}

export function setInfoText(info: string) { // ADD IN CURRENT PRODUCTS
    let infoText = "";
    if (info.toLowerCase().includes("risk")) {
        infoText = "High Risk of Wastage!";
    } else if (info.toLowerCase().includes("exception")) {
        infoText = "Product in Exception list!";
    } else if (info.toLowerCase().includes("favourite")) {
        infoText = "Favourite";
    }
    return infoText;
}

/// ----- DB and Categories DBs
export const productsDB: string[] = [
    "Apples", "Bananas", "Milk", "Bread", "Eggs", "Chicken", "Rice", "Pasta", "Tomatoes", "Potatoes",
    "Onions", "Carrots", "Spinach", "Broccoli", "Cheese", "Yogurt", "Butter", "Olive Oil", "Cereal",
    "Orange Juice", "Coffee", "Tea", "Sugar", "Flour", "Salt", "Pepper", "Cucumber", "Bell Peppers",
    "Lettuce", "Garlic", "Honey", "Peanut Butter", "Jelly", "Bacon", "Sausages", "Ground Beef", "Salmon",
    "Shrimp", "Mayonnaise", "Mustard", "Ketchup", "Pickles", "Soy Sauce", "Vinegar", "Salsa", "Chips",
    "Cookies", "Chocolate", "Ice Cream", "Frozen Vegetables", "Frozen Pizza", "Frozen Fruits", "Almonds",
    "Walnuts", "Cashews", "Trail Mix", "Granola Bars", "Muesli", "Peanuts", "Beans",
    "Bottled Water", "Soda", "Juice Boxes", "Wine", "Beer", "Chips Ahoy", "Popcorn", "Canned Soup",
    "Instant Noodles", "Spaghetti Sauce", "Cheddar Cheese", "Sour Cream", "Sliced Ham", "Pineapple",
    "Avocado", "Ground Turkey", "Oatmeal", "Pancake Mix", "Maple Syrup"
];
export const vegetablesFruits: string[] = ["Apples", "Bananas", "Tomatoes", "Potatoes", "Onions", "Carrots",
    "Spinach", "Broccoli", "Cucumber", "Bell Peppers", "Lettuce", "Garlic", "Honey", "Pineapple", "Avocado"];
export const dairyEggs: string[] = ["Milk", "Eggs", "Cheese", "Yogurt", "Butter", "Orange Juice", "Sour Cream"];
export const meat: string[] = ["Chicken", "Bacon", "Sausages", "Ground Beef", "Salmon", "Shrimp", "Sliced Ham",
    "Ground Turkey"];
export const other: string[] = ["Rice", "Pasta", "Cereal", "Coffee", "Tea", "Sugar", "Flour", "Salt", "Pepper",
    "Olive Oil", "Mayonnaise", "Mustard", "Ketchup", "Pickles", "Soy Sauce", "Vinegar", "Salsa", "Chips",
    "Cookies", "Chocolate", "Ice Cream", "Frozen Vegetables", "Frozen Pizza", "Frozen Fruits", "Almonds",
    "Walnuts", "Cashews", "Trail Mix", "Granola Bars", "Muesli", "Peanuts", "Beans", "Bottled Water", "Soda",
    "Juice Boxes", "Wine", "Beer", "Chips Ahoy", "Popcorn", "Canned Soup", "Instant Noodles", "Spaghetti Sauce"];

export const productsByCategoriesDB: { [key: string]: string[] } = { vegetablesFruits, dairyEggs, meat, other };
// ---------

const GroceriesList: React.FC = () => {
    sessionStorage.setItem("groceryRead", "1");

    // --------------   DBs of suggestions
    const favourites: string[] = (getRecords("favouriteList") as { name: string }[]).map(x => x.name);
    const exceptions: string[] = (getRecords("exceptionList") as { name: string }[]).map(x => x.name);
    const groceries: string[] = (getRecords("groceryList") as { name: string }[]).map(x => x.name);
    
    const favouritesDB: string[] = productsDB.filter(x => favourites.includes(x) && !groceries.includes(x));
    const exceptionsDB: string[] = productsDB.filter(x => exceptions.includes(x) && !groceries.includes(x));
    const restDB: string[] = productsDB.filter(x => !favourites.includes(x) && !exceptions.includes(x) && !groceries.includes(x));
    
    // --------------

    ///// CATEGORIES
    const favouriteCategory = getRecords("favouriteList").reduce((acc: [string, number][], item: { category: string }) => {
        const category = item.category;

        if (acc.some(([existingCategory]) => existingCategory === category)) {
            acc.find(([existingCategory]) => existingCategory === category)![1]++;
        } else {
            // If the category is not included
            acc.push([category, 1]);
        }

        return acc;
    }, []);
    console.log(favouriteCategory);
    

    const groceryCategory = getRecords("groceryList").reduce((acc: [string, number][], item: { category: string }) => {
        const category = item.category;
    
        if (acc.some(([existingCategory]) => existingCategory === category)) {
            acc.find(([existingCategory]) => existingCategory === category)![1]++;
        } else {
            // If the category is not included
            acc.push([category, 1]);
        }
    
        return acc;
    }, []);
    console.log(groceryCategory);
    

    const favouritesHighestCat = favouriteCategory.sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0][0];
    console.log(favouritesHighestCat);
    
    const groceryHighestCat = groceryCategory.sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0][0];
    console.log(groceryHighestCat);

    // for the nested monstrocity
    const filteredFavouritesByFavCat = favouritesDB.filter(x => productsByCategoriesDB[favouritesHighestCat].includes(x));
    const filteredFavouritesByGroceryCat = favouritesDB.filter(x => productsByCategoriesDB[groceryHighestCat].includes(x));
    console.log(`Favs: ${favouritesDB.join(", ")}`);
    

    const filteredRestByFavCat = restDB.filter(x => productsByCategoriesDB[favouritesHighestCat].includes(x));
    const filteredRestByGroceryCat = restDB.filter(x => productsByCategoriesDB[groceryHighestCat].includes(x));

    ////// /CATEGORIES


    const initAI = async () => {
        // Wait for TensorFlow.js to be ready
        await tf.ready();

        // Initialize Teachable Machine
        const URL = 'https://teachablemachine.withgoogle.com/models/9OJwhBCAG/'; // Replace with your Teachable Machine model URL

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        // console.log('Teachable Machine model loaded:', model);
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

            addListElement([maxString, "Normal"]);
        } catch (error) {
            console.error('Error taking picture: ', error);
        }
    };

    const addSuggestion = () => {
        //  * 3. give similar categories as products that are already present in the grocery list
        let randomProduct = ["", "", ""];
        let index = 0;
        if (favouritesDB.length > 0) {
            // Take a favourite from the most frequent category
            if (filteredFavouritesByFavCat.length > 0) { // By favourite cat
                index = Math.floor(Math.random() * filteredFavouritesByFavCat.length);
                randomProduct[0] = filteredFavouritesByFavCat.splice(index, 1)[0];
                console.log(`FAVOURITES BY FAV CAT`);

                console.log(filteredFavouritesByFavCat);
            } else if (filteredFavouritesByGroceryCat.length > 0) { // By grocery cat
                index = Math.floor(Math.random() * filteredFavouritesByGroceryCat.length);
                randomProduct[0] = filteredFavouritesByGroceryCat.splice(index, 1)[0];
                console.log(`FAVOURITES BY GROCERY CAT`);
                console.log(filteredFavouritesByGroceryCat);
            } else { // Anything as long as it is a favourite
                index = Math.floor(Math.random() * favouritesDB.length);
                randomProduct[0] = favouritesDB.splice(index, 1)[0];
                console.log(`FAVOURITES BY ANY CAT`);
                console.log(favouritesDB);
            }
            randomProduct[1] = "Favourite";
        } else if (restDB.length > 0) {
            if (filteredRestByFavCat.length > 0) { // By favourite cat
                index = Math.floor(Math.random() * filteredRestByFavCat.length);
                randomProduct[0] = filteredRestByFavCat.splice(index, 1)[0];
                console.log(`REST BY FAV CAT`);

                console.log(filteredRestByFavCat);
            } else if (filteredRestByGroceryCat.length > 0) { // By grocery cat
                index = Math.floor(Math.random() * filteredRestByGroceryCat.length);
                randomProduct[0] = filteredRestByGroceryCat.splice(index, 1)[0];
                console.log(`REST BY GROCERY CAT`);
                console.log(filteredRestByGroceryCat);
            } else { // Anything as long as it is a favourite
                index = Math.floor(Math.random() * restDB.length);
                randomProduct[0] = restDB.splice(index, 1)[0];
                console.log(`REST BY ANY CAT`);
            }
            randomProduct[1] = "Normal";
        } else {
            index = Math.floor(Math.random() * exceptionsDB.length);
            randomProduct[0] = exceptionsDB.splice(index, 1)[0];
            console.log(`EXCEPTIONS BY ANY CAT`);
            randomProduct[1] = "Exception";
        }
        randomProduct[2] = "vegetablesFruits";
        addListElement(randomProduct);
    }

    const storageGrocery = getRecords("groceryList");
    const storedGrocery = (storageGrocery as { name: string, info: string, selected: string }[]).map(x => [x.name, x.info, x.selected]);
    console.log(storedGrocery);
    const [items, setItems] = useState(storedGrocery);

    const addListElement = (str: string[]) => {
        const newItems = [...items];
        newItems.push([str[0], str[1], "0", str[2]]);
        setItems(newItems);

        storageGrocery.push({ name: str[0], info: str[1], "selected": "0", category: str[2]});
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
        updatedList.push([itemName, "Normal", "0"]);
        setItems(updatedList);

        storageGrocery.push({ name: itemName, info: "Normal", "selected": "0" , category: "vegetablesFruits"});
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

    function showInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.remove("none");
	}
	
	function closeInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.add("none");
	}

    return (
        <IonPage className='body'>

                    <div onClick={showInfo} className='info-btn'>
						<img src="/assets/info.png" alt="info" />
					</div>
					<div className='info-modal none'>
						<div onClick={closeInfo} className='info-modal_close'>
							<img src="/assets/close.png" alt="close" />
						</div>
						<div className='info-modal_text'>
						This is the Smart Grocery List where you can select products you would like to buy.
						<br/>							<br/>

                        Press on an item to select it, and click <strong>Next</strong> when ready to get the final list.
						<br/>							<br/>

						Click <strong>Add Product</strong> to enter a missing product or <strong>Get Suggestions</strong> to get some smart suggestions from the application.
						<br/>							<br/>

						Manage your favourite or unwanted products in the <strong>Favourites & Exceptions</strong> section.
						</div>
					</div>
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
                                <div className={`item-info ${setInfoStyle(item[1])}`}>{setInfoText(item[1])}</div>
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
