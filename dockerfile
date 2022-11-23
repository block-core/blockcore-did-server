FROM node:18.12.1-bullseye-slim@sha256:b9c3c98eb7cf4a45daceac4cb12880f4529889f6f39a59edc0661aea0bb0880b

RUN apt-get update && apt-get install -y --no-install-recommends --no-install-suggests dumb-init
ENV NODE_ENV production
ARG VERSION

WORKDIR /host

COPY --chown=node:node . /host
#RUN curl -Ls https://github.com/block-core/blockcore-did-server/releases/download/$VERSION/blockcore-did-server-$VERSION.tgz \
#    | tar -xvz -C . --strip-components=1
#RUN chown -R node:node /host
RUN npm ci --omit=dev

USER node
CMD ["dumb-init", "node", "--es-module-specifier-resolution=node", "dist/host.js"]
EXPOSE 4250
