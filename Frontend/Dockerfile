# Imagen base
FROM node:18

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos del frontend
COPY . .

# Instalar dependencias y construir la app
RUN npm install && npm run build

# Instalar servidor estático
RUN npm install -g serve

# Exponer el puerto
EXPOSE 3000

# Comando para servir la app
CMD ["serve", "-s", "build", "-l", "3000"]
