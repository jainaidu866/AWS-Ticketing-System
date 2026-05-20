# 🎫 AWS Serverless Ticketing System

A fully functional ticketing system POC built with Vue.js + AWS Lambda in one day, running entirely on AWS Free Tier.

---

## 🚀 Live Demo

> Run locally with ngrok or clone and deploy yourself.

**Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Customer | jaikumarnaidu123@gmail.com | your_password |
| Agent | jaikumarnaidu123+agent@gmail.com | your_password |

---

## 📸 Screenshots

### 1. Login Screen
![Login](screenshots/login.png)

### 2. Customer - My Tickets
![Customer Tickets](screenshots/customer-tickets.png)

### 3. Create New Ticket
![Create Ticket](screenshots/create-ticket.png)

### 4. Ticket Detail & Comments
![Ticket Detail](screenshots/ticket-detail.png)

### 5. Agent - All Tickets
![Agent Tickets](screenshots/agent-tickets.png)

### 6. Agent - Update Ticket
![Agent Update](screenshots/agent-update.png)

---

## ✅ Features Implemented

### Authentication
- ✅ User Sign-up & Sign-in via Amazon Cognito Hosted UI
- ✅ Two roles: Customer and Agent
- ✅ Protected routes in Vue.js
- ✅ JWT token based API authorization

### Ticket Management
- ✅ Create new ticket with Title, Description, Priority, Category
- ✅ File attachment support via S3 pre-signed URLs
- ✅ List & filter tickets by Status and Priority
- ✅ View ticket details with activity timeline
- ✅ Update ticket status & assignee (Agent only)
- ✅ Add comments on tickets

### Access Control
- ✅ Customers see only their own tickets
- ✅ Agents see all tickets from all customers
- ✅ Only agents can update ticket status and assignee

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + Tailwind CSS |
| Backend | AWS Lambda (Node.js 20.x) |
| API | AWS API Gateway (HTTP API) |
| Database | Amazon DynamoDB |
| Authentication | Amazon Cognito |
| File Storage | Amazon S3 |

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tickets | Create a new ticket |
| GET | /tickets | List tickets (filtered by role) |
| GET | /tickets/{ticketId} | Get single ticket details |
| PUT | /tickets/{ticketId} | Update ticket status & assignee |
| POST | /tickets/{ticketId}/comments | Add a comment |
| GET | /tickets/{ticketId}/comments | Get all comments |
| POST | /tickets/presigned-url | Generate S3 upload URL |

> All endpoints protected by Amazon Cognito JWT Authorizer

---

## 🏗️ Architecture

Vue.js Frontend
│
▼
API Gateway (HTTP API)
│
▼
AWS Lambda Functions (Node.js 20.x)
│
├──▶ DynamoDB (Tickets + Comments)
├──▶ S3 (File Attachments)
└──▶ Cognito (Auth Verification)    

---

## 📁 Project Structure

aws-ticketing-system/
├── frontend/                  # Vue.js application
│   ├── src/
│   │   ├── api/               # Axios API configuration
│   │   ├── components/        # Navbar component
│   │   ├── router/            # Vue Router setup
│   │   ├── stores/            # Auth store
│   │   └── views/             # Login, Tickets, Detail pages
│   ├── .env                   # Environment variables
│   └── package.json
├── backend/                   # Lambda function handlers
│   ├── handlers/
│   │   ├── tickets.js         # Ticket CRUD operations
│   │   ├── comments.js        # Comment operations
│   │   └── presignedUrl.js    # S3 pre-signed URL generation
│   └── utils/
│       └── response.js        # Response helper
├── screenshots/               # Project screenshots
└── README.md


---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- AWS Account (Free Tier)
- AWS CLI configured

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/aws-ticketing-system.git
cd aws-ticketing-system
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Create `.env` file in frontend folder

VITE_COGNITO_DOMAIN=your_cognito_domain
VITE_CLIENT_ID=your_cognito_client_id
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_API_URL=your_api_gateway_url

### 4. Run Frontend
```bash
npm run dev
```

Open `http://localhost:5173`

---

## ☁️ AWS Services Used (All Free Tier)

| Service | Usage | Free Tier Limit |
|---------|-------|----------------|
| Lambda | 7 functions | 1M requests/month |
| API Gateway | HTTP API | 1M requests/month |
| DynamoDB | 2 tables | 25GB storage |
| Cognito | User Pool | 50,000 MAUs |
| S3 | File storage | 5GB storage |

---

## 👨‍💻 Author

**Jaikumar Naidu**

Built as a 1-Day POC Assignment