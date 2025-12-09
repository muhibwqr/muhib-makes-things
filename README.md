# Muhib Waqar - Personal Portfolio

A modern, responsive portfolio website showcasing my work as a Software Engineer & Cybersecurity Specialist.

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Set up environment variables
# Create a .env file in the root directory with your API keys:
# VITE_GEMINI_API_KEY=your_api_key_here
# X_BEARER_TOKEN=your_x_bearer_token_here (optional, for X/Twitter feed)
# LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here (optional, for LinkedIn feed)
# LINKEDIN_PERSON_ID=your_linkedin_person_id_here (optional, for LinkedIn feed)

# Step 5: Start the backend API server (in a separate terminal)
npm run dev:server

# Step 6: Start the development server with auto-reloading and an instant preview
npm run dev
```

### Alternative Editing Methods

**Edit a file directly in GitHub**
- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit the changes

**Use GitHub Codespaces**
- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
- Edit files directly within the Codespace and commit and push your changes once you're done

## Features

- **AI Chatbot**: Interact with an AI trained on Muhib's information and personality
- **Dynamic Updates Feed**: Automatically pulls latest posts from X (Twitter) and LinkedIn
- **Responsive Design**: Mobile-first design with smooth animations
- **Modern UI**: Built with shadcn-ui and Tailwind CSS
- **Component-Based Layout**: Clean section structure (Hero, About, Projects, Updates)

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- Express (backend API server)
- shadcn-ui
- Tailwind CSS
- Google Gemini AI API
- X (Twitter) API v2
- LinkedIn API v2

## API Server Setup

The portfolio includes a backend API server for fetching dynamic content from X (Twitter) and LinkedIn.

### X (Twitter) API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app and get your Bearer Token
3. Add `X_BEARER_TOKEN=your_token_here` to your `.env` file

### LinkedIn API Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app and set up OAuth
3. Get your access token and person ID
4. Add `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_ID` to your `.env` file

Note: The API routes will return empty arrays if credentials are not provided, so the site will still work without them.

## Building for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

For production deployment, you'll need to:
1. Deploy the backend server (Express) separately or use serverless functions
2. Update the API proxy configuration in `vite.config.ts` to point to your production API URL

## Deployment (Vercel)

1. Push your code to GitHub (or your preferred git provider).
2. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
3. Click "New Project" and import your portfolio repository.
4. Set the build command to `npm run build` and the output directory to `dist` (default for Vite).
5. Add your environment variable `VITE_GEMINI_API_KEY` in the Vercel dashboard.
6. Click "Deploy". Your site will be live on a Vercel URL.

For custom domains, follow Vercel's instructions to add your domain.

## License

This project is private and owned by Muhib Waqar.
