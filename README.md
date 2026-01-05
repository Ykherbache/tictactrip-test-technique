[![codecov](https://codecov.io/github/Ykherbache/tictactrip-test-technique/branch/main/graph/badge.svg?token=GVLEI1XWYW)](https://codecov.io/github/Ykherbache/tictactrip-test-technique) ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Ykherbache/tictactrip-test-technique?utm_source=oss&utm_medium=github&utm_campaign=Ykherbache%2Ftictactrip-test-technique&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews) [![CI](https://github.com/YKherbache/tictactrip-test-technique/actions/workflows/ci.yml/badge.svg)](https://github.com/YKherbache/tictactrip-test-technique/actions/workflows/ci.yml) ![pnpm](https://img.shields.io/badge/pnpm-9.x-blue)

# API de Justification de Texte - Tic Tac Trip

## Description du projet

API REST permettant de justifier du texte à 80 caractères par ligne avec authentification par token et gestion de quota quotidien de mots. L'application utilise Redis pour le stockage des tokens d'authentification et le suivi des quotas quotidiens par utilisateur.

### Fonctionnalités principales

- **Authentification** : Génération de token d'authentification via email
- **Justification de texte** : Formatage de texte à exactement 80 caractères par ligne
- **Gestion de quota** : Limite quotidienne de 80 000 mots par défaut (configurable)
- **Rate limiting** : Protection contre les abus avec limitation globale des requêtes
- **Sécurité** : Helmet.js pour les en-têtes de sécurité HTTP

## URL de déploiement

🌐 **Production** : https://tictactrip-test.yaci.fr

## Table des matières

- [Description du projet](#description-du-projet)
  - [Fonctionnalités principales](#fonctionnalités-principales)
- [URL de déploiement](#url-de-déploiement)
- [Architecture technique](#architecture-technique)
  - [Stack technique](#stack-technique)
  - [Structure du projet](#structure-du-projet)
  - [Patterns utilisés](#patterns-utilisés)
  - [Justification des choix architecturaux](#justification-des-choix-architecturaux)
    - [Redis pour la persistance des données](#redis-pour-la-persistance-des-données)
    - [InversifyJS pour l'injection de dépendances](#inversifyjs-pour-linjection-de-dépendances)
    - [TypeScript en mode strict](#typescript-en-mode-strict)
    - [Pattern Repository](#pattern-repository)
    - [Result Pattern avec @gum-tech/flow-ts](#result-pattern-avec-gum-techflow-ts)
- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Étapes d'installation](#étapes-dinstallation)
- [Utilisation](#utilisation)
  - [1. Générer un token d'authentification](#1-générer-un-token-dauthentification)
  - [2. Justifier du texte](#2-justifier-du-texte)
  - [Exemples Postman](#exemples-postman)
  - [Exemple complet](#exemple-complet)
- [API Endpoints](#api-endpoints)
  - [POST /api/token](#post-apitoken)
  - [POST /api/justify](#post-apijustify)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts disponibles](#scripts-disponibles)
  - [Développement](#développement)
  - [Tests](#tests)
  - [Production](#production)
- [Tests](#tests-1)
  - [Tests unitaires](#tests-unitaires)
  - [Tests d'intégration](#tests-dintégration)
  - [Exécution](#exécution)
- [Déploiement](#déploiement)
  - [Docker](#docker)
  - [Docker Compose](#docker-compose)
  - [Production](#production-1)
- [Configuration TypeScript](#configuration-typescript)
- [Linter](#linter)
- [Structure de dossiers](#structure-de-dossiers)
- [Technologies utilisées](#technologies-utilisées)
- [Auteur](#auteur)
- [Licence](#licence)

## Architecture technique

### Stack technique

- **Framework** : Express.js 5.x
- **Language** : TypeScript 5.4 (mode strict activé)
- **Injection de dépendances** : InversifyJS
- **Cache/Base de données** : Redis
- **Tests** : Jest (unitaires + intégration avec Testcontainers)
- **Linter** : ESLint + Prettier
- **Gestionnaire de paquets** : pnpm 9.x

### Structure du projet

```
src/
├── app/
│   ├── features/              # Modules métier
│   │   ├── auth/              # Authentification (génération de token)
│   │   └── justify-text/      # Justification de texte + quota
│   ├── inversify/             # Configuration IoC (InversifyJS)
│   ├── routes/                # Configuration des routes et middlewares
│   ├── external-services/     # Services externes (Redis)
│   ├── types/                 # Types TypeScript partagés
│   └── utils/                 # Utilitaires
├── config.ts                  # Configuration de l'application
└── main.ts                    # Point d'entrée de l'application
```

### Patterns utilisés

- **Dependency Injection** : Utilisation d'InversifyJS pour l'inversion de contrôle
- **Repository Pattern** : Abstraction des accès aux données (Redis/InMemory)
- **Service Layer** : Logique métier séparée des contrôleurs
- **Result Pattern** : Gestion des erreurs avec `@gum-tech/flow-ts`

### Justification des choix architecturaux

#### Redis pour la persistance des données

**Pourquoi Redis ?**

Redis a été choisi comme solution de stockage pour plusieurs raisons critiques :

1. **Persistance des données en cas de crash** : Contrairement à un stockage en mémoire, Redis persiste les données sur disque. Si le serveur crash ou redémarre, les données sont conservées. Dès que le serveur est de nouveau opérationnel, tout reprend sans perte de données.

2. **Performance** : Redis offre des performances exceptionnelles pour les opérations de lecture/écriture, essentielles pour la gestion des quotas en temps réel.

3. **Expiration automatique** : Redis permet de définir un TTL (Time To Live) sur les clés, ce qui permet de réinitialiser automatiquement les quotas quotidiens à minuit UTC sans intervention manuelle.

#### InversifyJS pour l'injection de dépendances

**Pourquoi InversifyJS ?**

- **Testabilité** : L'injection de dépendances facilite grandement les tests en permettant de remplacer facilement les dépendances (ex: Redis par InMemory pour les tests unitaires).
- **Découplage** : Les modules sont faiblement couplés, facilitant la maintenance et l'évolution du code.
- **Flexibilité** : Permet de changer d'implémentation (ex: Redis vs InMemory) sans modifier le code métier.

#### TypeScript en mode strict

**Pourquoi le mode strict ?**

- **Sécurité de type** : Le mode strict garantit une vérification rigoureuse des types, réduisant les erreurs à l'exécution.
- **Maintenabilité** : Le code est plus explicite et plus facile à maintenir.
- **Refactoring** : Les changements de structure sont détectés immédiatement par le compilateur.

#### Pattern Repository

**Pourquoi le Repository Pattern ?**

- **Abstraction** : Sépare la logique métier de l'implémentation du stockage (Redis, InMemory, PostgreSQL, etc.).
- **Testabilité** : Permet d'utiliser des repositories en mémoire pour les tests unitaires.
- **Flexibilité** : Facilite le changement de solution de stockage sans impacter le reste de l'application.

#### Result Pattern avec @gum-tech/flow-ts

**Pourquoi le Result Pattern ?**

- **Gestion explicite des erreurs** : Les erreurs sont gérées de manière explicite et typée, évitant les exceptions non gérées.
- **Sécurité** : Force le développeur à gérer tous les cas d'erreur possibles.
- **Lisibilité** : Le code exprime clairement les cas de succès et d'échec.

## Installation

### Prérequis

- **Node.js** : 20.x ou supérieur
- **pnpm** : 9.x (gestionnaire de paquets)
- **Redis** : 7.x (local ou distant)

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd tictactrip-test-technique
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

```bash
cp env.example .env
```

Éditer le fichier `.env` :

```env
PORT=3000
DAILY_WORD_QUOTA=80000
REDIS_URL=redis://localhost:6379
```

4. **Démarrer Redis** (avec Docker Compose)

```bash
docker-compose up redis -d
```

5. **Lancer l'application**

**Mode développement** :

```bash
pnpm dev
```

**Mode production** :

```bash
pnpm build
node dist/main.js
```

L'application sera accessible sur `http://localhost:3000`

## Utilisation

### 1. Générer un token d'authentification

**Endpoint** : `POST /api/token`

**Requête curl** :

```bash
curl -X POST https://tictactrip-test.yaci.fr/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Réponse** (200 OK) :

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Erreurs possibles** :

- `400` : Email manquant ou format invalide

### 2. Justifier du texte

**Endpoint** : `POST /api/justify`

**Requête curl** :

```bash
curl -X POST https://tictactrip-test.yaci.fr/api/justify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: text/plain" \
  --data "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
```

**Réponse** (200 OK) :

```
Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit  sed  do
eiusmod  tempor  incididunt  ut  labore  et  dolore  magna  aliqua
```

**Caractéristiques** :

- Chaque ligne (sauf la dernière) fait exactement 80 caractères
- Les espaces sont distribués uniformément entre les mots
- La dernière ligne d'un paragraphe n'est pas justifiée

**Erreurs possibles** :

- `400` : Texte vide ou format invalide (Content-Type doit être `text/plain`)
- `401` : Token manquant ou invalide
- `402` : Quota quotidien dépassé (avec détails du quota restant)

### Exemples Postman

#### Collection Postman

Vous pouvez importer ces requêtes dans Postman :

**1. Générer un token**

```
POST https://tictactrip-test.yaci.fr/api/token
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com"
}
```

**2. Justifier du texte**

```
POST https://tictactrip-test.yaci.fr/api/justify
Headers:
  Authorization: Bearer {token}
  Content-Type: text/plain
Body (raw text):
Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
```

### Exemple complet

```bash
# 1. Générer un token
TOKEN=$(curl -s -X POST https://tictactrip-test.yaci.fr/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}' | jq -r '.token')

echo "Token généré: $TOKEN"

# 2. Justifier du texte
curl -X POST https://tictactrip-test.yaci.fr/api/justify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: text/plain" \
  --data "Lorem ipsum dolor sit amet consectetur adipiscing elit"
```

## API Endpoints

### POST /api/token

Génère un token d'authentification à partir d'un email.

**Body** :

```json
{
  "email": "user@example.com"
}
```

**Réponses** :

- `200 OK` : Token généré avec succès
  ```json
  {
    "token": "uuid-v4-token"
  }
  ```
- `400 Bad Request` : Email manquant ou format invalide
  ```json
  {
    "error": "Email is required"
  }
  ```
  ou
  ```json
  {
    "error": "Invalid email format"
  }
  ```

### POST /api/justify

Justifie un texte à 80 caractères par ligne.

**Headers requis** :

- `Authorization: Bearer {token}` - Token d'authentification
- `Content-Type: text/plain` - Le body doit être du texte brut

**Body** : Texte brut à justifier (limite : 25MB)

**Réponses** :

- `200 OK` : Texte justifié (Content-Type: `text/plain`)
- `400 Bad Request` : Texte vide ou format invalide
- `401 Unauthorized` : Token manquant ou invalide
- `402 Payment Required` : Quota quotidien dépassé
  ```
  Quota dépassé. Quota restant: X mots. Limite quotidienne: 80000 mots.
  ```

## Variables d'environnement

| Variable           | Description                             | Valeur par défaut        | Requis |
| ------------------ | --------------------------------------- | ------------------------ | ------ |
| `PORT`             | Port d'écoute du serveur                | `3000`                   | Non    |
| `REDIS_URL`        | URL de connexion Redis                  | `redis://localhost:6379` | Oui    |
| `DAILY_WORD_QUOTA` | Quota quotidien de mots par utilisateur | `80000`                  | Non    |

## Scripts disponibles

### Développement

- `pnpm dev` - Démarrage en mode développement avec hot-reload (nodemon)
- `pnpm lint` - Vérification du code (ESLint + Prettier)
- `pnpm lint:fix` - Correction automatique du code
- `pnpm lint:watch` - Watch mode pour le linting

### Tests

- `pnpm test:unit` - Exécution des tests unitaires
- `pnpm test:integ` - Exécution des tests d'intégration
- `pnpm coverage:unit` - Couverture de code (tests unitaires)
- `pnpm coverage:integ` - Couverture de code (tests d'intégration)
- `pnpm coverage:all` - Couverture de code complète

### Production

- `pnpm build` - Compilation TypeScript
- `pnpm build:clean` - Nettoyage + compilation
- `pnpm clean` - Suppression des dossiers `dist` et `coverage`

## Tests

Le projet inclut des tests unitaires et d'intégration avec une couverture de code.

### Tests unitaires

Testent les services métier de manière isolée :

- `authService.spec.ts` - Service d'authentification
- `justifyTextService.spec.ts` - Service de justification
- `wordQuotaService.spec.ts` - Service de gestion de quota

### Tests d'intégration

Testent les endpoints API avec Redis via Testcontainers :

- `generateToken.spec.ts` - Endpoint de génération de token
- `justifyText.spec.ts` - Endpoint de justification avec quota

### Exécution

```bash
# Tous les tests
pnpm test:unit
pnpm test:integ

# Avec couverture
pnpm coverage:all
```

## Déploiement

### Docker

**Build de l'image** :

```bash
docker build -t tictactrip-api .
```

**Exécution** :

```bash
docker run -p 3000:3000 \
  -e REDIS_URL=redis://redis:6379 \
  -e PORT=3000 \
  -e DAILY_WORD_QUOTA=80000 \
  tictactrip-api
```

### Docker Compose

Démarre l'application et Redis :

```bash
docker-compose up
```

L'application sera accessible sur `http://localhost:3000`

### Production

L'application est déployée sur : **https://tictactrip-test.yaci.fr**

## Configuration TypeScript

Le projet utilise TypeScript en mode strict (`strict: true` dans `tsconfig.build.json`) avec :

- Vérification stricte des types
- Pas de variables locales inutilisées
- Déclarations de types générées
- Support des décorateurs (pour InversifyJS)

## Linter

Le projet utilise ESLint avec les règles TypeScript recommandées et Prettier pour le formatage :

```bash
# Vérification
pnpm lint

# Correction automatique
pnpm lint:fix
```

## Structure de dossiers

```
tictactrip-test-technique/
├── src/                    # Code source
│   ├── app/
│   │   ├── features/       # Modules métier
│   │   ├── inversify/      # Configuration IoC
│   │   ├── routes/         # Routes et middlewares
│   │   └── external-services/ # Services externes
│   ├── config.ts           # Configuration
│   └── main.ts             # Point d'entrée
├── __tests__/              # Tests
│   ├── unit/               # Tests unitaires
│   └── integ/              # Tests d'intégration
├── dist/                   # Code compilé (généré)
├── coverage/               # Rapports de couverture (généré)
├── docker-compose.yaml     # Configuration Docker Compose
├── Dockerfile              # Image Docker
├── jest.config.ts          # Configuration Jest
├── tsconfig.json           # Configuration TypeScript
└── eslint.config.mjs       # Configuration ESLint
```

## Technologies utilisées

- **Express.js** 5.2.1 - Framework web
- **TypeScript** 5.4 - Langage de programmation
- **InversifyJS** 6.0.2 - Injection de dépendances
- **Redis** 4.6.0 - Cache et stockage
- **Jest** 29.7.0 - Framework de tests
- **Testcontainers** 11.11.0 - Tests d'intégration avec Redis
- **ESLint** 8.56.0 - Linter
- **Prettier** 3.4.1 - Formateur de code
- **Helmet** 8.1.0 - Sécurité HTTP
- **express-rate-limit** 8.2.1 - Rate limiting

## Auteur

Yacine Kherbache <yacinekherbache@yaci.fr>

## Licence

AGPL-3.0
