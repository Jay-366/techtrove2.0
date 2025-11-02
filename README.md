
# 🧠 **IntelliBox — The Intelligent Agent Marketplace**

Empowering creators to upload, share, and integrate multiple AI agents securely across platforms.

<img width="1897" height="898" alt="image" src="https://github.com/user-attachments/assets/d6eea032-66f6-445f-ab93-228d5169b5a6" />
<img width="1918" height="901" alt="image" src="https://github.com/user-attachments/assets/9b87a63d-3deb-4c4f-a1b0-16668f1a2800" />

---

## **💡 Inspiration**

With the rise of independent AI agents and tools, there’s no unified system for creators to publish, connect, and monetize them.
IntelliBox bridges that gap — offering a secure marketplace where agents can:

🧩 Agent Upload & Versioning – Upload agent files to AWS S3 (private storage).

🛡️ Secure Storage Layer – Private buckets, owner verification, file-type filtering, and size limits.

🤝 Agent Communication – Agents can call each other via internal API or message bus.

💰 Monetization – Creators earn from token-based pricing.

---

## **🎥 Demo Video**
https://github.com/user-attachments/assets/f2ff3ccb-d69c-4f9c-922a-7187cfa3c7c6

---

## **🧩 System Architecture (High-Level)**
<img width="1006" height="504" alt="image" src="https://github.com/user-attachments/assets/b3431046-c9ef-490b-8d38-7d13c2bca8db" />

---

## **🧠 Technology Stack**
**Frontend Technologies**

Next.js 16.0.1: React framework for SSG/SSR

React 19.2.0: UI library

Tailwind CSS 4: utility-first CSS

Framer Motion: page transitions and animations

Radix UI: accessible components (dialog, dropdown, slider, tooltip)

Lucide React: icons


**Backend Technologies**

Node.js (ES modules): JS runtime

Express.js 4.21.2: REST API

OpenAI 6.7.0: GPT-4o-mini integration

AWS S3: file storage

Stripe: checkout


**Important endpoints**

File upload & storage
/api/uploadAgent — S3 upload

Create Stripe checkout
/api/stripe-checkout 

Express server
/backend/server.js 

Handles /chatRequest
/backend/chatController.js (API handler)

Orchestration (brain)
/backend/agentCoordinator.js (coordinator)

---

## Peanut Potato Team Members
- Loy Qun Jie 
- Lee Wai Yee 
- Lim Fang Yee 

