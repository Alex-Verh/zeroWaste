import { IonContent, IonHeader, IonPage, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonRouterLink } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage >
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
              <IonCardTitle className="custom-title">Donate </IonCardTitle>
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
