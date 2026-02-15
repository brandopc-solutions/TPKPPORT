# TPK Parent Portal

A Next.js web application for Tamizh Palikoodam language school. Parents log in via email OTP and can view/edit family and student data stored in SharePoint Lists.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Auth**: Email OTP (6-digit PIN) with JWT sessions
- **Data**: SharePoint Lists via Microsoft Graph API
- **Email**: Microsoft Graph Mail API
- **Deployment**: Docker + nginx on Vultr VPS

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

Create a `.env.local` file with:

```env
# SharePoint / Azure AD
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
SHAREPOINT_SITE_ID=
FAMILY_LIST_ID=
STUDENTS_LIST_ID=

# Auth
JWT_SECRET=
ADMIN_EMAILS=bharani@tamizhoallikoodam.org.au

# Email (Microsoft Graph)
FROM_EMAIL=info@tamizhoallikoodam.org.au

# App
NEXT_PUBLIC_APP_URL=https://portal.tamizhpallikoodam.org.au
```

---

## Vultr VPS Setup (Spin Up)

### 1. Create the Server

1. Log in to https://my.vultr.com/
2. Deploy a new server:
   - **Type**: Cloud Compute (Shared CPU)
   - **Location**: Sydney
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: 1 vCPU / 1GB RAM / 25GB SSD ($6/month)
3. Add your SSH key
4. Note the server IP address

### 2. Point Your Domain

Add a DNS A record:
```
Type: A
Name: portal
Value: <server-ip>
```

### 3. SSH into the Server

```bash
ssh root@<server-ip>
```

### 4. Install Dependencies

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin nginx certbot python3-certbot-nginx -y
```

### 5. Open Firewall Ports

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

### 6. Upload the Project

```bash
cd /opt
git clone <your-repo-url> tpkpport
cd tpkpport
```

### 7. Create Environment File on Server

```bash
nano /opt/tpkpport/.env.local
```

Paste all the environment variables (see section above). Save and exit.

### 8. Build and Start the App

```bash
cd /opt/tpkpport
docker compose up -d --build
```

Verify it's running:
```bash
docker compose ps
curl http://localhost:3000
```

### 9. Configure Nginx

```bash
cat > /etc/nginx/sites-available/tpkpport << 'EOF'
server {
    listen 80;
    server_name portal.yourschool.com _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/tpkpport /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

Replace `portal.yourschool.com` with your actual domain.

### 10. Install SSL Certificate

Wait for DNS to propagate, then:
```bash
certbot --nginx -d portal.tamizhpallikoodam.org.au
```

Certbot auto-renews via systemd timer. Verify with:
```bash
systemctl status certbot.timer
certbot renew --dry-run
```

### 11. Done

Your portal is live at `https://portal.tamizhpallikoodam.org.au`

---

## Vultr VPS Teardown (Pull Down)

When the portal is no longer needed, follow these steps to save costs.

### Option A: Destroy the Server (Cheapest — $0/month)

This completely removes the server. You'll need to redo the full setup next time.

1. **Stop the app**:
   ```bash
   ssh root@<server-ip>
   cd /opt/tpkpport
   docker compose down
   ```

2. **Remove DNS record**: Delete the A record for `portal` from your DNS provider

3. **Destroy the server**: Go to Vultr Dashboard → select the server → **Settings** → **Destroy** → confirm

4. **Keep your code safe**: Make sure your code is pushed to Git (the `.env.local` is NOT in git — save it somewhere secure like a password manager)

### Option B: Stop the App but Keep the Server ($6/month continues)

Use this if you want to bring it back quickly without full setup.

```bash
ssh root@<server-ip>
cd /opt/tpkpport
docker compose down
systemctl stop nginx
```

To bring it back:
```bash
cd /opt/tpkpport
docker compose up -d
systemctl start nginx
```

### Option C: Snapshot and Destroy ($0.05/GB/month for snapshot)

Save a snapshot to restore later without full setup.

1. **Stop the app**:
   ```bash
   ssh root@<server-ip>
   cd /opt/tpkpport
   docker compose down
   ```

2. **Take a snapshot**: Vultr Dashboard → select server → **Snapshots** → **Take Snapshot**

3. **Wait for snapshot to complete**, then **Destroy** the server

4. **To restore later**: Deploy a new server → choose **Snapshot** as the OS → select your snapshot → it boots with everything ready

5. **After restore, update DNS** to point to the new server IP, then:
   ```bash
   cd /opt/tpkpport
   docker compose up -d
   systemctl start nginx
   # Re-run certbot if IP changed
   certbot --nginx -d portal.yourschool.com
   ```

---

## Useful Commands

| Task | Command |
|------|---------|
| View app logs | `docker compose logs -f` |
| Restart app | `docker compose restart` |
| Stop app | `docker compose down` |
| Start app | `docker compose up -d` |
| Rebuild after code changes | `git pull && docker compose up -d --build` |
| Check nginx status | `systemctl status nginx` |
| Check SSL renewal | `certbot renew --dry-run` |
| Check container status | `docker compose ps` |

---

## Updating the App

After making code changes locally:

```bash
# Push changes from your local machine
git add .
git commit -m "Your changes"
git push

# On the Vultr server
ssh root@<server-ip>
cd /opt/tpkpport
git pull
docker compose up -d --build
```
