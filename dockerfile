FROM node:18.12.1-bullseye-slim@sha256:b9c3c98eb7cf4a45daceac4cb12880f4529889f6f39a59edc0661aea0bb0880b

RUN apt-get update && apt-get install -y --no-install-recommends --no-install-suggests dumb-init
ENV NODE_ENV production

WORKDIR /host
COPY --chown=node:node . /host
RUN npm ci --omit=dev

USER node
CMD ["dumb-init", "node", "--es-module-specifier-resolution=node", "dist/host.js"]
EXPOSE 4250