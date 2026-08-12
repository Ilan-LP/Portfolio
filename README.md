# Portfolio - Ilan LP

API Express + Prisma (Postgres) et frontend React/Vite, packagés en 3
containers Docker (`db`, `backend`, `frontend`).

## 1. Développement local

```bash
cp .env.example .env
# éditer .env avec des valeurs locales (CORS_ORIGIN=http://localhost:5173, etc.)
```

Backend :

```bash
cd Backend
npm install
npm run prisma:generate
npm run dev
```

Frontend :

```bash
cd Frontend
npm install
npm run dev
```

## 2. Déploiement en production (VPS + Docker + Caddy)

Architecture : `frontend` (nginx) est le seul container à rejoindre le
réseau externe `caddy_net`. Il sert les assets statiques et proxy en
interne `/api` et `/uploads` vers `backend` (voir `Frontend/nginx.conf`).
`backend` et `db` restent uniquement sur le réseau docker interne, aucun
port n'est publié sur l'hôte.

### 2.1 Sur le VPS

```bash
sudo mkdir -p /opt/portfolio
sudo chown $USER:$USER /opt/portfolio
cd /opt/portfolio
git clone <url-de-ce-repo> .

cp .env.example .env
nano .env   # POSTGRES_*, CORS_ORIGIN et FRONTEND_URL = domaine public réel, SMTP_*

docker compose up -d --build
```

### 2.2 Premier déploiement : schéma + seed

Ce projet n'a pas (encore) de migrations Prisma formelles : `docker compose up`
fait tourner `prisma db push` automatiquement au démarrage du backend pour
synchroniser le schéma. Le seed, lui, n'est **pas** automatique (pour ne pas
rejouer à chaque restart). À lancer une fois, à la main, quand la base est prête :

```bash
docker compose exec backend npx prisma db seed
```

Si vous voulez passer à de vraies migrations plus tard :

```bash
cd Backend
npx prisma migrate dev --name init   # génère prisma/migrations/, en local avec une DB dispo
```

puis remplacer `prisma db push` par `prisma migrate deploy` dans `Backend/Dockerfile`.

### 2.3 Caddyfile

```
votre-domaine.fr {
    reverse_proxy portfolio-ilanlp-frontend:80
}
```

### 2.4 Mise à jour

```bash
cd /opt/portfolio
git pull
docker compose up -d --build
```

## 3. Notes

- Ne jamais commit `.env`, seul `.env.example` doit être versionné.
- `CORS_ORIGIN` doit être le domaine public exact en production, jamais `*`.
- `Backend/package.json` référence maintenant `helmet` et `express-rate-limit` :
  après avoir tiré ce commit, lancez `npm install` une fois dans `Backend/`
  pour rafraîchir `package-lock.json` avant le prochain build Docker
  (`npm ci` échouera sinon tant que le lockfile n'est pas synchronisé).
