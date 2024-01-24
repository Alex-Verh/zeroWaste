import { IonContent, IonPage, IonIcon, IonButton, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonInput } from '@ionic/react';
import './Statistics.css';
import { closeOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { getRecords, modifyRecords } from './Home';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';


const Statistics: React.FC = () => {
    sessionStorage.setItem("statisticsRead", "1");

    // -------------- Scanning
    let model: any, maxPredictions: any;
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

    const takePicture = async (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
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
            console.log(event);
            
            console.log(event.target);
            
            addListElement(maxString, event);
        } catch (error) {
            console.error('Error taking picture: ', error);
        }
    };
    //---------------------

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listID, setListID] = useState("");
    const [itemName, setItemName] = useState("");
    function setOpen(isOpen: boolean, list: string) {
        setListID(list);
        setIsModalOpen(isOpen);
    }

    const storageFavourites = getRecords("favouriteList");
    const storedFavourites = (storageFavourites as { name: string }[]).map(x => x.name);
    console.log(storedFavourites);
    const storageExceptions = getRecords("exceptionList");
    const storedExceptions = (storageExceptions as { name: string }[]).map(x => x.name);
    console.log(storedExceptions);

    const [favourites, setFavourites] = useState(storedFavourites);
    const [wasted, setWasted] = useState(storedExceptions);

    function addItem() {
        const itemName = (document.getElementById("input-item-name") as HTMLInputElement)?.value.trim();
        console.log(listID)

        if (listID === "favourites-list") {
            const updatedItems = [...favourites, itemName];
            setFavourites(updatedItems);

            const asObject: Object = { name: itemName, info: "Favourite" };
            storageFavourites.push(asObject);
            modifyRecords("favouriteList", storageFavourites);
        } else if (listID === "wasted-list") {
            const updatedItems = [...wasted, itemName];
            setWasted(updatedItems);

            const asObject: Object = { name: itemName, info: "Exception" };
            storageExceptions.push(asObject);
            modifyRecords("exceptionList", storageExceptions);
        }
        setOpen(false, "");
        setItemName("");
    }

    const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, listType: string) => {
        const newList = [...list];
        console.log("INDEX: " + index);

        newList.splice(index, 1);
        console.log(newList);

        setList(newList);
        if (listType === "favouriteList") {
            storageFavourites.splice(index, 1);
            modifyRecords("favouriteList", storageFavourites);
        } else {
            storageExceptions.splice(index, 1);
            modifyRecords("exceptionList", storageExceptions);
        }
    };

    /// --------------------- For scanning
    const addListElement = (itemName: string, event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
        const item: HTMLIonButtonElement = event.target as HTMLIonButtonElement;
        console.log("HERE");
        console.log(item);
        
        if (item!.id === "scan-button-favourite") {
            const newItems = [...favourites, itemName];
            setFavourites(newItems);

            const asObject: Object = { name: itemName, info: "Favourite" };
            storageExceptions.push(asObject);
            modifyRecords("favouriteList", storageExceptions);
        } else {
            const newItems = [...wasted, itemName];
            setWasted(newItems);

            const asObject: Object = { name: itemName, info: "Exception" };
            storageExceptions.push(asObject);
            modifyRecords("exceptionList", storageExceptions);
        }
    }

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <IonCard className="card">
                        <IonImg src="/assets/main_1.jpg"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                            <IonCardTitle className="custom-title">Favourites</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="favourites-list">
                            {favourites.map((item, index) => (
                                <div className="item" key={index}>
                                    <div className="item-name">{item}</div>
                                    <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(favourites, setFavourites, index, "favouriteList")} />
                                </div>
                            ))}
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => setOpen(true, "favourites-list")} fill="clear" expand="full" className='foot-btn add-product' id="manual-button-favourite">Add Manually</IonButton>
                            <IonButton onClick={(event) => takePicture(event)} fill="clear" expand="full" className='foot-btn add-product' id="scan-button-favourite">Add by Scanning</IonButton>
                        </IonCardContent>
                    </IonCard>

                    <IonCard className="card">
                        <IonImg src="/assets/zero-waste.png"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                            <IonCardTitle className="custom-title">Wasted & Exceptions</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="wasted-list">
                            {wasted.map((item, index) => (
                                <div className="item" key={index}>
                                    <div className="item-name">{item}</div>
                                    <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(wasted, setWasted, index, "exceptionList")} />
                                </div>
                            ))}
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => setOpen(true, "wasted-list")} fill="clear" expand="full" className='foot-btn add-product' id="manual-button-exception">Add Manually</IonButton>
                            <IonButton onClick={(event) => takePicture(event)} fill="clear" expand="full" className='foot-btn add-product' id="scan-button-exception">Add by Scanning</IonButton>
                        </IonCardContent>
                    </IonCard>


                    <IonModal isOpen={isModalOpen}>
                        <div>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle className='ion-title'>Add Product</IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton onClick={() => setOpen(false, "")}>Close</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent id="modalContent">
                                <div className='custom-background'>
                                    <h5><b>Type in the name of the product:</b></h5>
                                    <IonInput id="input-item-name" label="Enter product here" labelPlacement="floating" fill="outline" placeholder="Product Name"></IonInput>
                                    <IonButton onClick={() => addItem()} fill="clear" expand="full" className='foot-btn' id="add-product">Add Product</IonButton>
                                </div>
                            </IonContent>
                        </div>
                    </IonModal>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Statistics;