FROM node:17

ENV NODE_ENV=production

WORKDIR /home/node

COPY ./package.json ./package-lock.json /home/node/
RUN npm install

COPY ./dist/ /home/node/dist/
COPY ./bin/ /home/node/bin/

RUN chown -R root:node /home/node

CMD ["--guild-limit", "3", "--channel-limit", "3", "--support", "https://discord.gg/CUefWnZ", "--tick-count", "120", "--tick-time", "2000"]
ENTRYPOINT [ "node", "--title", "discord-gamestatus", "/home/node/bin/discord-gamestatus", "--" ]
