# 🎫 AWS Serverless Ticketing System

A fully functional serverless ticketing system built using Vue.js and AWS cloud services, designed as a proof-of-concept project running completely on the AWS Free Tier. The application enables customers and support agents to create, manage, track, and resolve support tickets through a secure and scalable architecture.

It uses AWS Lambda for backend processing, Amazon Cognito for authentication and authorization, DynamoDB for data storage, S3 for file handling, and CloudFront for global HTTPS delivery. The project demonstrates a complete end-to-end cloud-native workflow using modern frontend and serverless backend technologies. The system is role-based, highly modular, and follows a scalable API-driven design — with nothing running on a local machine.

---

## 🎬 Demo Video

▶️ **Watch the full demo on YouTube:**
[https://youtu.be/VrPfhzq26fU?si=7yn-MNSTd9BBCncF](https://youtu.be/VrPfhzq26fU?si=7yn-MNSTd9BBCncF)

---

## 🌐 Live Application

The frontend is deployed on **Amazon S3** and served globally through **AWS CloudFront** over HTTPS. No local server or ngrok is required — the application runs 24/7 entirely on AWS.

🔗 **Live URL:** https://d2dys8s7hvrr9t.cloudfront.net

---

## 🔐 Test Accounts

| Role | Email | Password |
|:----:|:-----:|:--------:|
| 👤 Customer | jaikumarnaidu123@gmail.com | Chintujay@123 |
| 🛠️ Agent | jaikumarnaidu123+agent@gmail.com | Chintujay@123 |

---

## ✅ Features Implemented

### Authentication
- ✅ User Sign-up & Sign-in via Amazon Cognito Managed Login
- ✅ Two roles: **Customer** and **Agent**
- ✅ Protected routes in Vue.js
- ✅ JWT token-based API authorization on all endpoints

### Ticket Management
- ✅ Create new ticket with Title, Description, Priority and Category
- ✅ File attachment support via S3 pre-signed URLs
- ✅ List and filter tickets by Status and Priority
- ✅ View full ticket details with comments timeline
- ✅ Update ticket status and assignee *(Agent only)*
- ✅ Add comments on any ticket

### Access Control
- ✅ Customers see **only their own tickets**
- ✅ Agents see **all tickets** from all customers
- ✅ Only Agents can update ticket status and assignee

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + Tailwind CSS |
| Backend | AWS Lambda — Node.js 20.x |
| API | AWS API Gateway — HTTP API |
| Database | Amazon DynamoDB |
| Authentication | Amazon Cognito |
| File Storage | Amazon S3 |
| CDN / Hosting | Amazon CloudFront + S3 |

---

## ☁️ AWS Services Used

| Service | Purpose |
|---------|---------|
| **Amazon S3** | Hosts the Vue.js frontend files and stores file attachments |
| **AWS CloudFront** | Serves the frontend globally over HTTPS with low latency |
| **AWS Lambda** | 7 serverless functions handling all backend API operations |
| **Amazon API Gateway** | HTTP API routing with JWT authorizer on every route |
| **Amazon Cognito** | User authentication, authorization and group management |
| **Amazon DynamoDB** | NoSQL database for tickets and comments |
| **AWS IAM** | Role-based permissions for Lambda to access AWS services |
| **Amazon CloudWatch** | Logging and monitoring for Lambda functions |

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tickets` | Create a new ticket |
| `GET` | `/tickets` | List tickets (filtered by role) |
| `GET` | `/tickets/{ticketId}` | Get single ticket details |
| `PUT` | `/tickets/{ticketId}` | Update ticket status and assignee |
| `POST` | `/tickets/{ticketId}/comments` | Add a comment |
| `GET` | `/tickets/{ticketId}/comments` | Get all comments |
| `POST` | `/tickets/presigned-url` | Generate S3 file upload URL |

> 🔒 All endpoints are protected by **Amazon Cognito JWT Authorizer**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Vue.js Frontend                 │
│    (Vue 3 + Vite + Tailwind CSS)        │
│    Hosted on Amazon S3                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         AWS CloudFront                  │
│   Global CDN — HTTPS Delivery           │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│        Amazon Cognito                   │
│   JWT Token Verification                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      API Gateway (HTTP API)             │
│      Routes + JWT Authorizer            │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┴────────────┐
    ▼                        ▼
┌──────────────┐    ┌─────────────────────┐
│ AWS Lambda   │    │    AWS Lambda       │
│  (Tickets)   │    │   (Comments +       │
│              │    │    Presigned URL)   │
└──────┬───────┘    └──────────┬──────────┘
       │                       │
       ▼                       ▼
┌─────────────────────────────────────────┐
│          Amazon DynamoDB                │
│  ┌──────────────┐  ┌───────────────┐   │
│  │   Tickets    │  │   Comments    │   │
│  │    Table     │  │    Table      │   │
│  └──────────────┘  └───────────────┘   │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           Amazon S3                     │
│      File Attachments Storage           │
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
aws-ticketing-system/
│
├── 📁 frontend/                        # Vue.js Application
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── index.js               # Axios API + JWT interceptor
│   │   ├── 📁 components/
│   │   │   └── Navbar.vue             # Navigation bar
│   │   ├── 📁 router/
│   │   │   └── index.js               # Vue Router + protected routes
│   │   ├── 📁 stores/
│   │   │   └── auth.js                # Auth state + role detection
│   │   └── 📁 views/
│   │       ├── Login.vue              # Login page
│   │       ├── Callback.vue           # Cognito OAuth callback
│   │       ├── TicketList.vue         # Ticket list with filters
│   │       ├── CreateTicket.vue       # New ticket form
│   │       └── TicketDetail.vue       # Ticket detail + comments
│   ├── .env                           # Environment variables
│   ├── vite.config.js                 # Vite configuration
│   └── package.json
│
├── 📁 backend/                        # AWS Lambda Functions
│   ├── 📁 handlers/
│   │   ├── tickets.js                 # Ticket CRUD operations
│   │   ├── comments.js                # Comment operations
│   │   └── presignedUrl.js            # S3 pre-signed URL generation
│   └── 📁 utils/
│       └── response.js                # HTTP response helper
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- AWS Account (Free Tier)
- AWS CLI configured

### 1. Clone Repository
```bash
git clone https://github.com/jainaidu866/AWS-Ticketing-System.git
cd AWS-Ticketing-System
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Create `.env` File in Frontend Folder
```env
VITE_COGNITO_DOMAIN=your_cognito_domain
VITE_CLIENT_ID=your_cognito_client_id
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_API_URL=your_api_gateway_url
```

### 4. Run Frontend Locally
```bash
npm run dev
```

Open 👉 `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

Upload the `dist/` folder to your S3 bucket and invalidate CloudFront cache.

---

## ☁️ AWS Free Tier Usage

| Service | Usage | Free Tier Limit |
|---------|-------|----------------|
| Lambda | 7 functions | 1M requests/month |
| API Gateway | HTTP API | 1M requests/month |
| DynamoDB | 2 tables | 25 GB storage |
| Cognito | User Pool | 50,000 MAUs |
| S3 | Frontend + Attachments | 5 GB storage |
| CloudFront | CDN Distribution | 1 TB data transfer/month |

---

## 👨‍💻 Author

**Jaikumar Naidu**