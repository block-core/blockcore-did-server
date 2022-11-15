FROM node:18-alpine3.16

WORKDIR /host

COPY package.json tsconfig.json ./
COPY src ./src

# Required for Mac (M1) support:
RUN apk add --update python3 make g++
RUN npm install --build-from-source
RUN npm run build

CMD ["node", "--es-module-specifier-resolution=node", "dist/host.js"]
EXPOSE 3000