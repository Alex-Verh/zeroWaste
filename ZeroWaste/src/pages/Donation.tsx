import { IonPage, IonHeader, IonToolbar, IonTitle, IonImg, IonContent, IonButton, IonModal, IonButtons } from '@ionic/react';
import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './Donation.css';
import myImage from '/assets/person.png';
import { useHistory } from 'react-router-dom';


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

		const randomNumber: number = Math.floor(Math.random() * 3) + 1;
		sessionStorage.setItem("randomNumber", randomNumber.toString());
		window.location.href = "/recommended-location";
	} catch (error) {
		console.error('Error taking picture:', error);
	}
};

const locations: string[] = ["", "Sustain Serve", "Nourish Network", "Harvest Heroes"]
const descriptions: string[] = ["", "SustainServe is a leading food donation company dedicated to minimizing food waste and combating hunger. With a focus on sustainability, they connect surplus food from restaurants, supermarkets, and events with local shelters and community organizations, making a positive impact on both the environment and those in need.",
	"Nourish Network strives to nourish communities by efficiently redistributing surplus food to those facing food insecurity. Through their innovative platform, local businesses and individuals can easily donate excess food, ensuring that wholesome meals reach hungry individuals and families, fostering a healthier and more resilient society.",
	"Harvest Heroes is on a mission to rescue surplus food and transform it into opportunities for those struggling with hunger. By partnering with food establishments, farms, and catering services, they create a seamless network that redirects quality food to charities, schools, and shelters, contributing to a more sustainable and compassionate food system."]
const addresses: string[] = ["", "123 Green Street, EcoCity, Sustainableville", "789 Harvest Lane, FoodHub City, Nutrientville", "456 Farm Avenue, FreshFields, Growtown"];
const phones: string[] = ["", "+1 (555) 123-4567", "+1 (555) 987-6543", "+1 (555) 789-0123"];
const emails: string[] = ["", "info@sustainserve.org", "contact@nourishnetwork.org", "support@harvestheroes.com"];
const distances: string[] = ["", "0.5", "1.1", "0.85"];
const rewards: string[] = ["", "5% of the product's price", "A one-time 3% discount voucher for all Nourish Network shops", "7% of the product's price"];

const Donation: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationName, setLocationName] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [distance, setDistance] = useState("");
	const [reward, setReward] = useState("");


	const history = useHistory();

    React.useEffect(() => {
        const onBackButton = (event: Event) => {
          event.preventDefault();
          history.replace('/home');
        };
    
        document.addEventListener('ionBackButton', onBackButton as EventListener);
    
        return () => {
          document.removeEventListener('ionBackButton', onBackButton as EventListener);
        };
      }, [history]);


	const setOpen = (isOpen: boolean, id: number) => {
		if (isOpen) {
			setLocationName(`${locations[id]}`);
			setDescription(`${descriptions[id]}`);
			setAddress(`${addresses[id]}`);
			setPhone(`${phones[id]}`);
			setEmail(`${emails[id]}`);
			setDistance(`${distances[id]}`);
			setReward(`${rewards[id]}`);
		}
		setIsModalOpen(isOpen);
	};

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="your-location">
					<IonImg src={myImage}></IonImg>
					<div className="your-caption">You are here</div>
				</div>

				<div className="location1 location" onClick={() => setOpen(true, 1)}>
					<img className="donation"></img>
					<div className="caption">Sustain Serve</div>
				</div>

				<div className="location2 location" onClick={() => setOpen(true, 2)}>
					<img className="donation"></img>
					<div className="caption">Nourish Network</div>
				</div>

				<div className="location3 location" onClick={() => setOpen(true, 3)}>
					<img className="donation"></img>
					<div className="caption">Harvest Heroes</div>
				</div>

				<div className='donation-map'>
					<IonModal isOpen={isModalOpen}>
						<div>
							<IonHeader>
								<IonToolbar color="ligth">
									<IonTitle className='ion-title'>{locationName}</IonTitle>

									<IonButtons slot="end">
										<IonButton onClick={() => setOpen(false, 0)}>Close</IonButton>
									</IonButtons>
								</IonToolbar>
							</IonHeader>

							<IonContent id="modalContent">
								<div className='custom-background'>
									<h5><b>Description</b></h5>
									<p>{description}</p>

									<h5><b>Address</b></h5>
									<p>{address}</p>

									<h5><b>Telephone Number</b></h5>
									<p>{phone}</p>

									<h5><b>Email</b></h5>
									<p>{email}</p>

									<h5><b>Distance</b></h5>
									<p>Approximately {distance} km away.</p>

									<h5><b>Reward</b></h5>
									<p>{reward}</p>
								</div>
							</IonContent>

						</div>
					</IonModal>
				</div>
				<IonButton fill="clear" expand="full" onClick={takePicture} className="donate-btn">Scan Product</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Donation;


export const RecommendedLocation: React.FC = () => {
	const randomNumber: number = Number(sessionStorage.getItem("randomNumber"));
	console.log(`Your lucky number is: ${randomNumber}`);

	const locationName: string = locations[randomNumber];
	const description: string = descriptions[randomNumber];
	const address: string = addresses[randomNumber];
	const phone: string = phones[randomNumber];
	const email: string = emails[randomNumber];
	const distance: string = distances[randomNumber];
	const reward: string = rewards[randomNumber];

	const [isRecommendationOpen, setRecommendationOpen] = useState(true);

	return (
		<IonPage>
			<IonContent>
				<IonModal isOpen={isRecommendationOpen}>
					<div>
						<IonHeader>
							<IonToolbar>
								<IonTitle className='ion-title'>{locationName}</IonTitle>

								<IonButtons slot="end">
									<IonButton href='/donation'>Close</IonButton>
								</IonButtons>
							</IonToolbar>
						</IonHeader>

						<IonContent id="modalContent">
							<div className='custom-background'>
								<h5><b className='recommendation'>Thank you! We recommend you to donate here:</b></h5>
								<h5><b>Description</b></h5>
								<p>{description}</p>

								<h5><b>Address</b></h5>
								<p>{address}</p>

								<h5><b>Telephone Number</b></h5>
								<p>{phone}</p>

								<h5><b>Email</b></h5>
								<p>{email}</p>

								<h5><b>Distance</b></h5>
								<p>Approximately {distance} km away.</p>

								<h5><b>Reward</b></h5>
								<p>{reward}</p>
							</div>
						</IonContent>
					</div>
				</IonModal>
			</IonContent>
		</IonPage>
	)
}
