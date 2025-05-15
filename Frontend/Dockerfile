# Imagen base
FROM node:18

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos del frontend
COPY . .

# Instalar dependencias y construir la app
RUN npm install && npm run build

# Instalar servidor estático para servir React
RUN npm install -g serve

# Exponer puerto
EXPOSE 3000

# Servir la app construida
CMD ["serve", "-s", "build", "-l", "3000"]
