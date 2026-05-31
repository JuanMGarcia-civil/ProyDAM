import { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import axios from 'axios';
import { addProyect } from '../services/proyects';

const API_BASE = 'http://localhost:5000';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (name: string) => void;
}

const CreateProyectModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    setFiles([]);
    setError('');
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    const projectName = name.trim();
    setSubmitting(true);
    try {
      await addProyect(projectName, description.trim());

      if (files.length > 0) {
        const fd = new FormData();
        for (const f of files) {
          fd.append('files', f, f.name);
        }
        await axios.post(`${API_BASE}/proyects/${projectName}/upload`, fd);
      }

      axios.post(`${API_BASE}/proyects/${projectName}/execute_plots`);

      onCreated(projectName);
      handleClose();
    } catch (e: any) {
      setError(e?.message ?? 'Error al crear el proyecto');
      setSubmitting(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Proyecto</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose} disabled={submitting}>
              Cancelar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre del proyecto</IonLabel>
          <IonInput
            value={name}
            onIonInput={(e) => setName(e.detail.value ?? '')}
            placeholder="ej. Mi proyecto"
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Descripción</IonLabel>
          <IonTextarea
            value={description}
            onIonInput={(e) => setDescription(e.detail.value ?? '')}
            placeholder="Describe brevemente el proyecto"
            autoGrow
          />
        </IonItem>

        <IonItem lines="none" className="ion-margin-top">
          <IonLabel position="stacked">Ficheros (varios con Ctrl/Shift)</IonLabel>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            style={{ marginTop: 8 }}
          />
        </IonItem>
        {files.length > 0 && (
          <IonNote className="ion-margin-start">
            {files.length} archivo(s) seleccionado(s)
          </IonNote>
        )}

        {error && (
          <IonText color="danger">
            <p className="ion-margin-start">{error}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Creando...' : 'Crear'}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default CreateProyectModal;
