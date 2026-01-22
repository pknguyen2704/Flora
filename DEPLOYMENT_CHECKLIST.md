# Flora Production Deployment Checklist

Use this checklist when deploying Flora to production.

## Pre-Deployment

- [ ] Ubuntu server accessible via SSH
- [ ] Domain (flora.io.vn) purchased and accessible
- [ ] Gemini API key obtained
- [ ] Server has at least 2GB RAM, 20GB storage
- [ ] Root or sudo access available

## Phase 1: Server Setup (30 min)

- [ ] SSH into server
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Create flora user: `sudo adduser flora`
- [ ] Configure UFW firewall (SSH, HTTP, HTTPS)
- [ ] Install Node.js 20 LTS
- [ ] Install Python 3.11+
- [ ] Install MongoDB 6.0
- [ ] Install Nginx
- [ ] Install Certbot

## Phase 2: Database (15 min)

- [ ] Start MongoDB service
- [ ] Create admin user in MongoDB
- [ ] Create flora_user in flora_db
- [ ] Enable authentication in /etc/mongod.conf
- [ ] Restart MongoDB
- [ ] Test connection with credentials

## Phase 3: Backend (20 min)

- [ ] Clone/upload code to /opt/flora
- [ ] Create Python virtual environment
- [ ] Install requirements.txt
- [ ] Create .env file with production values
- [ ] Generate SECRET_KEY
- [ ] Create audio storage directories
- [ ] Seed database with reload_data.py
- [ ] Create systemd service file
- [ ] Enable and start flora-backend service
- [ ] Verify service status

## Phase 4: Frontend (15 min)

- [ ] Create .env.production file
- [ ] Install npm dependencies
- [ ] Build production bundle
- [ ] Deploy to /var/www/flora/dist
- [ ] Set correct permissions (www-data)

## Phase 5: Nginx (15 min)

- [ ] Create /etc/nginx/sites-available/flora
- [ ] Configure backend proxy to localhost:8000
- [ ] Configure frontend serving
- [ ] Configure audio file serving
- [ ] Enable site (symlink to sites-enabled)
- [ ] Test configuration: `sudo nginx -t`
- [ ] Reload nginx

## Phase 6: DNS & SSL (30 min)

- [ ] Add A record in domain registrar
- [ ] Point flora.io.vn to server IP
- [ ] Optional: Add www subdomain
- [ ] Wait for DNS propagation (5-15 min)
- [ ] Verify DNS: `nslookup flora.io.vn`
- [ ] Run Certbot: `sudo certbot --nginx`
- [ ] Enter email and agree to terms
- [ ] Choose to redirect HTTP to HTTPS
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`

## Phase 7: Testing (15 min)

- [ ] Visit https://flora.io.vn
- [ ] Verify HTTPS (lock icon in browser)
- [ ] Test login (admin/admin123)
- [ ] Test student account
- [ ] Test pronunciation practice
- [ ] Test quiz functionality
- [ ] Test admin panel
- [ ] Test from mobile device
- [ ] Check browser console for errors

## Post-Deployment

- [ ] Set up daily database backups (cron)
- [ ] Configure monitoring/alerts (optional)
- [ ] Document admin credentials securely
- [ ] Share access with team
- [ ] Create runbook for common issues

## Maintenance Tasks

### Daily
- [ ] Check service status
- [ ] Monitor disk space

### Weekly  
- [ ] Review error logs
- [ ] Check backup completion

### Monthly
- [ ] Update system packages
- [ ] Review security updates
- [ ] Test backup restoration

---

## Quick Commands Reference

```bash
# Check all services
sudo systemctl status mongod flora-backend nginx

# View backend logs
sudo journalctl -u flora-backend -f

# Restart backend
sudo systemctl restart flora-backend

# Update frontend
cd /opt/flora/Flora-fe && npm run build && sudo cp -r dist/* /var/www/flora/dist/

# Backup database
mongodump --uri="mongodb://flora_user:PASSWORD@localhost:27017/flora_db" --out=/opt/flora/backups/$(date +%Y%m%d)

# Check SSL certificate
sudo certbot certificates

# Renew SSL
sudo certbot renew
```
