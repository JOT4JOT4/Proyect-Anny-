# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de ejecución con servidor Nginx
FROM nginx:alpine

# Copiar archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
