import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { getRecords } from './Home';

const FinalGroceryList: React.FC = () => {
    const [items, setItems] = useState<string[][]>([]);

    useEffect(() => {
        const storedItems: string[][] = JSON.parse(getRecords("finalList") as string || "[]");
        setItems(storedItems);
    }, []);

    const storageGrocery = getRecords("currentList");
    function inCurrentProducts(itemName: string) {
        const groceryNames = (storageGrocery as { name: string }[]).map(x => x.name);
        return groceryNames.includes(itemName);
    }

    function setInfoStyle(name: string, info: string) {
        let infoStyle = "";
        if (inCurrentProducts(name)) {
            infoStyle = "item-warning";
        } else if (info === "exception") {
            infoStyle = "item-risk";
        } else if (info === "favourite") {
            infoStyle = "item-favourite";
        }
        return infoStyle;
    }

    function setInfoText(name: string, info: string) { // ADD IN CURRENT PRODUCTS
        let infoText = "";
        if (inCurrentProducts(name)) { 
            infoText = "Already Have It";
        } else if (info === "exception") {
            infoText = "In Exceptions";
        } else if (info === "favourite") {
            infoText = "Favourite";
        }
        return infoText;
    }

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <h2><b style={{ marginLeft: '5px' }}>Final Grocery List</b></h2>
                    <sub style={{ fontSize: '15px' }}>Here is your final shopping list.</sub>
                    <IonButton href="/groceries-list" fill="clear" id='button-next' style={{ top: "1.1em", fontSize: "1em" }}>← Back</IonButton>

                    <section id="final-list">
                        {items.map((item, index) => (
                            <div className="item" key={index}>
                                <div className="item-name">{item[0]}</div>
                                <div className={`item-info ${setInfoStyle(item[0], item[1])}`}>{setInfoText(item[0], item[1])}</div>
                            </div>
                        ))}
                    </section>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default FinalGroceryList;
