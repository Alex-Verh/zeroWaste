import { IonContent, IonPage, IonIcon, IonButton, IonRouterLink, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './Statistics.css';
import { closeOutline } from 'ionicons/icons';
import ReactDOM from 'react-dom';
import React from 'react';

const Statistics: React.FC = () => {

    function addItem(listID: string) {
        const list = document.getElementById(listID);
        const item = document.createElement('div');
        item.className = 'item';

        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = 'Onions';

        const crossIcon = React.createElement(IonIcon, { icon: closeOutline, className: 'cross-icon', onClick: () => removeItem });

        item.appendChild(itemName);
        const crossIconContainer = document.createElement('span');
        ReactDOM.createPortal(crossIcon, crossIconContainer);
        item.appendChild(crossIconContainer);
        list?.appendChild(item);
    }

    function removeItem(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log("here");
        
        const item = event.currentTarget.parentElement;
        console.log(item);
        
        const list = item?.parentElement;
        list?.removeChild((item as HTMLElement));
    }

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <IonCard className="custom-card-stat">
                        <IonImg src="/assets/main_1.jpg"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <IonCardTitle className="custom-title">Favourites</IonCardTitle>

                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="favourites-list">
                            <div className="item">
                                <div className="item-name">Onions</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>

                            <div className="item">
                                <div className="item-name">Carrots</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>

                            <div className="item">
                                <div className="item-name">Apples</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => addItem("favourites-list")} fill="clear" expand="full" className='foot-btn' id="add-favourite">Add Product</IonButton>
                        </IonCardContent>
                    </IonCard>

                    <IonCard className="custom-card-stat">
                        <IonImg src="/assets/zero-waste.png"></IonImg>
                        <IonCardHeader style={{ marginBottom: "10px" }}>
                            <IonCardTitle className="custom-title">Wasted Food</IonCardTitle>

                            <p style={{ margin: 0, padding: 0 }}>
                                Press <span style={{ color: "red", margin: "0 5px", display: "inline", fontWeight: "bold" }}>X</span> to remove a product.
                            </p>
                        </IonCardHeader>

                        <IonCardContent className="custom-text list" id="wasted-list">
                            <div className="item">
                                <div className="item-name">Onions</div>
                                <div className="item-info"></div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>

                            <div className="item">
                                <div className="item-name">Carrots</div>
                                <div className="item-info item-risk">High Risk of Wastage!</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>

                            <div className="item">
                                <div className="item-name">Apples</div>
                                <div className="item-info item-warning">You already have a lot!</div>
                                <IonIcon icon={closeOutline} className="cross-icon" onClick={() => removeItem} />
                            </div>
                        </IonCardContent>

                        <IonCardContent className='custom-text button-section'>
                            <IonButton onClick={() => addItem("wasted-list")} fill="clear" expand="full" className='foot-btn' id="add-wasted">Add Product</IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Statistics;