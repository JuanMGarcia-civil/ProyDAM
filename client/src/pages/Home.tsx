import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logout } from '../services/auth';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plot Me</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="plot-wrapper">
          <img
            className="plot-image"
            src="https://matplotlib.org/3.4.3/_images/sphx_glr_simple_plot_0011.png"
            alt="Plot generado"
          />
          <p className="plot-caption">plot generado</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
