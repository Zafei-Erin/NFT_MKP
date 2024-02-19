FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN  cp -r node_modules/zod node_modules/@types 

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]