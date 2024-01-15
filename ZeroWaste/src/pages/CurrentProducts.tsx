import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { closeOutline } from 'ionicons/icons';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';


const CurrentProducts: React.FC = () => {
    let model:any, maxPredictions:any;


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
                
                // Add Max String to the list
                items.push(maxString);
                const newItems = [...items];
                setItems(newItems);
                refreshList();
            } catch (error) {
                console.error('Error taking picture: ', error);
            }
        };


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
    

    const [items, setItems] = useState(['Onions', 'Carrots', 'Apples']);


    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };
    const itemList = document.querySelector("#items-list");

    const refreshList = () => {
        console.log(items)

        if (itemList) {
          const itemsHtml = items.map((item: string, index: number) => (
            `<div class="item" key=${index}>
              <div class="item-name">${item}</div>
              <div class="item-info"></div>
              <ion-icon icon=${closeOutline} class="cross-icon" onClick=${() => removeItem(index)}></ion-icon>
            </div>`
          )).join(''); // Use join to concatenate the array into a string
      
          itemList.innerHTML = itemsHtml;
        }
      };


      useEffect(() => {
        // Call refreshList when the component mounts to display the initial items
        refreshList();
      }, []);
    
    return (

        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <h2><b style={{ marginLeft: '5px' }}>Current Products</b></h2>
                    <sub style={{ fontSize: '15px' }}>Manage your current product list</sub>

                    <section id="items-list">
                    </section>
                </div>
            </IonContent>

            <footer className='foot-buttons'>
                <IonButton onClick={takePicture} fill="clear" expand="full" className='button-add foot-btn'>Add Product</IonButton>
                <IonButton href="/donation" fill="clear" expand="full" className='button-add foot-btn'>Donate</IonButton>
                <IonButton href="/statistics" fill="clear" expand="full" className='button-stat foot-btn'>See Statistics</IonButton>
            </footer>
        </IonPage>
    );
};


export default CurrentProducts;
