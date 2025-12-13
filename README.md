# 🚀 Blogotypo - A Modern Next.js Blogging Platform

<img src="https://blogotypo.moinnaik.bio/assets/images/favicon.jpg" alt="Blogotypo" width="150" height="150">

## 🌍 Live Demo

🔗 **[Visit Blogotypo](https://blogotypo.moinnaik.bio)** (Deployed on Vercel)

---

## 📖 About Blogotypo

**Blogotypo** is a **feature-rich, secure, and user-friendly** blogging platform built with **Next.js**. It allows users to **create, publish, and manage blogs**, with advanced features like search, filtering, sharing, and verified user authentication.

### ✅ Features:

- **Anyone can create & publish blogs**
- **NextAuth with Google & GitHub authentication**
- **Secure password encryption using bcrypt**
- **Full CRUD operations for blogs**
- **Real-time blog views tracking**
- **Blog sharing options**
- **Recommended blogs section**
- **Advanced search & filtering (Sort by, Blogs per Page, etc.)**
- **Review system with ⭐⭐⭐⭐⭐ rating**
- **Admin dashboard for managing users**
- **User account deletion request system via `/contact`**
- **Legal pages: Terms & Conditions, Privacy Policy, License**

---

## 🔥 Tech Stack

| **Technology**                  | **Usage**                          |
| ------------------------------- | ---------------------------------- |
| **Next.js**                     | Frontend & Backend                 |
| **MongoDB + Mongoose**          | Database for storing blogs & users |
| **NextAuth.js**                 | Authentication (Google & GitHub)   |
| **Redux & Redux Toolkit**       | State management & global state    |
| **Jodit Editor**                | Rich text editor for writing blogs |
| **Cloudinary**                  | Upload & store images              |
| **bcrypt**                      | Secure password hashing            |
| **Nodemailer**                  | Email notifications                |
| **Chart.js + React Chart.js 2** | Graphical blog statistics          |
| **Framer Motion**               | Smooth animations                  |
| **Bootstrap & Tailwind CSS**    | Responsive UI design               |
| **Docker & Docker Compose**     | Containerization & Orchestration   |
| **Vercel**                      | Hosting & Deployment               |

---

## 🚀 Installation & Setup

### **Option 1: Local Development (Standard Setup)**

#### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/MoinMN/blogotypo.git
cd blogotypo
```

#### **2️⃣ Install Dependencies**

```bash
npm install
```

#### **3️⃣ Set Up Environment Variables**

Create a `.env` file and add the following:

```env
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_email_id
SMTP_PASS=your_smtp_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### **4️⃣ Run the Development Server**

```bash
npm run dev
```

Now, open **http://localhost:3000** in your browser.

---

### **Option 2: Docker Setup (Recommended for Production) 🐳**

Docker makes it easy to run Blogotypo with **zero configuration**. The setup includes:
- **Blogotypo Next.js App** (Port 3000)
- **MongoDB Database** (Port 27017)
- **Automatic health checks**
- **Persistent data storage**

#### **Prerequisites**

- **Docker** installed ([Get Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** installed ([Get Docker Compose](https://docs.docker.com/compose/install/))

#### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/MoinMN/blogotypo.git
cd blogotypo
```

#### **2️⃣ Set Up Environment Variables**

Create a `.env` file with the following configuration:

```env
# Next.js & NextAuth
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# MongoDB (Docker)
MONGODB_URI=mongodb://admin:admin@mongodb:27017/Blogotypo?authSource=admin

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_email_id
SMTP_PASS=your_smtp_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **📝 Note:** The MongoDB URI for Docker uses `mongodb://admin:admin@mongodb:27017/Blogotypo?authSource=admin` where `mongodb` is the service name defined in `docker-compose.yaml`.

#### **3️⃣ Build and Run with Docker Compose**

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes all data)
docker compose down -v
```

#### **4️⃣ Access the Application**

- **Blogotypo App:** http://localhost:3000
- **MongoDB:** `localhost:27017` (username: `admin`, password: `admin`)

#### **5️⃣ Useful Docker Commands**

```bash
# Rebuild containers after code changes
docker compose up -d --build

# View running containers
docker compose ps

# Access container shell
docker exec -it blogotypo-app sh

# View MongoDB logs
docker compose logs mongodb

# Restart services
docker compose restart

# Stop specific service
docker compose stop blogotypo
```

---

## 🐳 Docker Configuration Details

### **Docker Architecture**

The application uses a **multi-stage Docker build** for optimization:

1. **Builder Stage**: Installs dependencies and builds Next.js
2. **Runner Stage**: Creates a minimal production image with only necessary files

### **Services**

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| **blogotypo** | `blogotypo-app` | 3000 | Next.js application |
| **mongodb** | `blogotypo-db` | 27017 | MongoDB database |

### **Volumes**

- `mongo-data`: Persistent storage for MongoDB data (survives container restarts)

### **Networks**

- `blogotypo-network`: Bridge network for inter-container communication

### **Health Checks**

Both services include health checks to ensure reliability:
- **Blogotypo**: Checks `/api/health` endpoint every 30s
- **MongoDB**: Runs `mongosh` ping every 10s

---

## 🛠 Features & Functionalities

### 📝 **Blog System**

- **Create, Read, Update, Delete (CRUD) Blogs**
- **Rich Text Editing with Jodit**
- **Blog View Count Tracking**
- **Review System with ⭐⭐⭐⭐⭐ Ratings**
- **Share Blogs on Social Media**
- **Search & Advanced Filtering**

### 🔒 **User Authentication**

- **Login with Google & GitHub (NextAuth.js)**
- **Secure Password Encryption (bcrypt)**
- **Verified Users System**
- **Users Can Request Account Deletion**

### 📊 **State Management**

- **Redux & Redux Toolkit for global state management**
- **Centralized store for user, blog, and app state**
- **Async thunks for API calls and side effects**
- **Persistent state management for enhanced UX**

### 🛠 **Admin Features**

- **Manage Users (Delete & Set Verified Status)**
- **No Data Update Permissions for Admins**

### 📊 **Analytics & Reporting**

- **Graphical Stats on Blog Performance (Chart.js)**
- **Sort & Filter Blogs Easily**

### 📜 **Legal & Privacy Features**

- **[Terms & Conditions](https://blogotypo.moinnaik.bio/docs/term-and-conditions), [Privacy Policy](https://blogotypo.moinnaik.bio/docs/privacy-policy), and [License](https://blogotypo.moinnaik.bio/docs/license) Pages**
- **GDPR-Compliant User Data Handling**

---

## 🎨 Screenshots

| **Homepage**                                         | **Blog Editor**                                          | **Admin Dashboard**                                        |
| ---------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| ![Home Page](https://github.com/user-attachments/assets/1b63331e-d2ec-40cf-bac0-3d6e1d59247f) | ![Blog Editor](https://github.com/user-attachments/assets/2df6ab64-4078-4593-99c4-8bde89ee1027) | ![Admin Dashboard](https://github.com/user-attachments/assets/27de586d-ee37-477d-b7a9-8bee3832e432) |

---

## 🚀 Deployment

### **Vercel Deployment**

Deployed on **Vercel**. To deploy your own version:

```bash
vercel deploy
```

### **Docker Deployment (VPS/Cloud)**

To deploy on a VPS or cloud server:

1. **Install Docker and Docker Compose** on your server
2. **Clone the repository** and set up `.env` file
3. **Run Docker Compose:**

```bash
docker compose up -d
```

4. **Configure reverse proxy** (Nginx/Caddy) for HTTPS
5. **Update OAuth redirect URLs** in Google/GitHub console

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork the repository**
2. **Create a new branch** (`feature/my-feature`)
3. **Commit your changes** (`git commit -m "Added a new feature"`)
4. **Push to the branch** (`git push origin feature/my-feature`)
5. **Submit a pull request**

---

## 🐛 Troubleshooting

### **Docker Issues**

**Problem:** Port 3000 or 27017 already in use
```bash
# Find and kill the process using the port
lsof -ti:3000 | xargs kill -9
lsof -ti:27017 | xargs kill -9
```

**Problem:** MongoDB connection failed
- Ensure MongoDB service is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify `MONGODB_URI` in `.env` matches Docker Compose configuration

**Problem:** Changes not reflected after rebuild
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

## 📜 License

**Blogotypo** is licensed under its own **custom license**. See the full [LICENSE](https://blogotypo.moinnaik.bio/docs/license) for details.

---

## 🛠 Need Help?

📧 **Contact:** [crichit45@gmail.com](mailto:crichit45@gmail.com)  
🌐 **Website:** [https://blogotypo.moinnaik.bio](https://blogotypo.moinnaik.bio)  
📣 **Follow us on Socials:** [Twitter](https://x.com/MoinMN5) | [LinkedIn](https://www.linkedin.com/in/moinnaik/) | [Instagram](https://instagram.com/im_moin45)

---

⭐ **Star this repo if you found it useful!** ⭐

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/MoinMN/blogotypo?style=social)
![GitHub forks](https://img.shields.io/github/forks/MoinMN/blogotypo?style=social)
![License](https://img.shields.io/badge/license-Custom-blue.svg)
