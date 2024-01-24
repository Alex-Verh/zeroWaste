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
    "apples", "bananas", "milk", "bread", "eggs", "chicken", "rice", "pasta", "tomatoes", "potatoes",
"onions", "carrots", "spinach", "broccoli", "cheese", "yogurt", "butter", "olive oil", "cereal",
"orange juice", "coffee", "tea", "sugar", "flour", "salt", "pepper", "cucumber", "bell peppers",
"lettuce", "garlic", "honey", "peanut butter", "jelly", "bacon", "sausages", "ground beef", "salmon",
"shrimp", "mayonnaise", "mustard", "ketchup", "pickles", "soy sauce", "vinegar", "salsa", "chips",
"cookies", "chocolate", "ice cream", "frozen vegetables", "frozen pizza", "frozen fruits", "almonds",
"walnuts", "cashews", "trail mix", "granola bars", "muesli", "peanuts", "beans",
"bottled water", "soda", "juice boxes", "wine", "beer", "chips ahoy", "popcorn", "canned soup",
"instant noodles", "spaghetti sauce", "cheddar cheese", "sour cream", "sliced ham", "pineapple",
"avocado", "ground turkey", "oatmeal", "pancake mix", "maple syrup"
];
export const vegetablesFruits: string[] = ["apples", "apricots", "artichokes", "asparagus", "avocado", "bananas", "beets", "bell peppers", "blackberries",
"blueberries", "bok choy", "broccoli", "brussels sprouts", "cabbage", "cantaloupe", "carrots", "cauliflower",
"celery", "cherries", "collard greens", "cranberries", "cucumber", "dragon fruit", "eggplant", "figs", "garlic", 
"grapes", "grapefruit", "green beans", "guava", "honey", "kiwi", "kale", "leeks", "lemons", "lettuce", "limes", 
"mango", "melon", "nectarines", "okra", "onions", "oranges", "papaya", "passion fruit", "peaches", "pears", 
"peas", "persimmons", "pineapple", "plums", "pomegranate", "potatoes", "pumpkin", "radishes", "raspberries", 
"rutabaga", "spinach", "squash", "strawberries", "sweet potatoes", "tomatoes", "turnips", "watercress", 
"watermelon", "kiwi berries", "mulberries", "gooseberries", "black currants", "elderberries", "boysenberries", 
"cherimoya", "papaya", "star fruit", "rhubarb", "guava", "cactus pear", "plantain", "quince", "clementine", 
"tangerines", "kumquat", "jackfruit", "lychee", "persimmons", "passion fruit", "apricot", "pomelo", "blood orange", 
"ugli fruit", "yuzu", "boysenberry", "marionberry", "loganberry", "cloudberries", "lingonberries", "kiwi gold", 
"grapefruit", "tangelo", "nectarines", "pawpaw", "watermelon radish", "daikon radish", "fennel", "kohlrabi", 
"sunchokes", "parsnips", "turnip greens", "rutabaga", "wasabi", "water spinach", "rapini", "chayote", "tatsoi", 
"endive", "escarole", "frisee", "radicchio", "bamboo shoots"
];
export const dairyEggs: string[] = ["milk", "cheese", "yogurt", "butter", "sour cream", "cheddar cheese", "cream cheese", "cottage cheese",
"whipped cream", "mozzarella cheese", "feta cheese", "parmesan cheese", "gouda cheese", "brie cheese",
"blue cheese", "swiss cheese", "provolone cheese", "greek yogurt", "vanilla yogurt", "strawberry yogurt",
"raspberry yogurt", "almond milk", "soy milk", "coconut milk", "whipped butter", "salted butter", "unsalted butter",
"buttermilk", "evaporated milk", "condensed milk", "eggs"
];
export const meat: string[] = [
    "chicken", "beef", "pork", "lamb", "turkey", "veal", "duck", "quail", "rabbit", "bacon", "sausages", 
    "ground beef", "ham", "salami", "pepperoni", "pastrami", "chorizo", "prosciutto", "turkey bacon", 
    "lamb chops", "pork chops", "ground turkey", "chicken breasts", "chicken thighs", "chicken wings", 
    "beef tenderloin", "ribeye steak", "sirloin steak", "filet mignon", "pork loin", "pork ribs", 
    "lamb shanks", "lamb ribs", "turkey legs", "duck breasts", "quail eggs", "veal cutlets", "beef stew meat", 
    "ground pork", "ground lamb", "ground chicken", "liver", "tripe", "kidneys", "tongue", "sausage links", 
    "beef jerky", "lamb sausages", "chicken liver", "pork belly", "salmon", "tuna", "cod", "tilapia", "trout", "catfish", "halibut", "mahi-mahi", "swordfish", "snapper",
    "sea bass", "sole", "perch", "haddock", "mackerel", "anchovies", "sardines", "herring", "smoked salmon",
    "shrimp", "prawns", "lobster", "crab", "clams", "mussels", "oysters", "scallops", "squid", "octopus",
    "caviar", "anchovy paste", "fish fillets", "fish sticks", "fish cakes", "smoked mackerel", "smoked haddock",
    "smoked trout", "whitefish", "canned tuna", "canned salmon", "canned sardines", "canned anchovies",
    "frozen shrimp", "frozen fish fillets", "fish roe", "fish sauce", "sushi-grade tuna", "calamari",
    "fish stock", "seafood mix"    
    ];
