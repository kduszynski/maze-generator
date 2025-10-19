# Maze Generator

A modern web-based application for generating perfect, printable 2D mazes with varying difficulty levels. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI.

## 🎯 Features

- **Perfect Maze Generation**: Uses the Recursive Backtracker algorithm to create mazes with exactly one solution path
- **5 Difficulty Levels**:
  - Very Easy (10×10)
  - Easy (15×15)
  - Medium (25×25)
  - Hard (40×40)
  - Very Hard (60×60)
- **Visual Start/End Markers**: Green circle for start, red circle for end
- **Print-Optimized**: Clean black and white output perfect for printing
- **Modern UI**: Beautiful, responsive design using Shadcn UI components
- **Fast Generation**: All mazes generate in under 5 seconds (typically <5ms)

## 🛠 Tech Stack

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Runtime**: Node.js

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager

## 🚀 Local Development Setup

1. **Clone the repository** (or navigate to the project directory):

```bash
cd /path/to/maze
```

2. **Install dependencies**:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

5. **Start generating mazes**:
   - Select a difficulty level
   - Click "Generate Maze"
   - Use "Print Maze" to print your creation

## 🏗 Building for Production

### Create Production Build

```bash
npm run build
```

This command:
- Compiles TypeScript
- Optimizes assets
- Generates static pages where possible
- Creates an optimized production build in `.next` directory

### Test Production Build Locally

```bash
npm run build
npm start
```

The production server will start on `http://localhost:3000`.

## 🌐 Deploying to VPS

### Option 1: Using PM2 (Recommended)

1. **Install PM2 on your VPS**:

```bash
npm install -g pm2
```

2. **Transfer your project to the VPS**:

```bash
# Using rsync
rsync -avz --exclude 'node_modules' --exclude '.next' ./ user@your-vps-ip:/path/to/maze

# Or using git
ssh user@your-vps-ip
cd /path/to/maze
git pull origin main
```

3. **Install dependencies on VPS**:

```bash
ssh user@your-vps-ip
cd /path/to/maze
npm install
```

4. **Build the application**:

```bash
npm run build
```

5. **Start with PM2 (default port 3000)**:

```bash
pm2 start npm --name "maze-generator" -- start
pm2 save
pm2 startup
```

**To run on a custom port (e.g., port 3005)**, use one of these methods:

**Method 1: Using environment variable with PM2**

```bash
PORT=3005 pm2 start npm --name "maze-generator" -- start
pm2 save
pm2 startup
```

**Method 2: Using PM2 ecosystem file (recommended for multiple configs)**

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'maze-generator',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3005
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
```

Then start with:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Method 3: Using package.json script**

Add a custom start script in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "start:3005": "next start -p 3005"
  }
}
```

Then start with PM2:

```bash
pm2 start npm --name "maze-generator" -- run start:3005
pm2 save
pm2 startup
```

6. **Configure DNS for subdomain**:

Before configuring Nginx, set up a DNS A record:

```
Type: A
Name: xyz (or your chosen subdomain)
Value: your-vps-ip-address
TTL: 3600 (or auto)
```

This creates `xyz.domain.com` pointing to your VPS.

7. **Configure Nginx as reverse proxy** (create `/etc/nginx/sites-available/maze`):

> **Note**: If you configured your app to run on port 3005, change `proxy_pass http://localhost:3000;` to `proxy_pass http://localhost:3005;` in all location blocks below.

```nginx
server {
    listen 80;
    server_name xyz.domain.com;

    # Logging
    access_log /var/log/nginx/maze_access.log;
    error_log /var/log/nginx/maze_error.log;

    # Proxy settings for Next.js app
    location / {
        proxy_pass http://localhost:3000;  # Change to 3005 if using custom port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for maze generation
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Optional: Serve static files directly (for optimization)
    location /_next/static {
        proxy_pass http://localhost:3000;  # Change to 3005 if using custom port
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

8. **Enable the site and restart Nginx**:

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/maze /etc/nginx/sites-enabled/

# Test Nginx configuration for syntax errors
sudo nginx -t

# If test is successful, restart Nginx
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt** (recommended for production):

```bash
# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain and install SSL certificate for your subdomain
sudo certbot --nginx -d xyz.domain.com

