// src/pages/CameraPage.tsx
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './CameraPage.css';

const CameraPage: React.FC = () => {
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
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Camera Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={takePicture}>Scan Product</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;
