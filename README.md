# KidsLearn Backend API

A backend API for a children's learning app that helps kids learn English words through images and audio pronunciation.

## Features

- **Categories**: Organize learning content (Animals, Fruits, Family Members, Colors, etc.)
- **Learning Images**: Upload images associated with categories
- **Pronunciations**: Add text-to-speech or pre-recorded audio for each word
- **Default Content**: Pre-seeded default categories and images
- **File Uploads**: Support for image and audio file uploads
- **RESTful API**: Easy-to-use REST endpoints for all operations

## Tech Stack

- **Node.js** + **Express.js** - Backend framework
- **Sequelize** - ORM for database management
- **MySQL** - Database (configured via environment variables)
- **Multer** - File upload handling

## Project Structure

```
kidsLearn/
├── config/           # Database configuration
├── controllers/      # Business logic
│   ├── category.controller.js
│   ├── image.controller.js
│   └── pronunciation.controller.js
├── enums/            # Status codes and messages
├── middlewares/      # Custom middleware
├── model/            # Sequelize models
├── routes/           # API endpoints
├── seeders/          # Default data seeding
├── uploads/          # Uploaded files storage
├── app.js            # Express app setup
└── package.json      # Dependencies
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (`.env`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kidslearn
DIALECT=mysql
APP_PORT=3000
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories with images
- `GET /api/categories/:id` - Get category with all images and pronunciations
- `POST /api/categories` - Create new category
  - Body: `{ "name": "Sports", "description": "Sports items" }`
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Images
- `GET /api/images/category/:categoryId` - Get all images in a category
- `GET /api/images/:id` - Get single image with pronunciations
- `POST /api/images` - Upload new image
  - Form-data:
    - `categoryId` (required): Category ID
    - `name` (required): Image name (e.g., "Apple")
    - `description` (optional): Image description
    - `image` (required): Image file
- `PUT /api/images/:id` - Update image
- `DELETE /api/images/:id` - Delete image

### Pronunciations
- `GET /api/pronunciations/:imageId` - Get pronunciations for an image
- `POST /api/pronunciations` - Create pronunciation
  - Form-data or JSON:
    - `imageId` (required): Image ID
    - `text` (required): Word to pronounce
    - `language` (optional): Language code (default: "en")
    - `audio` (optional): Audio file for pre-recorded pronunciation
- `PUT /api/pronunciations/:id` - Update pronunciation
- `DELETE /api/pronunciations/:id` - Delete pronunciation

## Default Seeded Data

The app automatically seeds default data on first run:

**Categories:**
- Animals (Cat, Dog, Bird, Fish)
- Fruits (Apple, Banana, Orange)
- Family Members (Mother, Father, Sister, Brother)
- Colors (Red, Blue, Green)

Each item includes a pronunciation record with the English word.

## Response Format

All API responses follow this format:

**Success Response (200):**
```json
{
  "status": 200,
  "success": true,
  "message": "Fetched successfully",
  "data": { ... }
}
```

**Error Response (4xx/5xx):**
```json
{
  "status": 400,
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## How to Use (Client-Side Flow)

1. **Fetch all categories:**
   ```
   GET /api/categories
   ```
   Response shows all categories with image count

2. **Get images for a category:**
   ```
   GET /api/categories/:categoryId
   ```
   Shows all images and pronunciations in that category

3. **Trigger pronunciation (on button click):**
   - Fetch pronunciation from `GET /api/pronunciations/:imageId`
   - If `audioUrl` exists, play the audio file
   - If no audio, use browser Text-to-Speech API with the `text` field

4. **Add custom category:**
   ```
   POST /api/categories
   Body: { "name": "Vehicles", "description": "Learn vehicle names" }
   ```

5. **Upload image to category:**
   ```
   POST /api/images
   Form-data:
     - categoryId: 1
     - name: "Car"
     - image: <file>
   ```

6. **Add pronunciation for image:**
   ```
   POST /api/pronunciations
   Body:
     - imageId: 5
     - text: "Car"
     - language: "en"
   ```

## Frontend Integration Tips

### Text-to-Speech (if no audio file):
```javascript
// Use browser Web Speech API
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';
window.speechSynthesis.speak(utterance);
```

### Displaying Images:
```javascript
// Images are served from /uploads/learning-images/
const imageUrl = `http://localhost:3000${image.imagePath}`;
```

### Playing Audio:
```javascript
// If pronunciation has audioUrl:
const audio = new Audio(`http://localhost:3000${pronunciation.audioUrl}`);
audio.play();
```

## Future Enhancements

- [ ] User progress tracking
- [ ] Quiz/assessment system
- [ ] Multi-language support
- [ ] Leaderboard
- [ ] Parent dashboard
- [ ] Spaced repetition algorithm
- [ ] Integration with text-to-speech API (Google Cloud TTS, AWS Polly, etc.)
- [ ] Mobile app (React Native/Flutter)

## License

ISC

---

**Note:** For production deployment, ensure:
- Use a production database (managed MySQL service)
- Enable CORS for frontend domain
- Add authentication/authorization
- Use environment-based configuration
- Set up proper logging and monitoring
- Configure CDN for static files
