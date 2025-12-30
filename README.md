# 💸 Finance Tracker – Expense Analytics & Email Reports

A full-stack expense tracking application that allows users to securely manage expenses, visualize spending analytics, and receive automated weekly expense summary emails. Built with a modern MERN-based stack and deployed using free, production-ready infrastructure.

## 🚀 Features

- JWT-based authentication with protected routes and user-specific data isolation
- Expense management (add, edit, delete, categorized expenses)
- Analytics dashboard with category-wise and daily expense visualizations
- Automated weekly expense summary emails using GitHub Actions cron jobs
- User preferences for currency and date format
- Production deployment with frontend and backend hosted separately

## 🧱 Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- Recharts

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

Background Services:
- Nodemailer (Gmail SMTP)
- GitHub Actions (Scheduled cron jobs)

Deployment:
- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas

## 🕘 Email Automation

Weekly expense summary emails are sent automatically using GitHub Actions, eliminating the need for paid background workers or always-on servers.

- Runs on a scheduled weekly cron
- Uses secure GitHub Actions secrets
- Fetches user expenses from MongoDB
- Sends category-wise summaries via email

## 📂 Project Structure

Finance-Tracker/
├── Frontend/
├── Backend/
├── BGServices/

## 🔐 Environment Variables

Backend (.env):
PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_jwt_secret  

GitHub Actions Secrets:
MONGO_URI  
EMAIL_USER  
EMAIL_PASS  

EMAIL_PASS must be a Gmail App Password.

## 🧪 Local Development

Backend:
cd Backend  
npm install  
npm start  

Frontend:
cd Frontend  
npm install  
npm run dev  

## 📈 Project Highlights

- End-to-end full-stack ownership
- Secure authentication and authorization
- Real-time analytics and data visualization
- Production-ready deployment
- Auto email sender is not deployed yet

## 🔗 Repository

https://github.com/Quickaman/Finance-Tracker
