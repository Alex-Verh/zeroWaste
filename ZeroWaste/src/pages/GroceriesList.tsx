import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton, IonHeader } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { checkmarkCircleOutline } from 'ionicons/icons';

if (window.location.href.endsWith("/groceries-list")) {
    window.onload = function () {
        (document.getElementById("items-list") as HTMLElement).addEventListener("pointerup", selectCard);
        (document.getElementById("button-next") as HTMLElement).addEventListener("pointerup", storeItems);
    }

    function selectCard(event: Event) {
        let item: HTMLElement | null = event.target as HTMLElement;
        if (item.parentElement !== null && item.parentElement !== undefined && item.parentElement.classList.contains("item")) {
            item = item.parentElement;
        }

        const tick: HTMLElement | null = item.getElementsByClassName("item-icon")[0] as HTMLElement;
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
        item.getAttribute("id") != "items-list" && item.classList.add("item-deselected");
        if (tick !== null) {
            tick.style.display = "none";
        }
        console.log("NOT");
    }

    function storeItems() {
        const selectedItems = document.getElementsByClassName("item-selected");
        const items = [];
        for (const item of selectedItems) {
            const name = item.getElementsByClassName("item-name")[0].textContent;
            const info = item.getElementsByClassName("item-info")[0].textContent;
            items.push([name, info]);
        }
        sessionStorage.setItem("selectedItems", JSON.stringify(items));
    }
}

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

const GroceriesList: React.FC = () => (
    <IonPage className='body'>
        <IonHeader>

        </IonHeader>
        <IonContent fullscreen>
        <div className='custom-background'>

            <h2><b  style={{ marginLeft: '5px' }}>Grocery List</b></h2>
            <sub style={{ fontSize: '15px'}}>Press to select the items you want to add</sub>
            <IonButton href="/final-grocery-list" fill="clear" id='button-next'>Next</IonButton>

            <section id="items-list">
                <div className="item item-selected">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" />
                </div>

                <div className="item">
                    <div className="item-name">Carrots</div>
                    <div className="item-info item-risk">High Risk of Wastage!</div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Apples</div>
                    <div className="item-info item-warning">You already have a lot!</div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
                
            </section>
            </div>
        </IonContent>

        <footer className="foot-buttons">
            <IonButton onClick={takePicture} fill="clear" expand="full" className='button-add foot-btn'>Add Product</IonButton>
            <IonButton fill="clear" expand="full" className='button-stat foot-btn'>Get Suggestions</IonButton>
            <IonButton href="/statistics" fill="clear" expand="full" className='button-stat foot-btn'>See Statistics</IonButton>
        </footer>
    </IonPage>
);

export default GroceriesList;
