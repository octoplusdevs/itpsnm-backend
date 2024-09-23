# Use a imagem oficial do Node.js como base
FROM node:18

# Definir o diretório de trabalho na imagem
WORKDIR /app

# Copiar o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install --production

# Copiar todo o restante do código para o diretório de trabalho
COPY . .

# Expôr a porta que sua API está usando
EXPOSE 3000

# Definir o comando para iniciar a aplicação
CMD ["npm", "start:dev"]
