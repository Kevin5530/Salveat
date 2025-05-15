# Imagen oficial de Node.js
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias (con package-lock.json)
COPY package.json ./

# COPY package-lock.json ./

# Instalar dependencias en Linux, compilando bcrypt desde cero
RUN npm install --build-from-source

# Copiar el resto del backend
COPY . .

# Exponer el puerto de tu servidor
EXPOSE 3001

# Comando para arrancar
CMD ["node", "server.js"]
