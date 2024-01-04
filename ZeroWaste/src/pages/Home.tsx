import { IonContent, IonHeader, IonPage, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonRouterLink } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage >
      <IonHeader>

      </IonHeader>
      <IonContent fullscreen>
        <div className='custom-background'>
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

        <IonCard className="custom-card">
          <IonRouterLink href="/donation">
            <IonImg src="/assets/main_3.jpg"></IonImg>
          </IonRouterLink>
          <IonCardHeader>
            <IonCardTitle className="custom-title">Donate Food</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="custom-text">
            <p>
            Reuse your wastage and excesses in effective way.
            </p>
          </IonCardContent>
        </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
