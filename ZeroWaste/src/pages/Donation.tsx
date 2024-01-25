import { IonPage, IonHeader, IonToolbar, IonTitle, IonImg, IonContent, IonButton, IonModal, IonButtons } from '@ionic/react';
import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './Donation.css';
import myImage from '/assets/person.png';
import * as tmImage from '@teachablemachine/image';


const Donation: React.FC = () => {
	// const URL = "https://teachablemachine.withgoogle.com/models/9OJwhBCAG/";
	const URL = 'https://teachablemachine.withgoogle.com/models/HffjZu5yK/';
	let model: any, maxPredictions: any;

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

			// Predict using TensorFlow.js model
			const classificationResult = await predict(result.dataUrl);

			recommendLocation();

			return classificationResult;
		} catch (error) {
			console.error('Error taking picture:', error);
		}
	};

	async function init() {
		const modelURL = URL + "model.json";
		const metadataURL = URL + "metadata.json";

		model = await tmImage.load(modelURL, metadataURL);
		maxPredictions = model.getTotalClasses();
	}

	const predict = async (imageData: any) => {
		// Ensure model is loaded before making predictions
		if (!model) {
			console.error('Model not loaded.');
			return;
		}

		const image = new Image();
		image.src = imageData;
		await image.decode();

		const prediction = await model.predict(image);
		console.log('Image classification prediction:', prediction);

		// extract the class label and probability from the prediction array
		// [0] has the highest prediction score
		const classLabel = prediction[0].className;
		const probability = prediction[0].probability.toFixed(2);

		return { classLabel, probability };
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

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationName, setLocationName] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [distance, setDistance] = useState("");
	const [reward, setReward] = useState("");
	const [showRecommendation, setShowRecommendation] = useState(false);

	function recommendLocation() {
		const randomNumber: number = Math.floor(Math.random() * 3) + 1;
		console.log(`Your lucky number is: ${randomNumber}`);

		const donationLocations = document.getElementsByClassName("location");
		for (let i = 0; i < donationLocations.length; i++) {
			if (i + 1 !== randomNumber) {
				(donationLocations[i] as HTMLElement).style.display = "none";
			} else {
				const recommendationBlock: HTMLElement | null = document.getElementById("recommendationBlock");
				if (recommendationBlock !== null) {
					recommendationBlock.style.display = "block";
				}
			}
		}
		(document.getElementsByClassName("donate-btn")[0] as HTMLElement).style.display = "none";
		setShowRecommendation(true);
	}

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

	function showInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.remove("none");
	}
	
	function closeInfo() {
		const infoModal = document.querySelector(".info-modal");
		infoModal && infoModal.classList.add("none");
	}

	return (
		<IonPage>
			<IonButton href="/home" fill="clear" id='button-next' style={{ zIndex:"9999", top: "0em", left:"-15em", fontSize: "1.1em", color:"#BB002E" }}>← Back</IonButton>

			<div onClick={showInfo} className='info-btn'>
				<img src="/assets/info.png" alt="info" />
			</div>
			<div className='info-modal none'>
				<div onClick={closeInfo} className='info-modal_close'>
					<img src="/assets/close.png" alt="close" />
				</div>
				<div className='info-modal_text'>

				Those are the locations where you can donate your food nearby.
				<br/>							<br/>

				Click on the location <strong>description</strong> or point to read more about it.
				<br/>							<br/>

				Some locations accept wasted food, some only big excesses.
				<br/>							<br/>

				Some locations offer rewards for the donation.
				<br/>							<br/>

				Not sure where to donate? Click <strong>Scan Product</strong> to detect best location based on the product.
				</div>
			</div>
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
								<IonToolbar color="light">
									<IonTitle className='ion-title'>{locationName}</IonTitle>

									<IonButtons slot="end">
										<IonButton onClick={() => setOpen(false, 0)}>Close</IonButton>
									</IonButtons>
								</IonToolbar>
							</IonHeader>

							<IonContent id="modalContent">
								<div className='custom-background'>
									<h5 id="recommendationBlock" style={{ display: showRecommendation ? 'block' : 'none' }}>
										<b id='recommendation'>Thank you! We suggest donating here:</b>
									</h5>

									<h5 style={{ marginTop: 0 }}><b>Description</b></h5>
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
