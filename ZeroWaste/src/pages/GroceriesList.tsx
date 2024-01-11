import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { checkmarkCircleOutline } from 'ionicons/icons';

const GroceriesList: React.FC = () => (
    <IonPage className='body'>
        <IonContent className="items-list">
            <h2><b>Groceries List</b></h2>
            <p>Press to select the items you want to add</p>
            <IonButton fill="clear" className='button-next'>Next</IonButton>

            <div className="item item-selected">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Carrots</div>
                <div className="item-info item-risk">High Risk of Wastage!</div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Apples</div>
                <div className="item-info item-warning">You already have a lot!</div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <div className="item">
                <div className="item-name">Onions</div>
                <div className="item-info"></div>
                <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
            </div>

            <footer>
                <IonButton fill="clear" expand="full" className='button-add'>Add Product</IonButton>
                <IonButton fill="clear" expand="full" className='button-stat'>See Statistics</IonButton>
            </footer>

        </IonContent>
    </IonPage>
);

export default GroceriesList;
