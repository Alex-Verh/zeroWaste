import { IonContent, IonPage, IonIcon, IonButton, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonHeader, IonButtons, IonTitle, IonToolbar, IonInput } from '@ionic/react';
import './Statistics.css';
import { closeOutline } from 'ionicons/icons';
import React, { useState } from 'react';


const Statistics: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let listID = "";
    function setOpen(isOpen: boolean, list: string) {
        if (isOpen) {
            console.log(list);
            listID = list;
        }
        setIsModalOpen(isOpen);
    }

    const [favourites, setFavourites] = useState(['Onions', 'Chocolate', 'Apples']);
    const [wasted, setWasted] = useState(['Tomatoes', 'Carrots', 'Milk']);

    function addItem() {
        const itemName = (document.getElementById("input-item-name") as HTMLInputElement)?.value.trim();
        if (listID.includes("favourites")) {
            setFavourites([...favourites, itemName]);
        } else {
            setWasted([...wasted, itemName]);
        }
        setOpen(false, "");
    }

    const removeItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    };

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <IonCard className="card">
                        <IonImg src="/assets/main_1.jpg"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <IonCardTitle className="custom-title">Favourites</IonCardTitle>

                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="favourites-list">
                            {favourites.map((item, index) => (
                                <div className="item" key={index}>
                                    <div className="item-name">{item}</div>
                                    <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(favourites, setFavourites, index)} />
                                </div>
                            ))}
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => setOpen(true, "favourites-list")} fill="clear" expand="full" className='foot-btn' id="add-favourite">Add Product</IonButton>
                        </IonCardContent>
                    </IonCard>

                    <IonCard className="card">
                        <IonImg src="/assets/zero-waste.png"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <IonCardTitle className="custom-title">Wasted Food</IonCardTitle>

                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="wasted-list">
                            {wasted.map((item, index) => (
                                <div className="item" key={index}>
                                    <div className="item-name">{item}</div>
                                    <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem(wasted, setWasted, index)} />
                                </div>
                            ))}
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => setOpen(true, "wasted-list")} fill="clear" expand="full" className='foot-btn' id="add-wasted">Add Product</IonButton>
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
                                    <IonInput id="input-item-name" label="Enter product" labelPlacement="floating" fill="outline" placeholder="Product Name"></IonInput>
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