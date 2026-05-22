# Firebase Auth — local setup

This client uses Firebase Authentication (email + password). Follow these steps **once** to make login work on your machine.

## 1. Enable Email/Password sign-in

1. Go to <https://console.firebase.google.com/> and open the **pruebasuperprof-38a91** project.
2. Left sidebar → **Build → Authentication** → click **Get started** (if you haven't already).
3. Open the **Sign-in method** tab → click **Email/Password** → toggle **Enable** → **Save**.

That's it. No tokens to generate by hand — Firebase will issue ID tokens automatically when users log in from the app.

## 2. Get the Web SDK config

The Admin SDK service account key (`server/firebase-admin-credentials.json`) is for backend code only. The **client** needs the public Web SDK config, which is different.

1. Firebase Console → ⚙️ (top-left, next to *Project Overview*) → **Project settings**.
2. Scroll to **Your apps**.
3. If there's already a **Web app** (`</>` icon), click it. Otherwise click **Add app → Web (</>)**, give it any nickname (e.g. "Plot Me web"), do **not** check "Firebase Hosting", click **Register app**.
4. You'll see a snippet like:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "pruebasuperprof-38a91.firebaseapp.com",
     projectId: "pruebasuperprof-38a91",
     storageBucket: "pruebasuperprof-38a91.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123def456",
   };
   ```
5. Copy those values.

> **Note:** these values are *public by design* — they identify your Firebase project to the browser. Security comes from (a) the **authorized domains** list in Firebase Auth settings and (b) your Firestore/Storage security rules. We still keep them in `.env` so dev and prod can point at different projects.

## 3. Create your local `.env`

From inside `client/`:

```bash
cp .env.example .env
```

Then open `client/.env` and paste each value from step 2:

```dotenv
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=pruebasuperprof-38a91.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pruebasuperprof-38a91
VITE_FIREBASE_STORAGE_BUCKET=pruebasuperprof-38a91.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123def456
```

The `VITE_` prefix is mandatory — Vite only exposes env vars that start with it to the browser.

`.env` is already in `.gitignore`, so it will not be committed.

## 4. Run the app

```bash
cd client
npm install        # only needed the first time, or after pulling new deps
npm run dev
```

Open the URL Vite prints (usually <http://localhost:5173>).

- **Sign up** → creates a user in Firebase Auth (visible in Console → Authentication → Users).
- **Log in** → signs in with that user.
- **Salir** (top-right on Home) → signs out.

## 5. Verify it works

- After signing up, open Firebase Console → **Authentication → Users**. Your new user should appear there.
- Reload the page while signed in — you should land on `/home` directly (the session persists in IndexedDB; Firebase handles this for you).

## 6. Calling the backend with the user's ID token (optional, for later)

Firebase ID tokens are short-lived JWTs (~1 hour) that prove the user is authenticated. When the client wants to call the Flask backend on behalf of a user, send the token in the `Authorization` header.

**Get the token from the client:**

```ts
import { getIdToken } from './services/auth';

const token = await getIdToken();
await fetch('/api/protected', {
  headers: { Authorization: `Bearer ${token}` },
});
```

`getIdToken()` is already exported from `src/services/auth.ts`.

**Verify the token on the Flask backend:**

```bash
pip install firebase-admin
```

```python
import firebase_admin
from firebase_admin import auth, credentials
from flask import request, abort

cred = credentials.Certificate("firebase-admin-credentials.json")
firebase_admin.initialize_app(cred)

def require_auth():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        abort(401)
    try:
        return auth.verify_id_token(header.split(" ", 1)[1])
    except Exception:
        abort(401)
```

The `firebase-admin-credentials.json` file (the Admin SDK key) lives in `server/` and is gitignored — it stays on the server only.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Firebase: Error (auth/configuration-not-found)` | Email/Password sign-in not enabled — go back to step 1. |
| `Firebase: Error (auth/api-key-not-valid)` | `VITE_FIREBASE_API_KEY` is empty or wrong. Recheck `.env` and **restart `npm run dev`** (Vite only reads `.env` on startup). |
| `Firebase: Error (auth/unauthorized-domain)` | The domain you're browsing from isn't in Firebase Auth → Settings → Authorized domains. `localhost` is allowed by default; add other dev hosts there. |
| Login spins forever | Open DevTools → Console. Most issues show a `Firebase: Error (...)` line that tells you exactly which config value is wrong. |
| Changed `.env` but nothing updates | Stop and restart `npm run dev`. Vite caches env vars at startup. |
