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
# Create a .env.local file with your Gemini API key:
# VITE_GEMINI_API_KEY=your_api_key_here

# Step 5: Start the development server with auto-reloading and an instant preview
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
- **Responsive Design**: Mobile-first design with smooth animations
- **Modern UI**: Built with shadcn-ui and Tailwind CSS

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Gemini AI API

## Building for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

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
