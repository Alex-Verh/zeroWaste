import { IonContent, IonPage, IonIcon, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { checkmarkCircleOutline } from 'ionicons/icons';
import ReactDOM from 'react-dom';

if (window.location.href.endsWith("/final-grocery-list")) {
    window.addEventListener("load", appendItems);

    function appendItems() {
        const section = document.getElementById("items-list");
        const items: string[] = JSON.parse(sessionStorage.getItem("selectedItems") || "[]");
        console.log(items);

        const parsedItems: JSX.Element[] = [];
        for (const item of items) {
            let infoStyle = "item-info";
            if (item[1] !== undefined && item[1] !== null) infoStyle += " item-risk";
            parsedItems.push(
                <div key={item[0]} className="item">
                    <div className="item-name">{item[0]}</div>
                    <div className={infoStyle}>{item[1]}</div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>
            );
        }

        ReactDOM.render(parsedItems, section);
    }
}

const FinalGroceryList: React.FC = () => (
    <IonPage className='body'>
        <IonContent>
            <h2 style={{ margin: "1em 0" }}><b>Final Grocery List</b></h2>
            <IonButton href="/groceries-list" fill="clear" id='button-next' style={{ top: "1.1em", fontSize: "1em" }}>&#8592; Back</IonButton>

            <section id="items-list">
                {/* <div className="item">
                    <div className="item-name">Onions</div>
                    <div className="item-info"></div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div>

                <div className="item">
                    <div className="item-name">Carrots</div>
                    <div className="item-info item-risk">High Risk of Wastage!</div>
                    <IonIcon icon={checkmarkCircleOutline} className="item-icon" style={{ display: "none" }} />
                </div> */}
            </section>
        </IonContent>
    </IonPage>
);

export default FinalGroceryList;