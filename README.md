---

# Collaboration Chronology (CollabChron)

A full-stack multi-author blog platform built with **Next.js**, **MongoDB**, **Prisma**, **React**, and **NextAuth**. This platform allows multiple authors to create and manage blog posts, and users can interact with the content through comments, likes, and more.

## ✨ Features

- **Authentication**: Sign in with Google and email using NextAuth.
- **Multi-author**: Supports multiple authors for creating and managing posts.
- **Content Management**: Authors can create, edit, and delete their posts.
- **User Interaction**: Users can like, comment, and reply to posts.
- **Post Views**: Track post views and display popular posts based on views.
- **Responsive Design**: Fully responsive UI for mobile and desktop devices.
- **SEO-Friendly**: Optimized for search engines with dynamic metadata and JSON-LD.
- **🔐 API Key Management**: Secure, rate-limited access to CollabChron data.
- **📄 Developer Dashboard**: Fully featured dashboard for developers to manage API access.
- **📘 Professional API Documentation**: Rich, multi-language API documentation with an interactive playground.

---

## 🧪 API Key Management

### Key Capabilities

- Generate new API keys with custom names.
- View all active keys (limit: 5 per user).
- Revoke keys anytime.
- All API keys expire after 1 year.

### How to Use

1. Navigate to the **Developer** page after logging in.
2. Generate a new API key with a name.
3. Copy your API key — it will only be shown once!
4. Use the key in requests:

   ```http
   Authorization: Bearer YOUR_API_KEY
   ```

   ## 📊 API Endpoints

| Method | Endpoint                 | Description                                 |
|--------|--------------------------|---------------------------------------------|
| GET    | `/api/v1/users/profile`  | Get authenticated user's profile info       |
| GET    | `/api/v1/users/posts`    | Get posts created by authenticated user     |
| GET    | `/api/v1/users/stats`    | Get post count, views, followers, etc.      |
| GET    | `/api/v1/posts/latest`   | Fetch latest posts from all users           |
| GET    | `/api/v1/posts`          | Paginated, filterable list of posts         |
| GET    | `/api/v1/posts/:id`      | Get specific post by ID                     |

---

## 🔒 Security Features

- Middleware to validate API keys on all v1 endpoints  
- Redis-based rate limiting to prevent abuse  
- Permission-based access control  
- API keys automatically expire after 1 year  

---

## 🧾 Professional API Documentation

**Accessible at `/api-docs` (authenticated users only), the developer documentation includes:**

### Key Sections

- **Authentication** – API key usage  
- **Endpoints** – Detailed endpoint docs with params, responses  
- **Code Examples** – In JavaScript, Python, PHP, Ruby, Go  
- **Error Handling** – Status codes and error formats  
- **Rate Limiting** – Headers and best practices  

### Features

- Tabbed code snippets with copy buttons  
- Syntax highlighting  
- Responsive, modern UI with dark mode  
- Collapsible endpoint sections  
- Sidebar navigation with quick links  

---

## Bonus Additions

- 🌐 **API Playground** – Try endpoints live in the browser  
- 📡 **Webhook Documentation** – Event payloads, examples, security  
- 📊 **API Status Page** – Realtime uptime & incident logs  
- 📈 **API Changelog** – Release history and breaking changes  


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
   # App URLs
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000

   # Auth Secrets
   NEXTAUTH_SECRET=your_nextauth_secret
   JWT_SECRET=your_jwt_secret

   # Google OAuth
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret

   # Firebase
   FIREBASE=your_firebase_api_key

   # MongoDB
   DATABASE_URL='your_mongodb_connection_string'

   # Analytics & Ads
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_analytics_id
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id

   # Redis
   UPSTASH_REDIS_REST_URL=https://your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token

   # Environment
   NODE_ENV=development
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
