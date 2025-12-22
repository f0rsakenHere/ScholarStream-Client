# ScholarStream

A modern scholarship management platform that connects students with scholarship opportunities and enables seamless application tracking and reviews.

## Live Demo

🚀 **Live Application**: [https://scholar-stream-client-three.vercel.app/](https://scholar-stream-client-three.vercel.app/)

## Features

### Student Features

- Browse and search scholarships
- Apply for scholarships with Stripe payment integration
- Track application status in real-time
- Submit and manage reviews for scholarships
- View personalized dashboard with application history
- Manage personal profile and application documents

### Moderator Features

- Review and manage student applications
- Update application status and provide feedback
- View all student reviews
- Approve or reject applications

### Admin Features

- Create and manage scholarships
- View analytics and platform statistics
- Manage user roles and permissions
- Monitor all applications and reviews

## Technology Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS + DaisyUI** - Styling
- **Stripe** - Payment processing
- **Firebase** - Authentication
- **SweetAlert2** - Notifications
- **Axios** - HTTP client

### Key Libraries

- @stripe/react-stripe-js - Stripe integration
- react-icons - Icon library
- react-query - Server state management

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository

```bash
git clone https://github.com/f0rsakenHere/ScholarStream-Client.git
cd ScholarStream-Client
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file with required environment variables:

```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── Auth/        # Login, Register, Password reset
│   ├── Dashboard/   # Student, Moderator, Admin dashboards
│   ├── Home/        # Landing page components
│   ├── Payment/     # Stripe payment pages
│   └── Shared/      # Navbar, Footer, etc.
├── hooks/           # Custom React hooks
├── routes/          # Route definitions and guards
├── providers/       # Context providers (Auth, etc.)
├── firebase/        # Firebase configuration
└── assets/          # Images and static files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Role-Based Access Control

The application implements three user roles:

- **Student** - Default role for new users
- **Moderator** - Can review applications
- **Admin** - Can manage scholarships and users

Routes are protected based on user roles using custom route guards.

## Contributing

This is a student project. For contributions, please contact the project maintainer.

## Author

**Mehedi Hasan**

## License

This project is open source and available under the MIT License.
