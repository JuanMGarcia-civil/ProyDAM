import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { signup } from '../services/auth';
import './Auth.css';

const Signup: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    setError('');
    try {
      signup(name, email, password);
      history.replace('/home');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-wrapper">
          <div className="auth-card">
            <h1 className="auth-brand">Plot Me</h1>
            <p className="auth-subtitle">Crea tu cuenta</p>

            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={name}
                onIonInput={(e) => setName(e.detail.value!)}
                placeholder="Tu nombre"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                placeholder="tu@email.com"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="auth-error">{error}</p>
              </IonText>
            )}

            <IonButton expand="block" className="ion-margin-top" onClick={handleSignup}>
              Registrarse
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              onClick={() => history.push('/login')}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