# Certbot will automatically:
# - Obtain the SSL certificate
# - Update Nginx configuration
# - Set up auto-renewal

# Test automatic renewal
sudo certbot renew --dry-run
```

After SSL is configured, your Nginx config will be automatically updated to (remember to use port 3005 if you configured it):

```nginx
server {
    server_name xyz.domain.com;

    access_log /var/log/nginx/maze_access.log;
    error_log /var/log/nginx/maze_error.log;

    location / {
        proxy_pass http://localhost:3000;  # Change to 3005 if using custom port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;  # Change to 3005 if using custom port
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/xyz.domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xyz.domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = xyz.domain.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name xyz.domain.com;
    return 404;
}
```

10. **Verify PM2 is running and check the application**:

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs maze-generator

# Check which port the app is running on
pm2 env maze-generator | grep PORT

# Restart if needed
pm2 restart maze-generator

# Ensure PM2 starts on system boot
pm2 startup
pm2 save
```

**Verify the app is listening on the correct port:**

```bash
# Check if the app is listening on port 3005 (or 3000)
sudo netstat -tlnp | grep :3005
# or
sudo lsof -i :3005
```

11. **Test your subdomain**:

```bash
# Test HTTP (should redirect to HTTPS after SSL setup)
curl -I http://xyz.domain.com

# Test HTTPS
curl -I https://xyz.domain.com

# Test directly on the server (useful for debugging)
curl http://localhost:3005  # Change to your configured port
```

Your application should now be accessible at `https://xyz.domain.com`!

### Quick Reference: Port Configuration Summary

| Method | Command | Configuration File |
|--------|---------|-------------------|
| Environment Variable | `PORT=3005 pm2 start npm --name "maze-generator" -- start` | None |
| PM2 Ecosystem | `pm2 start ecosystem.config.js` | `ecosystem.config.js` |
| Package.json Script | `pm2 start npm --name "maze-generator" -- run start:3005` | `package.json` |

**Don't forget**: After changing the port, update all `proxy_pass` directives in your Nginx configuration from `http://localhost:3000` to `http://localhost:3005`.

### Option 2: Using Docker

1. **Create `Dockerfile` in project root**:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Update `next.config.ts` for standalone output**:

```typescript
const nextConfig = {
  output: 'standalone',
};
```

3. **Build and run Docker container**:

```bash
docker build -t maze-generator .
docker run -p 3000:3000 maze-generator
```

### Option 3: Using Vercel (Easiest)

1. **Install Vercel CLI**:

```bash
npm install -g vercel
```

2. **Deploy**:

```bash
vercel
```

Follow the prompts to complete deployment.

## 📁 Project Structure

```
maze/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles + print styles
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── difficulty-selector.tsx
│   │   └── maze-canvas.tsx
│   └── lib/
│       ├── maze-generator.ts   # Core maze algorithm
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── .ai/                        # Project documentation
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🧪 Algorithm Details

The maze generator uses the **Recursive Backtracker algorithm**, a depth-first search (DFS) approach:

1. Initialize a grid with all walls closed
2. Start from a random cell and mark it as visited
3. Randomly choose an unvisited neighbor
4. Remove the wall between current cell and chosen neighbor
5. Recursively repeat from the neighbor
6. Backtrack when no unvisited neighbors remain

This creates a "perfect maze" with exactly one path between any two points—no loops or isolated sections.

## 🎨 UI Components

- **Button**: Primary action buttons for generating and printing
- **Card**: Container components for clean layout structure
- **RadioGroup**: Difficulty level selection
- **Label**: Form field labels

## 📝 Environment Variables

No environment variables are required for basic operation. The application runs entirely client-side after initial page load.

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is occupied:

```bash
PORT=3001 npm run dev
```

### Build Errors

Clear the build cache:

```bash
rm -rf .next
npm run build
```

### Node Version Issues

Ensure you're using Node.js 18 or higher:

```bash
node --version
```

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For questions or issues, please open an issue in the repository.
