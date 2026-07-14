# Frontend Angular

Frontend du projet Product Management.

## Prérequis

- Node.js
- npm
- Backend Laravel en cours d'exécution sur `http://localhost:8000`

## Installation

```bash
cd frontend
npm install
```

## Lancer l'application

```bash
npm run start
```

Ouvrir le navigateur sur `http://localhost:4200`.

## Build

```bash
npm run build
```

Les fichiers compilés seront créés dans `frontend/dist/frontend`.

## Tests

```bash
npm run test
```

## Remarques

- Le frontend consomme l'API backend via `http://localhost:8000/api`.
- Modifier l'URL de l'API dans le code Angular si le backend est sur un autre port.
