FROM node:8.7.0-alpine
RUN apk add --update curl && \
    rm -rf /var/cache/apk/*
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl -f http://localhost:${PORT}/healthz || exit

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /server
COPY . /server
RUN cd /server
RUN yarn install
CMD [ "node", "app.js" ]
