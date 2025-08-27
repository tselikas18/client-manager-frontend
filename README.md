# Client Manager Frontend

A modern React-based web application for managing business debts and credits. This application allows users to track clients who owe them money and suppliers they owe money to, providing a financial overview.

## Features

### 🔐 Authentication
- User registration and login
- Session-based authentication with HTTP-only cookies
- Protected routes for authenticated users only

### 👥 Client Management
- Add, edit, and delete clients
- Track client contact information (name, phone, email)
- Monitor amounts owed by clients
- Add detailed notes for each client
- Search and filter clients
- View creation and update timestamps

### 🏢 Supplier Management
- Add, edit, and delete suppliers
- Track supplier contact information
- Monitor amounts owed to suppliers
- Add detailed notes for each supplier
- Search and filter suppliers
- View creation and update timestamps

### 📊 Dashboard
- Financial overview with key metrics
- Total money owed to you
- Total money you owe
- Net financial position
- Total contact counts
- Recent clients and suppliers lists

### 🎨 User Interface
- Modern, responsive design using Tailwind CSS
- Mobile-friendly interface
- Intuitive navigation
- Modal forms for adding/editing records
- Expandable notes viewer
- Real-time search functionality

## Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Routing**: React Router 7.8.1
- **Styling**: Tailwind CSS 4.1.12
- **HTTP Client**: Axios 1.11.0
- **Form Validation**: Zod 4.0.17
- **Build Tool**: Vite 7.1.2
- **Development**: TypeScript 5.8.3 with ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running (see backend documentation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:
```env
VITE_API_BASE=http://localhost:8000
```

4. Start the development server:
```bash
vite
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `vite` - Start development server
- `tsc -b && vite build` - Build for production
- `eslint` - Run ESLint
- `vite preview` - Preview production build

## Project Structure

```
src/
├── components/           # React components
│   ├── AuthProvider.tsx  # Authentication context provider
│   ├── Clients.tsx       # Client management page
│   ├── Dashboard.tsx     # Dashboard overview page
│   ├── Layout.tsx        # Main layout wrapper
│   ├── LoginPage.tsx     # Login/register page
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── Suppliers.tsx     # Supplier management page
├── context/
│   └── auth.ts          # Authentication context and API setup
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── App.css              # Global styles
├── index.css            # Base styles
└── main.tsx             # Application entry point
```

## API Integration

The frontend communicates with a backend API for all data operations. The API client is configured in `src/context/auth.ts` with:

- Base URL configuration via environment variables
- Automatic cookie handling for authentication
- 10-second request timeout
- Axios interceptors for error handling

### API Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `GET /clients` - Get user's clients (with search)
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `GET /suppliers` - Get user's suppliers (with search)
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier
- `GET /dashboard` - Get dashboard statistics

## Authentication Flow

1. User visits the application
2. `AuthProvider` checks for existing session via `/auth/me`
3. If authenticated, user is redirected to dashboard/clients
4. If not authenticated, user is redirected to login page
5. After successful login, session is maintained via HTTP-only cookies
6. `ProtectedRoute` components ensure only authenticated users can access protected pages

## Form Validation

The application uses client-side validation with the following rules:

### Clients & Suppliers
- **Name**: Required, minimum 1 character
- **Phone**: Required, must be exactly 10 digits
- **Email**: Optional, must be valid email format if provided
- **Amount Owed**: Required, must be a positive number
- **Notes**: Optional, free text

### Authentication
- **Email**: Required, valid email format
- **Password**: Required
- **Name**: Required for registration

## Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layouts with touch-friendly interfaces
- **Mobile**: Condensed views with mobile-optimized forms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build for Production

```bash
tsc -b && vite build
```

This creates an optimized build in the `dist/` directory.

### Environment Variables for Production

```env
VITE_API_BASE=https://your-api-domain.com
```

### Deploy to Vercel/Netlify

The application is ready for deployment to static hosting services like Vercel or Netlify. Simply connect your repository and the build process will be handled automatically.

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.