FROM node:16.20.0-slim

WORKDIR /home/app

COPY . /home/app

USER node

CMD [ "tail", "-f" , "/dev/null" ]