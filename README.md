# 🚀 Sahayog - Crowdfunding Platform

**Empowering creators and innovators to bring their ideas to life through community funding.**

![Sahayog Platform](https://img.shields.io/badge/Platform-Crowdfunding-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure login/register system with JWT
- **Campaign Management** - Create, edit, and manage fundraising campaigns
- **Smart Contributions** - Interactive contribution flow with progress tracking
- **Email Invoicing** - Automated invoice generation and email delivery
- **Responsive Design** - Beautiful UI/UX across all devices

### 💡 Key Highlights
- **Gradient Progress Bars** - Visual contribution tracking with smooth animations
- **Multiple Contribution Options** - Predefined amounts (₹100, ₹500, ₹1000, ₹2000) + custom amounts
- **Invoice System** - Professional invoices with email delivery via Nodemailer
- **Modern UI** - Built with Tailwind CSS and Lucide React icons
- **Real-time Notifications** - Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email sending functionality
- **Bcrypt** - Password hashing
- **Cloudinary** - Image upload and management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahil9309/sahayog.git
   cd sahayog
   ```

2. **Install Backend Dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `api` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sahayog
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd api
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Application Flow

### 1. User Registration/Login
- Secure authentication system
- JWT-based session management
- Password encryption with bcrypt

### 2. Campaign Management
- Create new fundraising campaigns
- Upload campaign images
- Edit existing campaigns
- Track campaign performance

### 3. Contribution Process
```
My Contributions → Select Amount → Checkout → Payment Success → Email Invoice
```

#### Contribution Features:
- **Predefined Amounts**: ₹100, ₹500, ₹1000, ₹2000
- **Custom Amount**: Enter any amount
- **Progress Visualization**: Gradient progress bar
- **Impact Statistics**: Show platform statistics

### 4. Checkout & Payment
- Professional checkout interface
- Order summary with breakdown
- Mock payment processing (demo mode)
- Automatic invoice generation

### 5. Email Invoice System
- Beautiful HTML email templates
- Automatic invoice numbering
- Transaction ID generation
- PDF-style invoice download

## 🎨 UI/UX Features

### Design Principles
- **Modern Gradient Design** - Blue to purple gradients throughout
- **Responsive Layout** - Mobile-first approach
- **Smooth Animations** - Hover effects and transitions
- **Accessibility** - Screen reader friendly
- **Clean Typography** - Easy to read fonts and spacing

### Key Components
- **Interactive Cards** - Hover effects and selection states
- **Progress Bars** - Animated gradient progress indicators
- **Toast Notifications** - Non-intrusive user feedback
- **Modal Dialogs** - Clean popup interfaces
- **Loading States** - Smooth loading animations

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS` environment variable

### Email Features
- **HTML Templates** - Professional invoice emails
- **Automatic Sending** - Triggered after successful contribution
- **Error Handling** - Graceful fallback if email fails
- **Invoice Attachments** - Text-based invoice download

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile

### Campaigns
- `GET /api/events` - Get all campaigns
- `POST /api/events` - Create new campaign
- `PUT /api/events/:id` - Update campaign
- `DELETE /api/events/:id` - Delete campaign

### Contributions
- `POST /api/send-invoice` - Send invoice email

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run lint
```

### Backend Testing
```bash
cd api
npm test
```

### Manual Testing Checklist
- [ ] User registration/login works
- [ ] Campaign creation/editing functions
- [ ] Contribution flow completes successfully
- [ ] Email invoices are sent
- [ ] All buttons are functional
- [ ] Responsive design works on mobile
- [ ] Footer social links work

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Backend (Heroku/Railway)
1. Set all environment variables
2. Ensure MongoDB connection string is correct
3. Deploy with `npm start` command

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Sahil Kumar**
- GitHub: [@Sahil9309](https://github.com/Sahil9309)
- LinkedIn: [sahil9309](https://linkedin.com/in/sahil9309)
- Email: sahayog.platform@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide React for beautiful icons
- MongoDB for the flexible database
- All contributors and supporters

---

**Made with ❤️ for the creator community**

*Sahayog - Where ideas meet support!*