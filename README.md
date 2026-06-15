# ShopNova - Plataforma E-Commerce

Proyecto final DevOps — Kevin Esteban Burgos Cobo (2453710)

## Stack tecnológico

- **Backend:** Node.js + Express
- **Tests:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Calidad de código:** SonarCloud
- **Gestión:** Jira (Scrum)

## Estructura del proyecto

```
shopnova/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   └── services/
│   ├── tests/
│   ├── package.json
│   └── sonar-project.properties
└── .github/
    └── workflows/
        └── ci.yml
```

## Cómo correr el proyecto localmente

```bash
cd backend
npm install
npm start
```

## Cómo correr los tests

```bash
cd backend
npm test
```

## Métricas de calidad (SonarCloud)

- Cobertura de código: > 60%
- Complejidad ciclomática: medida por SonarCloud
- Duplicación de código: medida por SonarCloud
- Code smells: medida por SonarCloud
- Deuda técnica: medida por SonarCloud

## Pipeline CI/CD

Cada push a `main` o `develop` ejecuta automáticamente:
1. Instalación de dependencias
2. Ejecución de todos los tests con cobertura
3. Verificación de cobertura mínima (60%)
4. Análisis estático con SonarCloud
5. Verificación de que la app inicia correctamente

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | Estado de la app |
| GET | /api/products | Listar productos |
| GET | /api/products/:id | Obtener producto |
| POST | /api/products | Crear producto |
| POST | /api/users/register | Registrar usuario |
| POST | /api/users/login | Login |
| GET | /api/cart/:userId | Ver carrito |
| POST | /api/cart/:userId/items | Agregar ítem |
| DELETE | /api/cart/:userId/items/:id | Eliminar ítem |
| POST | /api/orders | Crear orden |
| GET | /api/orders/user/:userId | Órdenes del usuario |
