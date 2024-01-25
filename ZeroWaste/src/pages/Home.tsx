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

	function showInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.remove("none");
	}
	
	function closeInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.add("none");
	}

	backButton();
	return (
		<IonPage color='light' className='page'>
			<IonHeader>

			</IonHeader>
			<IonContent fullscreen>
				<div className='custom-background'>
					<div onClick={showInfo} className='info-btn'>
						<img src="/assets/info.png" alt="info" />
						
					</div>
					<div className='info-modal none'>
						<div onClick={closeInfo} className='info-modal_close'>
							<img src="/assets/close.png" alt="close" />
						</div>
						<div className='info-modal_text'>
						The application ZeroWaste has three key-features that will help prevent food waste!
						<br/>							<br/>

						The first one is Smart Grocery List where you can compute a shopping products list with smart suggester.
						<br/>							<br/>

						The second one is Current Products List where you manage your current possessed products and get notified about upcoming expiries.
						<br/>							<br/>

						The third one is Donate Food Map where you can easily see the nearby location where you can donate your excesses or wastages.
						</div>
					</div>
					<IonRouterLink href="/groceries-list">
						<IonCard className="custom-card">
							<IonImg src="/assets/main_1.jpg"></IonImg>
							<IonCardHeader>
								<IonCardTitle className="custom-title">Grocery List</IonCardTitle>
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
								<IonCardTitle className="custom-title">Current Products</IonCardTitle>
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