export const other: string[] = [
    "bread", "baguette", "whole wheat bread", "multigrain bread", "white bread", "rye bread", "sourdough bread",
    "pita bread", "naan", "tortillas", "English muffins", "bagels", "croissants", "ciabatta", "focaccia",
    "crackers", "rice", "brown rice", "white rice", "jasmine rice", "basmati rice", "wild rice", "quinoa", 
    "barley", "bulgur", "couscous", "oats", "rolled oats", "steel-cut oats", "muesli", "granola", "pasta", 
    "spaghetti", "penne", "fettuccine", "linguine", "farfalle", "macaroni", "lasagna noodles", "rice noodles", 
    "whole wheat pasta", "gluten-free pasta", "cereal", "cornflakes", "oatmeal cookies", "rice cakes", 
    "popcorn", "cinnamon rolls", "pretzels", "croutons", "soup", "vegetables", "beans", "tomatoes", "fruits", "tuna", "salmon", "chicken", "corn", "peas", 
    "green beans", "carrots", "mushrooms", "olives", "peaches", "pears", "pineapple", "mandarin oranges",
    "coconut milk", "chickpeas", "kidney beans", "black beans", "refried beans", "baked beans", "soups", 
    "chili", "stew", "pasta sauce", "diced tomatoes", "tomato paste", "tomato sauce", "sardines", "anchovies", 
    "crab", "clams", "oysters", "shrimp", "condensed milk", "evaporated milk", "sweetened condensed milk", 
    "coconut cream", "pumpkin", "cranberry sauce", "green chilies", "pickles", "beets", "artichoke hearts", "olive oil", "vegetable oil", "canola oil", "coconut oil", "sesame oil", "peanut oil", "sunflower oil", 
    "corn oil", "soybean oil", "avocado oil", "grapeseed oil", "walnut oil", "flaxseed oil", "cereal", "oats", "granola", "muesli", "cornflakes", "rice cereal", "wheat flakes", "bran flakes", 
    "puffed rice", "shredded wheat", "multigrain cereal", "instant oats", "oat bran", "quinoa flakes", "soy sauce", "ketchup", "mustard", "mayonnaise", "vinegar", "salsa", "hot sauce", "barbecue sauce", 
    "teriyaki sauce", "hoisin sauce", "Worcestershire sauce", "soybean paste", "oyster sauce", "fish sauce", 
    "pasta sauce", "tomato sauce", "alfredo sauce", "pesto sauce", "sour cream", "hummus", "tzatziki", "sugar", "brown sugar", "powdered sugar", "honey", "maple syrup", "agave nectar", "corn syrup", 
    "molasses", "artificial sweeteners", "stevia", "coconut sugar", "date sugar", "molasses", "chips", "cookies", "chocolate", "trail mix", "granola bars", "popcorn", "pretzels", "nuts", 
    "almonds", "walnuts", "cashews", "peanuts", "dried fruit", "fruit snacks", "rice cakes", 
    "crackers", "cheese crackers", "pretzel sticks", "popcorn balls", "tortilla chips", "salsa", 
    "guacamole", "hummus", "corn chips", "potato chips", "vegetable chips", "beef jerky", 
    "fruit leather", "chocolate-covered nuts", "chocolate-covered pretzels", "energy bars", "rice snacks", 
    "pita chips", "granola clusters", "chocolate bars", "gummy candies", "pretzel twists", "fruit and nut bars", 
    "yogurt-covered pretzels", "popcorn clusters", "rice crackers", "caramel popcorn", "toasted seaweed snacks", 
    "rice crisps", "dark chocolate-covered fruit", "trail mix with chocolate", "protein bars", "snack mix", "orange juice", "apple juice", "grape juice", "cranberry juice", "pineapple juice", "pomegranate juice",
    "strawberry juice", "blueberry juice", "raspberry juice", "blackberry juice", "kiwi juice", "mango juice",
    "watermelon juice", "peach juice", "pear juice", "cherry juice", "lemon juice", "lime juice", "passion fruit juice",
    "guava juice", "melon juice", "apricot juice", "plum juice", "coconut water", "cola", "lemon-lime soda", "orange soda", "root beer", "cream soda", "fruit-flavored sodas",
    "ginger ale", "grape soda", "cherry cola", "citrus sodas", "berry sodas", "vanilla soda", "peach soda", "iced tea", "sweet tea", "flavored iced tea", "iced coffee", "iced lattes", "fruit smoothies", "milkshakes",
    "iced fruit tea", "bubble tea", "slushies", "iced fruit infusions", "iced fruit lattes", "iced herbal teas",
    "iced matcha", "iced blended beverages", "fruit-flavored milkshakes", "fruit-flavored iced lattes", "lemonade", "fruit punch", "flavored water", "sports drinks", "energy drinks", "smoothies", "hot chocolate",
    "malted drinks", "fruit cocktails", "fruit nectars", "coconut water with flavors", "flavored lemonades",
    "flavored hot teas", "fruit-flavored energy drinks", "flavored sparkling water", "sweetened almond milk",
    "sweetened soy milk", "milk teas"
    ];

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
