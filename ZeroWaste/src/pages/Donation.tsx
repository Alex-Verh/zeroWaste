import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonButtons } from '@ionic/react';
import React, { useState } from 'react';
import './Donation.css';

const Donation: React.FC = () => {
	const locations = ["BLANK", "LOCATION 1", "LOCATION 2", "LOCATION 3"]
	const details = ["", "Lorem ipsum dolor sit amet, consectetur adipiscing elit 1. Fusce ipsum urna, iaculis eget tellus ac, maximus mattis velit. Pellentesque quis urna lacus. Nunc scelerisque pretium ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit 1. Fusce ipsum urna, iaculis eget tellus ac, maximus mattis velit. Pellentesque quis urna lacus. Nunc scelerisque pretium ullamcorper.", "Lorem ipsum 2", "Lorem ipsum 3"]

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [locationName, setLocationName] = useState("");
	const [locationDetails, setLocationDetails] = useState("");

	const setOpen = (isOpen: boolean, id: number) => {
		if (isOpen) {
			setLocationName(`${locations[id]}`);
			setLocationDetails(`${details[id]}`);
		}
		setIsModalOpen(isOpen);
	};

	return (
		<IonPage>
			<IonHeader>

			</IonHeader>

			<IonContent fullscreen>
				<img className="location1" onClick={() => setOpen(true, 1)}></img>
				<img className="location2" onClick={() => setOpen(true, 2)}></img>
				<img className="location3" onClick={() => setOpen(true, 3)}></img>

				<img  className="your-location"></img>

				<div className='custom-background'>
					<IonModal isOpen={isModalOpen}>
						<div>
							<IonHeader>
								<IonToolbar>
									<IonTitle>{locationName}</IonTitle>
									
									<IonButtons slot="end">
										<IonButton onClick={() => setOpen(false, 0)}>Close</IonButton>
									</IonButtons>
								</IonToolbar>
							</IonHeader>

							<IonContent id="modalContent">
								<p id='modalP'>{locationDetails}</p>
							</IonContent>

						</div>
					</IonModal>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Donation;
