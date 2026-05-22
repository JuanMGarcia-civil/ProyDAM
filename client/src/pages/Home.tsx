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
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser, logout } from '../services/auth';
import CreateProyectModal from '../components/CreateProyectModal';
import './Home.css';

interface Proyect {
  id: string;
}

const Home: React.FC = () => {
  const API_BASE = 'http://localhost:5000';
  const user = getCurrentUser();
  const history = useHistory();
  const [proyects, setProyects] = React.useState<Proyect[]>([]);
  const [showCreate, setShowCreate] = React.useState(false);

  const fetchProyects = async () => {
    const response = await axios.get(`${API_BASE}/proyects`);
    setProyects(response.data.proyects ?? []);
  };

  useEffect(() => {
    fetchProyects();
  }, []);

  const handleCreateProject = () => {
    setShowCreate(true);
  };

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  const openProyect = (id: string) => {
    history.push(`/proyects/${id}`);
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
            <IonItem button key={p.id} onClick={() => openProyect(p.id)}>
              <IonLabel>Proyecto</IonLabel>
              <IonNote slot="end">#{p.id}</IonNote>
            </IonItem>
          ))}
        </IonList>

        <CreateProyectModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={() => fetchProyects()}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
