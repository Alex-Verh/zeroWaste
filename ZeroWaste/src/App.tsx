// src/App.tsx
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Donation from './pages/Donation';
import Statistics from './pages/Statistics';
import GroceriesList from './pages/GroceriesList';
import CurrentProducts from './pages/CurrentProducts';
import FinalGroceryList from './pages/FinalGroceryList';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
	if (sessionStorage.getItem("currentRead") !== "1") {
		sessionStorage.setItem("currentList", JSON.stringify([
			{
				"name": "Bananas",
				"info": "Normal",
				"expiryDate": "25.01.2024",
				"category": "vegetablesFruits"
			},
			{
				"name": "Onions",
				"info": "High Risk of Wastage",
				"expiryDate": "17.02.2024",
				"category": "vegetablesFruits"
			},
			{
				"name": "Bread",
				"info": "Favourite",
				"expiryDate": "26.01.2024",
				"category": "others"
			},
			{
				"name": "Cookies",
				"info": "Favourite",
				"expiryDate": "31.01.2024",
				"category": "others"
			}
		]));
	}
	
	if (sessionStorage.getItem("groceryRead") !== "1") {
		sessionStorage.setItem("groceryList", JSON.stringify([
			{
				"name": "Bananas",
				"info": "Favourite",
				"selected": "0",
				"category": "vegetablesFruits"
			},
			{
				"name": "Onions",
				"info": "High Risk of Wastage",
				"selected": "0",
				"category": "vegetablesFruits"
			},
			{
				"name": "Soda",
				"info": "Normal",
				"selected": "0",
				"category": "others"
			},
			{
				"name": "Cookies",
				"info": "Normal",
				"selected": "0",
				"category": "others"
			}
		]));
	}
	
	if (sessionStorage.getItem("statisticsRead") !== "1") {
		sessionStorage.setItem("favouriteList", JSON.stringify([
			{
				"name": "Bananas",
				"info": "Favourite",
				"category": "vegetablesFruits"
			},
			{
				"name": "Apples",
				"info": "Favourite",
				"category": "vegetablesFruits"
			},
			{
				"name": "Bread",
				"info": "Favourite",
				"category": "others"
			}
		]));
	
		sessionStorage.setItem("exceptionList", JSON.stringify([
			{
				"name": "Milk",
				"info": "Exception",
				"category": "dairiesEggs"
			},
			{
				"name": "Peanuts",
				"info": "Exception",
				"category": "others"
			},
			{
				"name": "Beans",
				"info": "Exception",
				"category": "others"
			}
		]));
	}
	
	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/home">
						<Home />
					</Route>
					<Route exact path="/">
						<Redirect to="/home" />
					</Route>
					<Route exact path="/donation">
						<Donation />
					</Route>
					<Route exact path="/statistics">
						<Statistics />
					</Route>
					<Route exact path="/groceries-list">
						<GroceriesList />
					</Route>
					<Route exact path="/current-products">
						<CurrentProducts />
					</Route>
					<Route exact path="/final-grocery-list">
						<FinalGroceryList />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	)
};

export default App;
