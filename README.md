---

# Collaboration Chronology (CollabChron)

A full-stack multi-author blog platform built with **Next.js**, **MongoDB**, **Prisma**, **React**, and **NextAuth**. This platform allows multiple authors to create and manage blog posts, and users can interact with the content through comments, likes, and more.

## Features

- **Authentication**: Sign in with Google and email using NextAuth.
- **Multi-author**: Supports multiple authors for creating and managing posts.
- **Content Management**: Authors can create, edit, and delete their posts.
- **User Interaction**: Users can like, comment, and reply to posts.
- **Post Views**: Track post views and display popular posts based on views.
- **Responsive Design**: Fully responsive UI for mobile and desktop devices.
- **SEO-Friendly**: Optimized for search engines with dynamic metadata and JSON-LD.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction), [Prisma](https://www.prisma.io/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [NextAuth](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) or your preferred CSS framework
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or above)
- [MongoDB](https://www.mongodb.com/)
- Prisma CLI (`npm install prisma --save-dev`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chinonsochikelue/collabchron.git
   cd multi-author-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory with the following values:

   ```bash
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="<your-google-client-id>"
   GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
   ```

4. Set up Prisma:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the blog.

## Project Structure

```bash
.
├── prisma                  # Prisma schema and migrations
├── public                  # Static files
├── src
│   ├── components          # React components
│   ├── pages               # Next.js pages (Home, Posts, Auth, etc.)
│   ├── lib                 # Utility functions (e.g., authentication, database)
│   └── styles              # Global styles
├── README.md
└── package.json
```

## Authentication

This project uses **NextAuth** for authentication. You can log in with Google. To enable authentication providers, configure the relevant environment variables in your `.env` file.

## Database

This project uses **MongoDB** as the database, with **Prisma** as the ORM. Prisma handles data modeling and migration, allowing seamless interaction with MongoDB.

### Prisma Commands

- Run database migrations:

  ```bash
  npx prisma migrate dev
  ```

- Open Prisma Studio to manage your data:

  ```bash
  npx prisma studio
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any feature suggestions or bugs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
