# Complete Backoffice Setup Guide

## Overview
This is a fully customizable backoffice system for the premium consulting firm website with:
- **Secure Authentication**: Email/password + 2FA (TOTP) support
- **Content Management**: Edit all text, images, and configurations per section
- **Form Builder**: Create dynamic forms with sequential dropdowns and conditional logic
- **Multi-language Support**: English (default), French, Spanish - fully editable dictionary
- **Site Settings**: Customize colors, fonts, accessibility options
- **Role-based Access**: Admin and Editor roles

## Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `DIRECT_URL`: Same as DATABASE_URL (for direct connections)
- `JWT_SECRET`: A secure random string (min 32 characters)
- SMTP settings for email notifications

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Create Initial Admin User
Start the development server:
```bash
npm run dev
```

Then make a POST request to create the first admin:
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@consultingfirm.com",
    "password": "YourSecurePassword123!",
    "enable2FA": true
  }'
```

If 2FA is enabled, scan the QR code returned in the response with your authenticator app.

### 5. Access the Backoffice
Navigate to: `http://localhost:3000/admin/login`

## Backoffice Features

### 1. Content Blocks Manager
- Manage all text content across all 8 sections
- Each block has: key (unique ID), section, type, JSON data, order
- Types: text, rich_text, image, video, config
- Toggle active/inactive status

### 2. Form Builder
- Create unlimited custom forms
- Field types: text, email, textarea, select, multiselect, checkbox, number, date
- Configure required fields, placeholders, help text
- Options for select/multiselect fields
- View submission counts
- Forms can be embedded anywhere using form ID

### 3. Translation Dictionary
- Manage translations for EN, FR, ES
- Add/edit/delete translation keys
- Bulk operations supported
- Use keys throughout the frontend for i18n

### 4. Site Settings
- Brand name
- Primary/accent colors (with color picker)
- Heading/body fonts
- Accessibility defaults (high contrast, reduced motion)
- Live preview of changes

## API Endpoints

### Authentication
- `POST /api/admin/auth` - Register new admin
- `PUT /api/admin/auth` - Login (returns JWT token)

### Content
- `GET /api/admin/content?section=hero` - Get content blocks
- `POST /api/admin/content` - Create content block
- `PUT /api/admin/content` - Update content block
- `DELETE /api/admin/content?id=xxx` - Delete content block

### Forms
- `GET /api/admin/forms` - Get all forms
- `POST /api/admin/forms` - Create form
- `PUT /api/admin/forms` - Update form
- `DELETE /api/admin/forms?id=xxx` - Delete form
- `GET /api/forms/submit?id=xxx` - Get public form config
- `POST /api/forms/submit` - Submit form (public)

### Translations
- `GET /api/admin/translations?language=EN` - Get translations
- `POST /api/admin/translations` - Create single translation
- `PUT /api/admin/translations` - Bulk update translations
- `DELETE /api/admin/translations?key=xxx&language=EN` - Delete translation

### Settings
- `GET /api/admin/settings` - Get site settings (public read)
- `PUT /api/admin/settings` - Update settings (requires auth)

## Security Features

1. **JWT Authentication**: All admin routes require valid Bearer token
2. **Password Hashing**: bcrypt with 12 rounds
3. **2FA Support**: TOTP-based two-factor authentication
4. **Rate Limiting**: Available via express-rate-limit middleware
5. **CORS Protection**: Configurable origins
6. **Helmet Headers**: Security HTTP headers

## Frontend Integration

### Using Translations
```tsx
// In your components
const { t, language, setLanguage } = useTranslation();

<h1>{t('hero_title')}</h1>
<button>{t('contact_button')}</button>

// Language switcher
<select value={language} onChange={(e) => setLanguage(e.target.value)}>
  <option value="EN">English</option>
  <option value="FR">Français</option>
  <option value="ES">Español</option>
</select>
```

### Using Dynamic Forms
```tsx
// Fetch form configuration
const form = await fetch(`/api/forms/submit?id=${formId}`).then(r => r.json());

// Render fields based on config
{form.fields.map(field => (
  <FormField key={field.id} field={field} />
))}

// Submit
await fetch('/api/forms/submit', {
  method: 'POST',
  body: JSON.stringify({ formId, formData })
});
```

### Using Content Blocks
```tsx
// Fetch content for a section
const content = await fetch(`/api/admin/content?section=hero`)
  .then(r => r.json());

// Render based on type
{content.contentBlocks.map(block => (
  <ContentRenderer key={block.id} block={block} />
))}
```

## Deployment

### Docker Setup
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Change JWT_SECRET to a secure random value
- [ ] Set up production database
- [ ] Configure SMTP for email notifications
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Create backup strategy for database

## Troubleshooting

### Database Connection Issues
Ensure PostgreSQL is running and credentials are correct:
```bash
psql -h localhost -U user -d consulting_db
```

### Prisma Client Errors
Regenerate the client:
```bash
npx prisma generate
```

### Authentication Issues
Clear localStorage and re-login:
```javascript
localStorage.removeItem('admin_token');
```

## Support
For issues or questions, check the logs in the console and review the API responses for error messages.
