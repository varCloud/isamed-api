# 🔐 Configuración Segura de Producción

## ⚠️ IMPORTANTE - Antes de desplegar

### 1. Variables de Entorno Sensibles
**NUNCA** incluir en el repositorio:
- Claves JWT reales
- Credenciales de base de datos
- URLs con credenciales
- Secrets de terceros

### 2. Archivos a Configurar en Producción

#### `.env` (crear en servidor)
```bash
# Base de datos - USAR CREDENCIALES REALES
DATABASE_URL="postgresql://prod_user:SECURE_PASSWORD@prod_host:5432/prod_db"

# JWT - GENERAR CLAVES ÚNICAS Y SEGURAS
JWT_SECRET="GENERAR_CLAVE_256_BITS_AQUI"
JWT_REFRESH_SECRET="GENERAR_OTRA_CLAVE_256_BITS_AQUI"

# Servidor
APP_URL=https://tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
NODE_ENV=production
DEV_MODE=false
USE_API_PREFIX=false

# Otros
PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
```

#### `docker-compose.yml` (crear en servidor)
Copiar desde `docker-compose.example.yml` y ajustar:
- Credenciales de PostgreSQL
- Variables de entorno
- Configuración de red/puertos

### 3. Generar Secrets Seguros

#### JWT Secrets
```bash
# Generar claves seguras
openssl rand -base64 32
# O usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Checklist de Seguridad

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ JWT secrets únicos generados
- [ ] ✅ Credenciales de BD seguras
- [ ] ✅ HTTPS configurado
- [ ] ✅ Firewall configurado
- [ ] ✅ `.env` no está en repositorio
- [ ] ✅ Docker compose con credenciales reales

### 5. Desarrollo vs Producción

| Archivo | Desarrollo | Producción |
|---------|------------|------------|
| `.env` | Local, gitignored | Servidor, secreto |
| `docker-compose.yml` | Local, gitignored | Servidor, secreto |
| Credenciales | De prueba | Reales y seguras |
| Dominios | localhost | Dominio real |

**🔒 Regla de oro: Si contiene passwords, API keys o secrets → NO va al repositorio**