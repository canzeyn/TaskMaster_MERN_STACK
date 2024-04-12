FROM node:21-alpine
WORKDIR /app
COPY ./package.json ./
COPY  ./dist /app/
RUN npm install
EXPOSE 5173
CMD ["npm", "run" , "dev"]
