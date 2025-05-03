# eCommerce project

## Brief description

Our project is a fully functional online store. You can register or log into your personal account, select products in the catalog, view their detailed description and add them to the cart.

It includes features such as user registration and login, product search, product categorization, and sorting.

In this project, our team of three people including the team leader works together and divides tasks, conducts reviews for each other, daily meetings. The goal of the project for us is to show our technical and soft skills and get a ready-made fully functional eCommerce application.

## Stack we use

1. React
2. React Router
3. TypeScript
4. Eslint, prettier, husky.
5. Vite
6. Vitest
7. React hook form
8. Zod
9. Swiper js
10. React toast
11. Redux toolkid
12. axios
13. React Spring
14. Jira
15. date-fns
16. React DayPicker
17. react-i18next
18. react-helmet
19. tailwindcss

## Server

To integrate with the [commercetools](https://commercetools.com/) platform:

1. **Create a commercetools Account**
   Register at [commercetools.com](https://commercetools.com/).

2. **Create a Project**
   Set up a new commercial project to access the platform API.
   Refer to the [official documentation](https://docs.commercetools.com/docs) for guidance.

3. **Configure Project Settings**
   In the [Merchant Center](https://docs.commercetools.com/merchant-center), set up:

   - Authorization (API clients)
   - Currencies
   - Languages
   - Other relevant configurations

4. **Update `.env` File**
   Once your project is configured, you will receive the required API credentials.
   Add them to the `.env` file of the [client application](#getting-started).

## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine:

```bash
git clone https://github.com/elena-v-volkova/eCommerce.git
```

2. Switch to development branch:

```bash
git checkout develop
```

3. Install the required dependencies.

```bash
npm install
```

4. Replace in the `.env.example` file the data for API access obtained when setting up the configuration in [Merchant Center](https://docs.commercetools.com/merchant-center).

```bash
VITE_CTP_PROJECT_KEY=name-project
VITE_CTP_CLIENT_ID=string
VITE_CTP_CLIENT_SECRET=string
VITE_CTP_SCOPES=manage_project:name-project
VITE_CTP_API_URL=https://api.us-central1.gcp.commercetools.com
VITE_CTP_AUTH_URL=https://auth.us-central1.gcp.commercetools.com
```

5. Remove the `.example` prefix for the `.env` file in the root project directory..

## Available Scripts

In the project directory, you can run:

### Development:

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run prepare` | Bind husky hooks                            |
| `npm run dev`     | Starts dev server at http://localhost:5173/ |
| `npm run build`   | Build for production                        |
| `npm run preview` | Locally preview production build            |

### Linter Scripts:

| Command                | Description                                | Fix errors command      |
| ---------------------- | ------------------------------------------ | ----------------------- |
| `npm run lint`         | ESLint check code to quickly find problems | `npm run lint:fix`      |
| `npm run format:check` | Prettier check code format style           | `npm run format`        |
| `npm run stylelint`    | Check CSS-like languages                   | `npm run stylelint:fix` |

### Test Scripts:

| Command            | Description                 |
| ------------------ | --------------------------- |
| `npm run test`     | Run Vitest tests            |
| `npm run coverage` | Show details tests coverage |

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
