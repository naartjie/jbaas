FROM mhart/alpine-node:6.0

WORKDIR /src
ADD . .

EXPOSE 3000
CMD ["npm", "start"]