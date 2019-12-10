FROM node:11-alpine

LABEL maintainer="Anthony Loukinas <anthony.loukinas@redhat.com>"

# Assuming we are running Docker only in production
ENV NODE_ENV=production

# Create and enter /app
WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Setting TZ
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk add --no-cache --virtual .gyp python make g++ && \
    rm -rf /var/cache/apk/* && \
    npm -g install webpack webpack-cli && \
    npm install && \
    apk del .gyp

# Copy source code
COPY . .

# Compile assets
# RUN webpack

# Expose port 3001 to Docker
EXPOSE 3000

CMD ["npm", "start"]