# Imagen base de Node
FROM node:18

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos del backend
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto (ajusta si tu backend usa otro)
EXPOSE 3001

# Comando para iniciar el backend
CMD ["node", "server.js"]
