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
10. Jira
11. Tailwind CSS
12. HeroUI

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

```js
VITE_CTP_PROJECT_KEY=name-project
VITE_CTP_CLIENT_ID=string
VITE_CTP_CLIENT_SECRET=string
VITE_CTP_SCOPES=manage_project:name-project
VITE_CTP_API_URL=https://api.us-central1.gcp.commercetools.com
VITE_CTP_AUTH_URL=https://auth.us-central1.gcp.commercetools.com
```

5. Remove the `.example` prefix for the `.env` file in the root project directory..

**_To add graphic components use the library [HeroUI](https://www.heroui.com/). For detailed information follow the [link](https://www.heroui.com/docs/guide/introduction)_**

```js
// Example
npx heroui-cli add button
```

For each task, create a **new branch** from the `develop` branch, make the changes, and create a pull request to merge the changes back into the `develop` branch after a code review.<br>Multiple issues can be combined into a single pull request. 🔄

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
