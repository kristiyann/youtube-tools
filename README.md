This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup Guide

### Application Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/youtube-description-text-replacer.git
   cd youtube-description-text-replacer
   ```

2. Create a `.env.local` file in the root directory of the project.

3. Add the following environment variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
   Replace `your_nextauth_secret`, `your_google_client_id`, and `your_google_client_secret` with your actual values.

   To generate your Google Client ID and Secret:
   1. Go to the Google Cloud Console (https://console.cloud.google.com/).
   2. Create a new project or select an existing one.
   3. Navigate to "APIs & Services" > "Credentials" in the left sidebar.
   4. Click "Create Credentials" and select "OAuth client ID".
   5. Choose "Web application" as the application type.
   6. Set the authorized JavaScript origins to `http://localhost:3000` (for development).
   7. Set the authorized redirect URIs to `http://localhost:3000/api/auth/callback/google`.
   8. Click "Create" to generate your Client ID and Client Secret.
   9. Copy the generated Client ID and Client Secret to use in your .env.local file.

   To create a secure NextAuth secret:
   1. Open a terminal or command prompt.
   2. Run the following command to generate a random 32-character string:
      ```  
      openssl rand -base64 32
      ```
   3. Copy the output and use it as your NEXTAUTH_SECRET in the .env.local file.

   Alternatively, you can use a password generator to create a long, random string (at least 32 characters) combining uppercase and lowercase letters, numbers, and symbols.

4. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Project Structure

- `/src`: Contains the main source code
  - `/app`: Next.js app router files
  - `/components`: Reusable React components
  - `/constants`: Constant values used across the app
  - `/types`: TypeScript type definitions

### Key Features and How to Modify Them

1. **YouTube Description Replace**
   - Location: `src/app/youtube/description-replace/page.tsx`
   - This feature allows users to replace text in YouTube video descriptions.
   - To modify:
     - Adjust the `itemsPerPage` constant to change the number of videos displayed per page.
     - Modify the `handleApplyChanges` function to alter the description update logic.

2. **Image Transformer**
   - Location: `src/app/youtube/image-transformer/page.tsx`
   - Used to turn square images to 1920x1080 with a blurred background to prevent YouTube setting your video as a short.

3. **Authentication**
   - Uses NextAuth.js for authentication
   - Configuration: `src/pages/api/auth/[...nextauth].ts`
   - To add or modify authentication providers, edit this file.

4. **UI Components**
   - Located in `src/components`
   - To modify existing components or add new ones, create or edit files in this directory.

5. **Styling**
   - The project uses Tailwind CSS for styling.
   - Global styles: `src/styles/globals.css`
   - To modify styles, edit the Tailwind classes in component files or update the Tailwind configuration in `tailwind.config.js`.



