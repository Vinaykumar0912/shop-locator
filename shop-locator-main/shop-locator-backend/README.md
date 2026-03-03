# Shop Locator - Backend (Express + PostgreSQL + Cloudinary)

This backend is a conversion of your Supabase backend to a common mini-project stack:
- Node.js + Express
- PostgreSQL (no Supabase-only features)
- JWT auth
- Cloudinary for image uploads

## Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Apply `sql/schema.sql` to your Postgres database.
3. Run `npm install`.
4. Start server: `npm run dev` (requires nodemon) or `npm start`.

## Endpoints
- `POST /api/auth/register` — register (body: email, password, full_name)
- `POST /api/auth/login` — login (body: email, password)
- `GET /api/shops` — list shops (public)
- `POST /api/shops` — create shop (auth)
- `PUT /api/shops/:id` — update shop (owner)
- `DELETE /api/shops/:id` — delete shop (owner)
- `GET /api/items` — list items (public)
- `POST /api/items` — create item (owner only)
- `PUT /api/items/:id` — update item (owner only)
- `DELETE /api/items/:id` — delete item (owner only)
- `POST /api/items/upload` — upload image (auth, multipart/form-data file field 'image')
