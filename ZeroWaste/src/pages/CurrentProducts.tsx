import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { closeOutline } from 'ionicons/icons';

const takePicture = async () => {
    try {
        const result = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        // Handle the captured image data (result.dataUrl)
        console.log('Captured image data:', result.dataUrl);
    } catch (error) {
        console.error('Error taking picture:', error);
    }
};

const CurrentProducts: React.FC = () => {
    const [items, setItems] = useState(['Onions', 'Carrots', 'Apples', 'Onions', 'Onions', 'Onions', 'Onions', 'Onions', 'Onions', 'Onions']);

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <h2><b style={{ marginLeft: '5px' }}>Current Products</b></h2>
                    <sub style={{ fontSize: '15px' }}>Manage your current product list</sub>

                    <section id="items-list">
                        {items.map((item: string, index: number) => (
                            <div className="item" key={index}>
                                <div className="item-name">{item}</div>
                                <div className="item-info"></div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(index)} />
                            </div>
                        ))}
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
