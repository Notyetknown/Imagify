# Imagify

Imagify is a full-stack AI image-generation application. Users can create an account, generate images from text prompts, track their credit balance, and purchase additional credits through Razorpay.

## Features

- User registration and login with JWT authentication
- Text-to-image generation powered by the ClipDrop API
- Credit-based image generation, with one credit consumed per image
- Razorpay credit purchases with server-side signature verification
- Responsive React interface with animated interactions and toast notifications
- MongoDB persistence for users and payment transactions

## Project Structure

```text
Imagify/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── context/        # Authentication, credits, and API state
│   │   └── pages/           # Home, result, and credit purchase pages
│   └── package.json
├── server/                 # Express API
│   ├── config/              # MongoDB connection
│   ├── controllers/         # User, payment, and image-generation logic
│   ├── middlewares/         # JWT authentication middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # User and image routes
│   └── server.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB database or MongoDB Atlas cluster
- A ClipDrop API key
- Razorpay test or live API credentials

## Installation

Clone the repository and install dependencies in both application packages:

```bash
git clone <repository-url>
cd Imagify

cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create `server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-long-random-secret
CLIPDROP_API=your-clipdrop-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CURRENCY=INR
```

The server appends `/imagify` to `MONGODB_URI`, so the example connects to the `imagify` database. For MongoDB Atlas, use the cluster connection string without a database name, for example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

Use the Razorpay test key for local development. Never commit either `.env` file or expose `RAZORPAY_KEY_SECRET` in the client.

## Running Locally

Open two terminals from the repository root.

Terminal 1, start the API:

```bash
cd server
npm run server
```

The API runs at `http://localhost:4000` by default. For a production-style start, use `npm start`.

Terminal 2, start the frontend:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available Scripts

### Client

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

| Command | Purpose |
| --- | --- |
| `npm run server` | Start the API with nodemon |
| `npm start` | Start the API with Node.js |

## API Reference

All protected endpoints require the JWT in the `token` request header.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | API health check |
| `POST` | `/api/user/register` | No | Create a user account |
| `POST` | `/api/user/login` | No | Authenticate a user |
| `GET` | `/api/user/credits` | Yes | Return the current user and credit balance |
| `POST` | `/api/image/generate-image` | Yes | Generate an image from a prompt and consume one credit |
| `POST` | `/api/user/pay-razor` | Yes | Create a Razorpay order |
| `POST` | `/api/user/verify-razor` | Yes | Verify payment and add purchased credits |

### Example Requests

Register:

```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"strong-password\"}"
```

Generate an image:

```bash
curl -X POST http://localhost:4000/api/image/generate-image \
  -H "Content-Type: application/json" \
  -H "token: <jwt-token>" \
  -d "{\"prompt\":\"A quiet mountain cabin under a star-filled sky\"}"
```

A successful generation returns a base64-encoded PNG in `resultImage` and decreases the user balance by one credit.

## Credit Plans

The server currently supports these plans:

| Plan | Credits | Amount |
| --- | ---: | ---: |
| Basic | 100 | 10 |
| Advanced | 500 | 50 |
| Business | 5,000 | 250 |

The currency is controlled by `CURRENCY` in `server/.env`. The amount values are defined in the server and should be reviewed before switching from Razorpay test mode to live payments.

## Application Flow

1. A visitor registers or logs in from the client.
2. The server returns a JWT, which the client stores locally for authenticated requests.
3. The user submits a prompt and the server checks their credit balance.
4. The server requests an image from ClipDrop, returns it as a base64 PNG, and deducts one credit.
5. When the balance is empty, the user can create a Razorpay order and purchase a credit plan.
6. The server verifies the Razorpay signature before adding credits to the account.

## Security Notes

- Keep `JWT_SECRET`, `MONGODB_URI`, `CLIPDROP_API`, and `RAZORPAY_KEY_SECRET` server-side only.
- Use HTTPS, a restricted CORS origin, and production database credentials when deploying.
- Use Razorpay test credentials until the complete payment flow has been verified.
- Add request validation, rate limiting, and centralized error handling before exposing the API publicly.

## Troubleshooting

- **MongoDB connection fails:** Confirm MongoDB is running and that `MONGODB_URI` is valid.
- **The client cannot reach the API:** Check that the server is running on port 4000 and that `VITE_BACKEND_URL` matches it.
- **Image generation fails:** Confirm `CLIPDROP_API` is present and has available quota.
- **Payments fail:** Confirm both Razorpay key IDs are from the same account and that `CURRENCY` matches the Razorpay configuration.

## License

No project license has been declared yet.
