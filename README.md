# 🚀 Blogotypo - A Modern Next.js Blogging Platform

<img src="https://blogotypo.vercel.app/assets/images/favicon.jpg" alt="Blogotypo" width="150" height="150">

## 🌍 Live Demo

🔗 **[Visit Blogotypo](https://blogotypo.vercel.app)** (Deployed on Vercel)

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
| **Jodit Editor**                | Rich text editor for writing blogs |
| **Cloudinary**                  | Upload & store images              |
| **bcrypt**                      | Secure password hashing            |
| **Nodemailer**                  | Email notifications                |
| **Chart.js + React Chart.js 2** | Graphical blog statistics          |
| **Framer Motion**               | Smooth animations                  |
| **Bootstrap & Tailwind CSS**    | Responsive UI design               |
| **Vercel**                      | Hosting & Deployment               |

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/MoinMN/blogotypo.git
cd blogotypo
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file and add the following:

```env
NEXT_PUBLIC_NEXTAUTH_URL=your-vercel-url
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

### **4️⃣ Run the Development Server**

```bash
npm run dev
```

Now, open **http://localhost:3000** in your browser.

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

### 🛠 **Admin Features**

- **Manage Users (Delete & Set Verified Status)**
- **No Data Update Permissions for Admins**

### 📊 **Analytics & Reporting**

- **Graphical Stats on Blog Performance (Chart.js)**
- **Sort & Filter Blogs Easily**

### 📜 **Legal & Privacy Features**

- **[Terms & Conditions](https://blogotypo.vercel.app/view/docs/term-and-conditions), [Privacy Policy](https://blogotypo.vercel.app/view/docs/privacy-policy), and [License](https://blogotypo.vercel.app/view/docs/license) Pages**
- **GDPR-Compliant User Data Handling**

---

## 🎨 Screenshots

| **Homepage**                                         | **Blog Editor**                                          | **Admin Dashboard**                                        |
| ---------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| ![Home Page](https://github.com/user-attachments/assets/1b63331e-d2ec-40cf-bac0-3d6e1d59247f) | ![Blog Editor](https://github.com/user-attachments/assets/2df6ab64-4078-4593-99c4-8bde89ee1027) | ![Admin Dashboard](https://github.com/user-attachments/assets/27de586d-ee37-477d-b7a9-8bee3832e432) |

---

## 🚀 Deployment

Deployed on **Vercel**. To deploy your own version:

```bash
vercel deploy
```

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork the repository**
2. **Create a new branch** (`feature/my-feature`)
3. **Commit your changes** (`git commit -m "Added a new feature"`)
4. **Push to the branch** (`git push origin feature/my-feature`)
5. **Submit a pull request**

---

## 📜 License

**Blogotypo** is licensed under its own **custom license**. See the full [LICENSE](https://blogotypo.vercel.app/view/docs/license) for details.

---

## 🛠 Need Help?

📧 **Contact:** [crichit45@gmail.com](mailto:crichit45@gmail.com)  
🌐 **Website:** [https://blogotypo.vercel.app](https://blogotypo.vercel.app)  
📣 **Follow us on Socials:** [Twitter](https://x.com/MoinMN5) | [LinkedIn](https://www.linkedin.com/in/moinnaik/) | [Instagram](https://instagram.com/im_moin45)

---

⭐ **Star this repo if you found it useful!** ⭐
