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
import { login } from '../services/auth';
import './Auth.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    try {
      login(email, password);
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
            <p className="auth-subtitle">Inicia sesión para continuar</p>

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

            <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
              Entrar
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              onClick={() => history.push('/signup')}
            >
              ¿No tienes cuenta? Regístrate
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
