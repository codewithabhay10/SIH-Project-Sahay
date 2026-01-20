# WhatsApp Digital Khata Bot 📱💰

A WhatsApp chatbot built with Twilio that provides a Digital Khata (ledger) system with user registration and transaction tracking.

## Features ✨

- **User Registration**: Collect personal details (name, age, DOB, gender, address, income, caste, occupation, education)
- **Digital Khata**: Track credits and debits with balance calculation
- **Transaction Categories**: Income, Expense, Loan Given, Loan Taken, Repayment, Savings
- **Profile Management**: View registered user profile
- **Conversation-based Interface**: Natural chat flow for all operations

## Tech Stack 🛠️

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Twilio** - WhatsApp API integration
- **MongoDB** - Database for persistent storage
- **Mongoose** - ODM for MongoDB

## Project Structure 📁

```
WHATSAPP/
├── config/
│   ├── index.js          # Configuration settings
│   └── database.js       # MongoDB connection
├── src/
│   ├── controllers/
│   │   └── whatsappController.js   # Message handling
│   ├── models/
│   │   ├── User.js       # User schema
│   │   └── KhataEntry.js # Transaction schema
│   ├── services/
│   │   ├── userService.js    # User operations
│   │   └── khataService.js   # Khata operations
│   ├── routes/
│   │   └── whatsapp.js   # API routes
│   ├── utils/
│   │   └── helpers.js    # Utility functions
│   └── index.js          # Entry point
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions 🚀

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Twilio Account with WhatsApp Sandbox or Business API

### Installation

1. **Clone the repository**
   ```bash
   cd WHATSAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update with your credentials:
   ```bash
   cp .env.example .env
   ```

   Update the following values:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   MONGODB_URI=mongodb://localhost:27017/whatsapp_khata
   PORT=3000
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Twilio Configuration

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Join the sandbox by sending the provided code to the Twilio number
4. Configure the webhook URL:
   - **When a message comes in**: `https://your-domain.com/api/whatsapp/webhook`
   - Method: `POST`

> **Note**: For local development, use [ngrok](https://ngrok.com) to expose your local server:
> ```bash
> ngrok http 3000
> ```

## Bot Commands 📝

| Command | Description |
|---------|-------------|
| `MENU` or `HI` | Show main menu |
| `REGISTER` | Start registration process |
| `KHATA` | View digital ledger summary |
| `ADD` | Add new transaction |
| `PROFILE` | View your profile |
| `BALANCE` | Check current balance |
| `DELETE` | Delete last entry |
| `HELP` | Get help |
| `CANCEL` | Cancel current operation |

## Registration Flow 📋

The bot collects the following information during registration:

1. Full Name
2. Age
3. Date of Birth (DD/MM/YYYY)
4. Gender
5. Full Address
6. Monthly Income
7. Caste/Community
8. Occupation
9. Education Level

## Transaction Categories 💳

- **Income** - Regular income
- **Expense** - Regular expenses
- **Loan Given** - Money lent to others
- **Loan Taken** - Money borrowed
- **Repayment** - Loan repayments
- **Savings** - Savings deposits
- **Other** - Miscellaneous

## API Endpoints 🔌

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/whatsapp/webhook` | Twilio webhook for incoming messages |
| GET | `/api/whatsapp/webhook` | Health check for webhook |
| GET | `/health` | Server health check |
| GET | `/` | API info |

## Environment Variables 🔐

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Development 🔧

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start
```

## License 📄

ISC

## Support 💬

For issues or questions, please open an issue in the repository.

---

Made with ❤️ for Digital India
