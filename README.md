# ♻️ Waste Management System (WMS)

A smart and efficient web-based platform to digitalize and automate waste collection and monitoring processes. This system connects users, drivers, and administrators for better transparency, task management, and optimized routing of waste pickup operations.

---

## 🚀 Project Overview

The **Waste Management System (WMS)** streamlines the workflow of waste collection with the following modules:
## 📸 Screenshots

### ✅ Admin Dashboard
![Admin Dashboard](https://i.postimg.cc/xdCp8dPb/Screenshot-2025-07-07-183412.png)

### ✅ Request Management Panel
![Request Panel](https://i.postimg.cc/sXpT0H93/Screenshot-2025-07-07-183649.png)

### ✅ Driver Route View
![Driver View](https://i.postimg.cc/CKJy61Fv/Screenshot-2025-07-07-183703.png)
### 🧍 User Module
- Submit waste pickup requests with photo and geolocation
- Track request status (Pending, Assigned, Completed, Rejected)
- Auto-address and map coordinates capture

### 👨‍✈️ Admin Module
- Dashboard with analytics (Total Requests, Pending, Completed, Unassigned)
- View and manage all requests
- Assign/reassign/reject requests manually or auto-assign using route optimization
- Monitor real-time driver locations using **Socket.IO**
- Manage drivers (Create, Edit, View Profile)
- Visualize driver performance and request statistics (graphs)

### 🚛 Driver Module
- View assigned route with optimized order
- Access map for navigation (via OpenStreetMap)
- Complete tasks with photo proof and notes
- Mark requests as resolved only when location-verified
- View task history and upcoming route

---

## 🧠 Route Optimization (Python Microservice)
- **K-Means Clustering**: Groups pending requests geographically
- **TSP Solver (OR-Tools)**: Finds shortest route for drivers
- Each route is auto-assigned to the nearest available driver based on location

---

## 🗺️ Technologies Used

### 🧩 Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO (for real-time location)
- bcrypt.js (for password hashing)

### 🎨 Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

### 🛠️ Other Tools
- Multer (for image uploads)
- Postman (for testing)
- Python (K-Means)
- OpenStreetMap API (for mapping)

---



