FROM node:16.19

# [MYSTERY] if WORKDIR /app, don't work
WORKDIR /work
COPY . /work
RUN npm i

EXPOSE 5173
ENTRYPOINT ["npm", "run", "start"]
