# 🍔 Resto Modern App (Enterprise Monolith)

A high-performance, mobile-first Restaurant Ordering System built with **Next.js 14 (App Router)**, **Prisma ORM**, and **MySQL**. Featuring a ShopeeFood-inspired Customer UI and an Enterprise-grade AdminLTE 3 Dashboard.

## ✨ Core Features
### 📱 Customer Portal (Mobile First)
* **ShopeeFood-style UI:** Strict mobile viewport bounds (`max-w-7xl` wrapper with `420px` constraints) running on Desktop/Mobile seamlessly.
* **Instant Cart (Zustand):** Zero-latency state management for cart items.
* **Midtrans Integration:** Dual gateway supporting native Qris/GoPay/OVO and manual Cashier orders with DeepLink intercepts.

### 🏢 Admin Panel (AdminLTE 3)
* **Real-time Live Kanban:** Split-lane architecture isolating "Kasir Tunai / Pending" from the active "Kitchen Queue".
* **Auto-Polling Webhook Simulator:** Bypasses localhost IP restrictions by actively polling native Midtrans API statuses in the background perfectly synchronizing offline and online orders.
* **Dynamic CRUD:** Categories & Coffee Menu active management matrices.
* **QR Table Generator:** Instant QR Code creation mapped to precise physical restaurant tables via React-QR.
* **Audio Alerts:** Native Web Audio API synthesis generating a pristine digital receptionist bell for incoming `NEW` orders.
* **Executive History Exports:** Auto-computed transaction histories featuring Native True `.xlsx` (SheetJS) and Print-to-PDF/A4 reports.

## 🚀 Tech Stack
* **Core Framework:** Next.js 14 / React 18
* **Relational Database:** MySQL (via Laragon / XAMPP)
* **Data Access:** Prisma ORM
* **Styling Engine:** Tailwind CSS + Shadcn/UI
* **Core Utilities:** Zustand, BcryptJS, Lucide React, XLSX (SheetJS)

## 🛠️ Installation & Setup
1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/muhammadroyyan11/easy-orders.git
   cd easy-orders
   npm install
   ```
2. **Environment Variables (.env)**
   ```ini
   DATABASE_URL="mysql://root:@127.0.0.1:3306/resto_db"
   MIDTRANS_SERVER_KEY="SB-Mid-server-xxxx"
   MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxx"
   MIDTRANS_IS_PRODUCTION="false"
   ```
3. **Database Migration & Seeding**
   ```bash
   npx prisma migrate dev
   npx prisma db push
   npx prisma generate
   ```
4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Admin Authentication Architecture
The system employs secure Edge Middleware cookies. Upon the first successful initial login attempt (`admin@admin.com` / `password123`), the Database will computationally auto-heal and inject a heavily salted `Bcrypt` hash payload into the `User` table, permanently shielding the monolith credentials.
