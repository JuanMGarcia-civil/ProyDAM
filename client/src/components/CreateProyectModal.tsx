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
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const CreateProyectModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [proyectId, setProyectId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setProyectId('');
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
    const id = proyectId.trim();
    if (!id) {
      setError('El ID del proyecto es obligatorio.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/proyects`, { id });

      if (files.length > 0) {
        const fd = new FormData();
        for (const f of files) {
          fd.append('files', f, f.name);
        }
        await axios.post(`${API_BASE}/proyects/${id}/upload`, fd);
      }

      axios.post(`${API_BASE}/proyects/${id}/execute_plots`);

      onCreated(id);
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
          <IonLabel position="stacked">ID del proyecto</IonLabel>
          <IonInput
            value={proyectId}
            onIonInput={(e) => setProyectId(e.detail.value ?? '')}
            placeholder="ej. 2"
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
