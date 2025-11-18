# KidsLearn Backend API Documentation

## Overview
Simple backend for kidsLearn app where children register, login, and create/browse learning items with images and voice recordings.

## Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables (.env)
```
APP_PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kidslearn
DIALECT=mysql
APP_SUPER_SECRET_KEY=your_secret_key_here
```

### Start Server
```bash
node app.js
```

## API Endpoints

### 1. Register Child
**POST** `/api/auth/register`

**Request Body (JSON):**
```json
{
  "childName": "John",
  "dateOfBirth": "2015-05-20",
  "mobileNumber": "9876543210",
  "password": "pass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Child registered successfully",
  "data": {
    "user": {
      "id": 1,
      "childName": "John",
      "dateOfBirth": "2015-05-20",
      "mobileNumber": "9876543210",
      "createdAt": "2025-11-14T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request Body (JSON):**
```json
{
  "mobileNumber": "9876543210",
  "password": "pass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "childName": "John",
      "mobileNumber": "9876543210"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Create Learning Item (with image + voice)
**POST** `/api/items/create`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `categoryId`: (number) - Category ID (e.g., 1)
- `itemName`: (string) - Name of the item (e.g., "Apple")
- `description`: (string, optional) - Description
- `image`: (file) - Image file (required, JPG/PNG)
- `voice`: (file, optional) - Voice recording file (MP3/WAV)

**Postman Example:**
1. Set method to POST
2. URL: `http://localhost:3000/api/items/create`
3. Headers tab → Add: `Authorization: Bearer <your_token>`
4. Body tab → Select `form-data`
5. Add fields:
   - categoryId: 1
   - itemName: Apple
   - image: (select file)
   - voice: (select file)
6. Send

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Learning item created successfully",
  "data": {
    "id": 5,
    "userId": 1,
    "categoryId": 1,
    "itemName": "Apple",
    "imageUrl": "/uploads/images/1234567890-apple.jpg",
    "voiceUrl": "/uploads/voice/1234567890-apple.mp3",
    "description": null,
    "category": {
      "id": 1,
      "name": "Fruits"
    },
    "user": {
      "id": 1,
      "childName": "John"
    }
  }
}
```

---

### 4. Get Items by Category
**GET** `/api/items/category/:categoryId`

**URL:** `http://localhost:3000/api/items/category/1`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [
    {
      "id": 5,
      "userId": 1,
      "categoryId": 1,
      "itemName": "Apple",
      "imageUrl": "/uploads/images/1234567890-apple.jpg",
      "voiceUrl": "/uploads/voice/1234567890-apple.mp3",
      "category": { "id": 1, "name": "Fruits" },
      "user": { "id": 1, "childName": "John" }
    }
  ]
}
```

---

### 5. Get My Items (User's Created Items)
**GET** `/api/items/my-items`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Your items retrieved successfully",
  "data": [
    {
      "id": 5,
      "itemName": "Apple",
      "imageUrl": "/uploads/images/1234567890-apple.jpg",
      "voiceUrl": "/uploads/voice/1234567890-apple.mp3",
      "category": { "id": 1, "name": "Fruits" }
    }
  ]
}
```

---

### 6. Get Single Item Details
**GET** `/api/items/:itemId`

**URL:** `http://localhost:3000/api/items/5`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    "id": 5,
    "userId": 1,
    "categoryId": 1,
    "itemName": "Apple",
    "imageUrl": "/uploads/images/1234567890-apple.jpg",
    "voiceUrl": "/uploads/voice/1234567890-apple.mp3",
    "category": { "id": 1, "name": "Fruits" },
    "user": { "id": 1, "childName": "John" },
    "pronunciation": { "id": 1, "audioUrl": "/uploads/voice/pronunciation-apple.mp3", "language": "en" }
  }
}
```

---

## Database Schema

### Users Table
- `id` (PK)
- `childName` - Child's name
- `dateOfBirth` - Date of birth
- `mobileNumber` - Unique mobile number
- `password` - Hashed password
- `createdAt`, `updatedAt`

### Categories Table
- `id` (PK)
- `name` - Category name (e.g., "Fruits", "Animals")
- `description` - Optional description
- `createdAt`, `updatedAt`

### LearningItems Table
- `id` (PK)
- `userId` (FK) - User who created it
- `categoryId` (FK) - Which category
- `itemName` - Name of item (e.g., "Apple")
- `imageUrl` - Path to image file
- `voiceUrl` - Path to voice recording
- `description` - Optional description
- `createdAt`, `updatedAt`

### Pronunciations Table
- `id` (PK)
- `itemId` (FK) - Learning item this pronunciation is for
- `audioUrl` - Audio file path
- `language` - Language code (default: "en")
- `createdAt`, `updatedAt`

---

## Workflow Summary

1. **Register** → Child creates account with name, DOB, mobile, password
2. **Login** → Child logs in with mobile + password, gets JWT token
3. **Browse Categories** → View available categories (pre-loaded like "Animals", "Fruits", "Family")
4. **View Items in Category** → See all items (images + names) in a category
5. **Play Voice** → Child taps button to hear pronunciation
6. **Create Own Item** → Authenticated child uploads image + voice to create custom item
7. **View My Items** → Child sees items they created

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "categoryId and itemName are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Item not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Mobile number already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create learning item",
  "error": "Error details"
}
```

---

## Testing Flow (Postman)

### Step 1: Register
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "childName": "John",
  "dateOfBirth": "2015-05-20",
  "mobileNumber": "9876543210",
  "password": "pass123"
}
```
Copy the returned `token` for next requests.

### Step 2: Create Item
```
POST http://localhost:3000/api/items/create
Headers: Authorization: Bearer <token>
Body (form-data):
  categoryId: 1
  itemName: Apple
  image: (select JPG file)
  voice: (select MP3 file)
```

### Step 3: Get Items by Category
```
GET http://localhost:3000/api/items/category/1
```

### Step 4: Get My Items
```
GET http://localhost:3000/api/items/my-items
Headers: Authorization: Bearer <token>
```

---

## Notes
- Token expires in 30 days
- Images stored in `uploads/images/`
- Voice files stored in `uploads/voice/`
- All timestamps in UTC
- Mobile number is unique identifier for login
