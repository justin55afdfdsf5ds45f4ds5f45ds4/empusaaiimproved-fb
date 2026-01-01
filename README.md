# Empusa AI Landing Page

CMP (Context Memory Protocol) landing page built with React + Vite + Tailwind CSS.

## Live Site

- **Main site**: https://empusaai.com
- **Panda subsite**: https://empusaai.com/panda

## Project Structure

```
empusaai-landing/
├── src/                    # React app source (CMP landing page)
│   ├── components/         # React components
│   └── pages/              # Page components (Download page)
├── public/
│   ├── panda/              # SEPARATE: Hit and Run Panda website (static HTML)
│   │   ├── index.html      # Panda landing page
│   │   ├── downloads/      # Panda app downloads (Mac/Windows)
│   │   └── payment/        # Panda payment success page
│   ├── CMP.zip             # CMP download file
│   └── emoji.png           # Assets
└── index.html              # Main entry point
```

## Important Notes

### Panda Subsite (`/panda`)

The `/panda` route is a **completely separate static website** nested inside the `public/panda/` folder. It is:

- **NOT** part of the React app
- Served as static HTML files by Vite/Vercel
- Has its own `index.html`, assets, and download files
- Source repo: https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/panda.git

To update the Panda site, copy the contents of the `website/` folder from the panda repo into `public/panda/`.

### CMP Landing Page

The main React app handles:
- `/` - CMP landing page
- `/payment/[secret-path]` - CMP download page (after purchase)

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel. Push to `main` branch triggers auto-deploy.
