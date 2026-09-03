# Imagify Client

This directory contains the React and Vite frontend for Imagify. The complete project documentation, including installation, environment variables, API routes, payment setup, and local development commands, is available in the repository root:

[Open the project README](../README.md)

## Client Commands

```bash
npm install
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

Create `client/.env` before starting the app:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```
