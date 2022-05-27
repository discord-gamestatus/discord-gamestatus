FROM node:17-alpine

ENV NODE_ENV=production

WORKDIR /home/node

COPY --chown=root:node ./package.json ./package-lock.json /home/node/
RUN npm install
COPY --chown=root:node ./dist/ /home/node/dist/
COPY --chown=root:node ./bin/ /home/node/bin/

USER node

CMD ["--guild-limit", "3", "--channel-limit", "3", "--support", "https://discord.gg/CUefWnZ", "--tick-count", "120", "--tick-time", "2000"]
ENTRYPOINT [ "node", "--title", "discord-gamestatus", "/home/node/bin/discord-gamestatus", "--" ]
