import React, { useEffect } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { subscribeProyects, type Proyect } from '../services/proyects';
import CreateProyectModal from '../components/CreateProyectModal';
import './Home.css';

const Home: React.FC = () => {
  const user = getCurrentUser();
  const history = useHistory();
  const [proyects, setProyects] = React.useState<Proyect[]>([]);
  const [showCreate, setShowCreate] = React.useState(false);

  useEffect(() => subscribeProyects(setProyects), []);

  const handleCreateProject = () => {
    setShowCreate(true);
  };

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  const openProyect = (name: string) => {
    history.push(`/proyects/${name}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plot Me {user?.email}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleCreateProject}>Crear Proyecto</IonButton>
            <IonButton onClick={handleLogout}>Salir</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Proyectos</IonLabel>
          </IonListHeader>
          {proyects.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay proyectos todavía.</IonLabel>
            </IonItem>
          )}
          {proyects.map((p) => (
            <IonItem button key={p.id} onClick={() => openProyect(p.name)}>
              <IonLabel>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <CreateProyectModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => {}}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
