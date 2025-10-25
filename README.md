# TicketFlow - Twig Implementation

A modern, responsive ticket management web application built with **Twig templating engine**, **Vanilla JavaScript**, and **PHP**.

## 🚀 Features

### ✅ Complete Implementation
- **Landing Page**: Eye-catching hero section with wavy SVG background and animated decorative circles
- **Authentication System**: Secure login and signup with form validation and localStorage-based session management
- **Dashboard**: Real-time statistics showing total, open, and resolved tickets
- **Ticket Management (CRUD)**: 
  - **Create** tickets with title, description, status, and priority
  - **Read** tickets displayed in card-style boxes with status tags
  - **Update** existing ticket details with form validation
  - **Delete** tickets with confirmation dialog

### 🎨 Design Features
- **Max-width 1440px** centered layout on large screens
- **Wavy SVG background** in hero section
- **4+ Decorative circles** with floating animations
- **Card-style boxes** with shadows and rounded corners
- **Fully responsive** design (mobile, tablet, desktop)
- **Consistent footer** across all pages

### 🔒 Security & Validation
- Session-based authentication using `localStorage` with key: `ticketapp_session`
- Protected routes (Dashboard and Tickets pages require authentication)
- Form validation with inline error messages
- Status field strictly validates: `open`, `in_progress`, `closed`
- Toast notifications for success/error feedback

### ♿ Accessibility
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels and roles
- High color contrast ratios
- Focus states for all interactive elements

---

## 📁 Project Structure

```
HNG-TASK_2_TWIG/
├── public/
│   ├── css/
│   │   └── style.css          # Complete stylesheet (ALL CSS)
│   ├── js/
│   │   ├── auth.js            # Authentication logic
│   │   ├── router.js          # Navigation helpers
│   │   ├── toast.js           # Toast notifications
│   │   └── tickets.js         # Ticket CRUD logic
│   └── assets/
│       └── images/            # (Optional) For additional assets
├── templates/
│   ├── layout.twig            # Base layout template
│   ├── landing.twig           # Landing page
│   ├── login.twig             # Login page
│   ├── signup.twig            # Signup page
│   ├── dashboard.twig         # Dashboard page
│   └── tickets.twig           # Tickets management page
├── vendor/                    # Composer dependencies
├── index.php                  # Main entry point
├── composer.json              # PHP dependencies
├── composer.lock              # Locked dependency versions
└── README.md                  # This file
```

---

## 🛠️ Technologies Used

- **PHP** 7.4+ (Server-side)
- **Twig** 3.x (Templating engine)
- **Vanilla JavaScript** (ES6+)
- **CSS3** (Flexbox, Grid, Animations)
- **HTML5** (Semantic markup)
- **localStorage** (Client-side storage)

---

## 📦 Installation & Setup

### Prerequisites
1. **PHP** 7.4 or higher
2. **Composer** (PHP dependency manager)
3. A web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Install Dependencies

Open your terminal in the `HNG-TASK_2_TWIG` directory and run:

```bash
composer install
```

This will install Twig and other PHP dependencies.

### Step 2: Start PHP Development Server

Run the following command in your terminal:

```bash
php -S localhost:8000
```

### Step 3: Access the Application

Open your browser and navigate to:

```
http://localhost:8000
```

---

## 🎯 Usage Guide

### Navigation Structure

```
Landing Page (/)
    ├── Login (?page=login)
    ├── Signup (?page=signup)
    │
    └── After Authentication:
        ├── Dashboard (?page=dashboard)
        └── Tickets (?page=tickets)
```

### Test User Credentials

**Note**: This is a demo application. Any email/password combination will work for login.

**Example credentials:**
- Email: `demo@ticketflow.com`
- Password: `password123`

Or create a new account via the Signup page.

---

## 🔧 How It Works

### Authentication Flow

1. **User visits Landing Page** → Can access Login/Signup
2. **User signs up or logs in** → Session token stored in `localStorage`
3. **User accesses protected pages** → `auth.js` checks for valid session
4. **User logs out** → Session cleared, redirected to Landing

### Ticket Management Flow

1. **Dashboard** displays ticket statistics (Total, Open, Resolved)
2. **Tickets Page** shows all tickets in a grid layout
3. **Create Ticket** → Form validation → Save to `localStorage`
4. **Edit Ticket** → Load data into form → Update `localStorage`
5. **Delete Ticket** → Confirmation dialog → Remove from `localStorage`

### Data Persistence

All data is stored in **browser localStorage**:
- `ticketapp_session`: Authentication token
- `tickets`: Array of ticket objects
- `user_email`: User's email
- `user_name`: User's full name

---

## 🎨 Design Specifications

### Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Blue | Blue | `#2563eb` |
| Hover Blue | Dark Blue | `#1d4ed8` |
| Success Green | Green | `#10b981` |
| Error Red | Red | `#dc2626` |
| Warning Amber | Amber | `#f59e0b` |
| Text Primary | Slate | `#1e293b` |
| Text Secondary | Gray | `#64748b` |
| Background | Light Gray | `#f5f7fa` |

### Status Badge Colors

- **Open**: Green background (`#d1fae5`), dark green text (`#065f46`)
- **In Progress**: Amber background (`#fef3c7`), dark amber text (`#92400e`)
- **Closed**: Gray background (`#e5e7eb`), dark gray text (`#374151`)

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout Changes |
|--------|-----------|----------------|
| Desktop | > 1024px | Full grid layout, horizontal navigation |
| Tablet | 768px - 1024px | Adjusted grid columns |
| Mobile | < 768px | Single column, hamburger menu |
| Small Mobile | < 480px | Reduced font sizes, stacked elements |

---

## 🔍 Key Features Explained

### 1. Wavy Hero Background

Implemented using inline SVG with `preserveAspectRatio="none"` for responsiveness:

```html
<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <path d="M0,64 C240,20 480,20 720,64 C960,108 1200,108 1440,64 L1440,120 L0,120 Z" fill="#ffffff"/>
</svg>
```

### 2. Floating Decorative Circles

CSS animations for smooth floating effect:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

### 3. Toast Notifications

Dynamic JavaScript function that creates and removes toast messages:

```javascript
showToast('Ticket created successfully!', 'success');
```

### 4. Client-Side Routing

URL parameter-based routing handled by PHP:

```php
$page = $_GET['page'] ?? 'landing';
```

Example URLs:
- `/?page=landing`
- `/?page=login`
- `/?page=dashboard`

---

## 🚨 Known Issues & Limitations

1. **No Backend Database**: All data is stored in browser localStorage (cleared when cache is cleared)
2. **Single User Session**: No multi-user support
3. **No Email Verification**: Demo-only authentication
4. **No Password Encryption**: Passwords not hashed (demo purposes)
5. **Browser-Specific**: Data doesn't sync across devices

---

## 🔄 Differences from Vue/React Versions

| Feature | Vue/React | Twig + Vanilla JS |
|---------|-----------|-------------------|
| Routing | Client-side (Vue Router / React Router) | URL parameter-based (?page=) |
| State Management | Reactive (Vue data / React state) | Manual DOM manipulation |
| Component System | Component-based | Template-based |
| Build Process | Webpack/Vite | None (served directly) |
| File Structure | .vue / .jsx files | .twig templates + .js files |

## 📞 Support & Contact

For questions or issues related to this project, please refer to the main HNG Task 2 documentation or contact the development team(danielagboola52@gmail.com).

---

## 📄 License

This project is part of the HNG Internship Task 2 - Ticket Management System.

**© 2025 TicketFlow. All rights reserved.**