import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { checkmarkCircleOutline } from 'ionicons/icons';

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

const CurrentProducts: React.FC = () => (
    
    <IonPage className='body'>
        <IonContent>
            <h2 style={{ margin: "1em 0" }}><b>Current Products</b></h2>

            <section id="items-list">
                <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
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
            </section>
        </IonContent>

        <footer>
            <IonButton onClick={takePicture} fill="clear" expand="full" className='button-add'>Add Product</IonButton>
            <IonButton href="/statistics" fill="clear" expand="full" className='button-stat'>See Statistics</IonButton>
        </footer>
    </IonPage>
);

export default CurrentProducts;


// An attempt to make the sticky magic with JS; did not work \\

// window.onload = function () {
//     const footer = document.getElementsByTagName("footer")[0];
//     const sticky = footer.offsetTop;

//     function stickFooterButtons() {
//         if (window.pageYOffset > sticky) {
//             footer.classList.add("sticky");
//         } else {
//             footer.classList.remove("sticky");
//         }
//     }

//     window.onscroll = function () {
//         stickFooterButtons();
//     }

//     document.addEventListener("click", selectCard);
// }