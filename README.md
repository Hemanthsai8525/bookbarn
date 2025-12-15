# BookBarn - Online Bookstore Platform

A full-stack online bookstore application with separate portals for Users, Vendors, and Delivery Agents. Features include book browsing, cart management, order processing, and secure OTP-based authentication.

## 🚀 Features

### User Portal
- Browse books by category, search, and filter
- Shopping cart and wishlist
- Secure checkout with order tracking
- Profile management with OTP-secured password changes
- Email OTP verification for registration and password reset

### Vendor Portal
- Business registration with admin approval
- Book inventory management (Add/Edit/Delete)
- Order management and fulfillment
- Sales analytics dashboard
- OTP-secured profile and password management

### Delivery Agent Portal
- Registration and area assignment
- View assigned deliveries
- Update delivery status
- Earnings tracking
- OTP-secured authentication

### Admin Portal
- User, vendor, and delivery agent management
- Vendor approval workflow
- Order oversight
- Platform analytics
- Book catalog management

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.5**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL** database
- **JavaMailSender** for OTP emails
- **Maven** for dependency management

### Frontend
- **React 18** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bookbarn.git
cd bookbarn
```

### 2. Database Setup

Create MySQL database:

```sql
CREATE DATABASE bookstore;
```

The application will auto-create tables on first run.

### 3. Backend Configuration

Navigate to backend directory:

```bash
cd bookapp
```

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# Email Configuration (Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-gmail-app-password
```

**Note:** For Gmail, you need to generate an App Password:
1. Enable 2-Step Verification
2. Go to: https://myaccount.google.com/apppasswords
3. Generate password for "Mail"
4. Use the 16-character password (remove spaces)

Install dependencies and run:

```bash
mvn clean install
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

### 4. Frontend Configuration

Navigate to frontend directory:

```bash
cd ../frontend_bookapp
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🌐 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Create `Procfile`** in backend root:
```
web: java -jar target/book-0.0.1-SNAPSHOT.jar
```

2. **Update `application.properties`** for production:
```properties
spring.datasource.url=${DATABASE_URL}
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
app.jwt.secret=${JWT_SECRET}
```

3. **Deploy to platform** (example: Railway)
```bash
railway login
railway init
railway up
```

### Frontend Deployment (Vercel/Netlify)

1. **Build production bundle:**
```bash
npm run build
```

2. **Update API URL** in `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
```

3. **Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

## 📁 Project Structure

```
bookbarn/
├── bookapp/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/book/
│   │       ├── config/         # Security, CORS
│   │       ├── controller/     # REST Controllers
│   │       ├── model/          # JPA Entities
│   │       ├── repository/     # Data Access
│   │       └── service/        # Business Logic
│   └── src/main/resources/
│       └── application.properties
│
└── frontend_bookapp/           # React Frontend
    ├── src/
    │   ├── components/         # Reusable Components
    │   ├── pages/              # Page Components
    │   ├── services/           # API Services
    │   └── App.jsx
    └── package.json
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Email OTP Verification** - For registration and password reset
- **Password Encryption** - BCrypt hashing
- **Role-Based Access Control** - USER, VENDOR, DELIVERY_AGENT, ADMIN
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Server-side validation

## 📧 Email OTP System

- **Registration:** Email verification required
- **Password Reset:** OTP-based password recovery
- **Profile Updates:** OTP required for password changes
- **10-minute expiry** for security
- **Console fallback** for development/testing

## 🎨 UI/UX Features

- **Glassmorphism Design** - Modern, premium look
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Framer Motion
- **Toast Notifications** - User feedback
- **Loading States** - Better UX
- **Error Handling** - User-friendly messages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Tailwind CSS
- Framer Motion
- Lucide Icons

## 📞 Support

For support, email your-email@example.com or open an issue.

---

**Made with ❤️ by [Your Name]**
