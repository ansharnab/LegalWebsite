# Legal Advisor Site

Professional legal services website with a visual page builder (same workflow as MaatriDev).

## Quick start

```bash
npm install
npm run media   # downloads hero, practice & portrait images into public/images
npm run dev
```

- Public site: http://localhost:5173
- Admin builder: http://localhost:5173/admin
- Default password: `legaladvisor2026` (set `ADMIN_PASSWORD` in `.env`)

## Production

```bash
npm run production
```

Serves the built site and API on http://localhost:3001

If you see **Port 3001 is already in use**, another dev server is still running. Either:

```bash
npm run stop
npm run production
```

Or use one command:

```bash
npm run production:fresh
```

Do not run `npm run dev` and `npm run production` at the same time — both need port 3001.

## Page builder

1. Sign in at `/admin`
2. Use **Page Builder** to drag sections, edit inline, and preview desktop/tablet/mobile
3. Toggle **Use custom page (publish)** and click **Publish** to go live
4. Use **Site Content** for practice areas, testimonials, contact info, and disclaimer text
