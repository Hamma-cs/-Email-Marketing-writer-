# AI Marketing Email Writer

This is a web application for creating and improving professional marketing emails using the Gemini AI. Users fill out a form with details about their campaign, and the application generates email content broken down into optimizable sections with a quality checklist.

## Running Locally

To run this project locally, you'll need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
    cd <YOUR-REPO-NAME>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup Instructions

1.  **Push your code to a GitHub repository.** The workflow is triggered by pushes to the `main` branch.

2.  **Enable GitHub Pages for your repository:**
    *   Go to your repository on GitHub.
    *   Click on the **Settings** tab.
    *   In the left sidebar, click on **Pages**.
    *   Under "Build and deployment", for the **Source**, select **GitHub Actions**.

3.  **Trigger the deployment:**
    *   Make a commit and push it to the `main` branch.
    *   Go to the **Actions** tab in your repository to see the workflow run. Once it completes successfully, your site will be deployed.

Your site will be available at `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`.
