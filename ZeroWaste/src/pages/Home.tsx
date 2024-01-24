import { IonContent, IonHeader, IonPage, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonRouterLink, NavContext } from '@ionic/react';
import './Home.css';
import React, { useEffect } from 'react';


/**
 * @POST / @UPDATE / @DELETE
 * Just call this method over the new list that has been modified in advance.
 */
export function modifyRecords(list: string, record: Object) {
	sessionStorage.setItem(list, JSON.stringify(record));
}

/**
 * @GET
 * Gets the array of objects per given list key.
 */
export function getRecords(list: string) {
	return JSON.parse(sessionStorage.getItem(list) as string | "[]");
}

export function backButton() {
	useEffect(() => {
		const onBackButton = (e: any) => {
			e.detail.register(10, () => {
				// Handle the back button press
				window.location.href = '/home';
			});
		};

		document.addEventListener('ionBackButton', onBackButton as EventListener);

		return () => {
			document.removeEventListener('ionBackButton', onBackButton as EventListener);
		};
	}, []);
}



const Home: React.FC = () => {
	backButton();
	return (
		<IonPage color='light' className='page'>
			<IonHeader>

			</IonHeader>
			<IonContent fullscreen>
				<div className='custom-background'>

					<IonRouterLink href="/groceries-list">
						<IonCard className="custom-card">
							<IonImg src="/assets/main_1.jpg"></IonImg>
							<IonCardHeader>
								<IonCardTitle className="custom-title">Groceries List</IonCardTitle>
							</IonCardHeader>
							<IonCardContent className="custom-text">
								<p>
									Here you can create your own grocery list with help of smart recommendation.
								</p>
							</IonCardContent>
						</IonCard>
					</IonRouterLink>

					<IonRouterLink href="/current-products">
						<IonCard className="custom-card">
							<IonImg src="/assets/main_2.jpg"></IonImg>
							<IonCardHeader>
								<IonCardTitle className="custom-title">Current Food</IonCardTitle>
							</IonCardHeader>
							<IonCardContent className="custom-text">
								<p>
									Manage your products and be aware of wastage risks.
								</p>
							</IonCardContent>
						</IonCard>
					</IonRouterLink>

					<IonRouterLink href="/donation">
						<IonCard className="custom-card">
							<IonImg src="/assets/main_3.jpg"></IonImg>
							<IonCardHeader>
								<IonCardTitle className="custom-title">Donate</IonCardTitle>
							</IonCardHeader>
							<IonCardContent className="custom-text">
								<p>
									Reuse your wastage and excesses in effective way.
								</p>
							</IonCardContent>
						</IonCard>
					</IonRouterLink>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Home;
