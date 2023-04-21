FROM node:16.20.0

WORKDIR /home/app

COPY . /home/app

EXPOSE 3030

CMD [ "tail", "-f", "/dev/null" ]