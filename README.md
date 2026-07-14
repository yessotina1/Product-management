# Product Management

Application de gestion de produits avec catégories, construite sur Laravel pour l'API backend et Angular pour le frontend.

## Structure du projet

- `api/` : backend Laravel
- `frontend/` : frontend Angular

## Prérequis

- PHP 8.1+
- Composer
- Node.js (version compatible Angular 21)
- npm
- Base de données MySQL ou PostgreSQL

## Installation et démarrage

### 1. Backend Laravel

Ouvrir un terminal et se positionner dans le dossier `api` :

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
```

Lancer les migrations :

```bash
php artisan migrate
```

Démarrer le serveur backend :

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

L'API sera disponible sur `http://127.0.0.1:8000`.

### 2. Frontend Angular

Ouvrir un autre terminal et se positionner dans le dossier `frontend` :

```bash
cd frontend
npm install
npm run start
```

L'application frontend sera disponible sur `http://localhost:4200`.

> Le frontend utilise l'API à l'adresse `http://localhost:8000/api`.

## Commandes utiles

### Backend

```bash
cd api
php artisan serve
php artisan migrate
php artisan migrate:fresh --seed
php artisan test
```

### Frontend

```bash
cd frontend
npm install
npm run start
npm run build
npm run test
```

## Déploiement rapide

- Construire le frontend : `cd frontend && npm run build`
- Préparer le backend : `cd api && php artisan migrate --force`

## Notes

- Si le frontend et le backend ne communiquent pas, vérifier la variable d'URL de l'API dans le code Angular.
- Pour utiliser un autre port, ajuster les commandes `php artisan serve` et `ng serve` selon vos besoins.
