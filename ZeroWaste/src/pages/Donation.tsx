import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonButtons } from '@ionic/react';
import React, { useState } from 'react';
import './Donation.css';

const Donation: React.FC = () => {
	const locations = ["", "Sustain Serve", "Nourish Network", "Harvest Heroes"]
	const descriptions = ["", "SustainServe is a leading food donation company dedicated to minimizing food waste and combating hunger. With a focus on sustainability, they connect surplus food from restaurants, supermarkets, and events with local shelters and community organizations, making a positive impact on both the environment and those in need.",
		"Nourish Network strives to nourish communities by efficiently redistributing surplus food to those facing food insecurity. Through their innovative platform, local businesses and individuals can easily donate excess food, ensuring that wholesome meals reach hungry individuals and families, fostering a healthier and more resilient society.",
		"Harvest Heroes is on a mission to rescue surplus food and transform it into opportunities for those struggling with hunger. By partnering with food establishments, farms, and catering services, they create a seamless network that redirects quality food to charities, schools, and shelters, contributing to a more sustainable and compassionate food system."]
	const addresses = ["", "123 Green Street, EcoCity, Sustainableville", "789 Harvest Lane, FoodHub City, Nutrientville", "456 Farm Avenue, FreshFields, Growtown"];
	const phones = ["", "+1 (555) 123-4567", "+1 (555) 987-6543", "+1 (555) 789-0123"];
	const emails = ["", "info@sustainserve.org", "contact@nourishnetwork.org", "support@harvestheroes.com"];
	const distances = ["", "0.5", "1.1", "0.85"];
	const rewards = ["", "5% of the product's price", "A one-time 3% discount voucher for all Nourish Network shops", "7% of the product's price"];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationName, setLocationName] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [distance, setDistance] = useState("");
	const [reward, setReward] = useState("");

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
			<IonHeader>

			</IonHeader>

			<IonContent fullscreen>
				<div className="your-location">
					<img src='https://www.freeiconspng.com/thumbs/location-icon-png/blue-location-icon-26.png'></img>
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
								<IonToolbar>
									<IonTitle className='ion-title'>{locationName}</IonTitle>

									<IonButtons slot="end">
										<IonButton onClick={() => setOpen(false, 0)}>Close</IonButton>
									</IonButtons>
								</IonToolbar>
							</IonHeader>

							<IonContent id="modalContent">
								{/* Description, Address, Telephone Number, Email */}
								<h5>Description</h5>
								<p>{description}</p>

								<h5>Address</h5>
								<p>{address}</p>

								<h5>Telephone Number</h5>
								<p>{phone}</p>

								<h5>Email</h5>
								<p>{email}</p>

								<h5>Distance</h5>
								<p>Approximately {distance} km away.</p>

								<h5>Reward</h5>
								<p>{reward}</p>
							</IonContent>

						</div>
					</IonModal>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Donation;
