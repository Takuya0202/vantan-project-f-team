FROM node:22-slim
WORKDIR /workdir
COPY . .
WORKDIR /workdir/src
RUN npm install
CMD ["npm", "run", "dev"]
