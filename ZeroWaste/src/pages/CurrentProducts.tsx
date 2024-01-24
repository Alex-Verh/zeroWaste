import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { closeOutline } from 'ionicons/icons';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import { getRecords, modifyRecords } from './Home';
import { dairyEggs, meat, vegetablesFruits } from './GroceriesList';

import { Html5Qrcode } from "html5-qrcode";
import { Plugins } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';


const CurrentProducts: React.FC = () => {
    sessionStorage.setItem("currentRead", "1");

    let model: any, maxPredictions: any;

    const initAI = async () => {
        // Wait for TensorFlow.js to be ready
        await tf.ready();
        // Initialize Teachable Machine
        const URL = 'https://teachablemachine.withgoogle.com/models/9OJwhBCAG/';

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log('Teachable Machine model loaded:', model);
    };

    (async () => {
        await initAI();
    })();

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

            // Add Max String to the list //// Hardcoded to check that the function works
            // addItems([["Banana", "normal"], ["Carrot", "normal"], ["Chocolate", "normal"], ["Orange", "normal"]]);
            addItems([[maxString, "normal"]]);
        } catch (error) {
            console.error('Error taking picture: ', error);
        }
    };


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

    const storageCurrent = getRecords("currentList");
    const storedCurrent = (storageCurrent as { name: string, info: string }[]).map(x => [x.name, x.info]);
    console.log(storedCurrent);
    const [items, setItems] = useState(storedCurrent);

    /**
     *  This depends on the way the AI will return the scanned items, 
     *  but I have assumed that it will be a string with the items separated with a comma.
     */
    function addItems(scannedItems: string[][]) {
        const updatedItems = [...items, ...scannedItems];
        setItems(updatedItems);

        // Needed function for finding expiration date of a product
        const objectItems = updatedItems.map(x => ({ "name": x[0], "info": x[1], "expiryDate": x[2], "category": setCat(x[1])}));
        modifyRecords("currentList", objectItems);
    }
    
    function setCat(name: string) {
        let cat = "";
        if (vegetablesFruits.includes(name)) {
            cat = "vegetablesFruits";
        } else if (dairyEggs.includes(name)) {
            cat = "dairyEggs";
        } else if (meat.includes(name)) {
            cat = "meat";
        } else {
            cat = "other";
        }
        return cat;
    }

    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);

        storageCurrent.splice(index, 1);
        modifyRecords("currentList", storageCurrent);
    };      

    let scanner: any;
    // async function extractQR() {
    //     let cameraId: any;

    //     await Html5Qrcode.getCameras().then(devices => {
    //         if (devices && devices.length) {
    //             cameraId = devices[0].id;
    //             console.log('camera id: ', cameraId);
    //         }
    //     })

    //     scanner = new Html5Qrcode("reader");
    //     const config = { fps: 2, qrbox: { width: 250, height: 250 } };
        
    //     // scanner.start({ facingMode: "environment" }, config, qrSuccess, qrError);
    //     scanner.start(cameraId, config, qrSuccess, qrError);
    // }

    async function extractQR() {
        const DIRK = [
            ['Pancake', 'normal'],
            ['Banana', 'normal'],
            ['Beef', 'normal'],
            ['Ketchup', 'normal'],
            ['Mayonnaise', 'normal'],
            ['Kefir', 'normal'],
            ['Pickles', 'normal'],
            ['Buns', 'normal']
        ];
        
        const JUMBO = [
            ['Apple Juice', 'normal'],
            ['Orange Juice', 'normal'],
            ['Multifruit Juice', 'normal'],
            ['7UP', 'normal']
        ];

        try {
            const { Camera } = Plugins;

            const result = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
            });

            const imageUri = result.webPath;

            // Use BarcodeScanner to perform barcode scanning
            const mlkitResult = await BarcodeScanner.scan({ imageUri });

            if (!mlkitResult.cancelled) {
                // Barcode detected
                const qrCodeText = mlkitResult.text;
                console.log('QR Code Text:', qrCodeText);

                addItems(DIRK);
            } else {
                console.log('No QR Code detected');
            }
        } catch (error) {
            console.error('Error extracting QR code:', error);
        }
    }

    function qrSuccess(decodedText: any, decodedResult: any) {
        scanner.stop();
        console.log(decodedText);
        
        // const dirk = ['pancake', 'banana', 'beef', 'ketchup', 'mayonnaise', 'kefir', 'pickles', 'buns'];
        // const jumbo = ['apple juice', 'orange juice', 'multifruit juice', '7up'];

        const DIRK = [
            ['Pancake', 'normal'],
            ['Banana', 'normal'],
            ['Beef', 'normal'],
            ['Ketchup', 'normal'],
            ['Mayonnaise', 'normal'],
            ['Kefir', 'normal'],
            ['Pickles', 'normal'],
            ['Buns', 'normal']
        ];
        
        const JUMBO = [
            ['Apple Juice', 'normal'],
            ['Orange Juice', 'normal'],
            ['Multifruit Juice', 'normal'],
            ['7UP', 'normal']
        ];
        

        if (decodedText === 'DIRK') {
            addItems(DIRK);
        } else if (decodedText === 'JUMBO') {
            addItems(JUMBO);
        }
    }

    function qrError() {

    }

    function showInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.remove("none");
	}
	
	function closeInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.add("none");
	}

    function setDate(name: string, date: string) {
        const calcDate = new Date(date);
        console.log(calcDate);
        
        if (vegetablesFruits.includes(name)) {
            // Add 14 days to the date
            calcDate.setDate(calcDate.getDate() + 14);
        } else if (dairyEggs.includes(name)) {
            // Add 7 days to the date
            calcDate.setDate(calcDate.getDate() + 7);
        } else if (meat.includes(name)) {
            // Add 5 days to the date
            calcDate.setDate(calcDate.getDate() + 5);
        } else {
            return "";
        }
        return calcDate.toLocaleDateString("en-GB");
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

                        Add all items you have bought with <strong>Scan Receipt</strong> button after shopping.
						<br/>							<br/>

						Remove items from the list after using them by click <strong>X</strong> next to them.
						<br/>							<br/>

                        Get notified about expiries from the app by small descriptions for each product.
						<br/>							<br/>

						Manage your favourite or unwanted products in the <strong>Favourites & Exceptions</strong> section.
						</div>
					</div>

            <IonContent>
                <div className='custom-background'>
                    <h2><b style={{ marginLeft: '5px' }}>Current Products</b></h2>
                    <sub style={{ fontSize: '15px' }}>Manage your current product list</sub>

                    <section id="items-list">
                        {items.map((item, index) => (
                            <div className="item" key={index}>
                                <div className="item-name">{item[0]}</div>
                                <div className="item-info">{setDate(item[0], item[2])}</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(index)} />
                            </div>
                        ))}
                    </section>
                </div>
            </IonContent>

            <footer className='foot-buttons'>
                <canvas id="myCanvas" className='none'></canvas>
                <div id="reader" className='none' style={{ transform: 'scaleX(-1)' }}></div>
                <IonButton onClick={takePicture} fill="clear" expand="full" className='button-add foot-btn'>Scan Product</IonButton>
                <IonButton onClick={extractQR} fill="clear" expand="full" className='button-add foot-btn'>Scan Receipt</IonButton>
                <IonButton href="/statistics" fill="clear" expand="full" className='button-stat foot-btn'>Favourites & Exceptions</IonButton>
            </footer>
        </IonPage>
    );
};

export default CurrentProducts;