import { useEffect, useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const API_BASE = 'http://localhost:5000';

const Proyect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getReportConent() {
      setLoading(true);
      axios
        .get(`${API_BASE}/uploads/${id}`)
        .then((response) => {
          setReportContent(response.data);
        })
        .catch((error) => {
          console.error('Error fetching report content:', error);
          setReportContent(null);
        })
        .finally(() => setLoading(false));
    }

    getReportConent();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Proyecto #{id}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              href={`${API_BASE}/uploads/${id}/Plots/Final_Report.docx`}
              download="Final_Report.docx"
            >
              <IonIcon slot="start" icon={downloadOutline} />
              Descargar informe
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading && (
          <div className="plot-wrapper">
            <IonSpinner />
          </div>
        )}
        {!loading && reportContent && (
          <div
            className="report-content"
            dangerouslySetInnerHTML={{ __html: reportContent }}
          />
        )}
        {!loading && !reportContent && (
          <div className="plot-wrapper">
            <p className="plot-caption">No se pudo cargar el reporte.</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Proyect;
