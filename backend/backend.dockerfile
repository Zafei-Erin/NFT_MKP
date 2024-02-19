FROM node:20

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

RUN  cp -r node_modules/zod node_modules/@types 

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]