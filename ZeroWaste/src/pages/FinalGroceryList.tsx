import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import './GroceriesList.css';
import { getRecords } from './Home';
import { setInfoStyle } from './GroceriesList';

const FinalGroceryList: React.FC = () => {
    const [items, setItems] = useState<string[][]>([]);

    useEffect(() => {
        const storedItems: string[][] = JSON.parse(getRecords("finalList") as string || "[]");
        setItems(storedItems);
    }, []);

    return (
        <IonPage className='body'>
            <IonContent>
                <div className='custom-background'>
                    <h2><b style={{ marginLeft: '5px' }}>Final Grocery List</b></h2>
                    <sub style={{ fontSize: '15px' }}>Here is your final shopping list.</sub>
                    <IonButton href="/groceries-list" fill="clear" id='button-next' style={{ top: "1.1em", fontSize: "1em" }}>← Back</IonButton>

                    <section id="items-list">
                        {items.map((item, index) => (
                            <div className="item" key={index}>
                                <div className="item-name">{item[0]}</div>
                                <div className={`item-info ${setInfoStyle(item[1])}`}>{item[1] === "normal" ? "" : item[1]}</div>
                            </div>
                        ))}
                    </section>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default FinalGroceryList;
