import React from 'react';
import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { checkmarkCircleOutline } from 'ionicons/icons';

window.onload = function () {
    (document.getElementById("items-list") as HTMLElement).addEventListener("click", selectCard);
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
    item.classList.add("item-deselected");
    if (tick !== null) {
        tick.style.display = "none";
    }
    console.log("NOT");
}

const GroceriesList: React.FC = () => (
    <IonPage className='body'>
        <IonContent>
            <h2><b>Current Products</b></h2>
            <p>Press to select the items you want to add</p>
            <IonButton href="#" fill="clear" className='button-next'>Next &#8594;</IonButton>

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
            </section>
        </IonContent>

        <footer>
            <IonButton href="/camera" fill="clear" expand="full" className='button-add'>Add Product</IonButton>
            <IonButton href="/statistics" fill="clear" expand="full" className='button-stat'>See Statistics</IonButton>
        </footer>
    </IonPage>
);

export default GroceriesList;


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