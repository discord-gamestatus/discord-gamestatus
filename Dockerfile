FROM node:17

ENV NODE_ENV=production

RUN useradd -m discord-gamestatus
WORKDIR /home/discord-gamestatus

COPY ./package.json ./package-lock.json /home/discord-gamestatus/
COPY ./dist/ /home/discord-gamestatus/dist/
COPY ./bin/ /home/discord-gamestatus/bin/

RUN npm install

RUN chown -R root:discord-gamestatus /home/discord-gamestatus && \
  chmod -R 550 /home/discord-gamestatus

USER discord-gamestatus
CMD ["--guild-limit", "3", "--channel-limit", "3", "--support", "https://discord.gg/CUefWnZ", "--tick-count", "120", "--tick-time", "2000"]
ENTRYPOINT [ "node", "--title", "discord-gamestatus", "/home/discord-gamestatus/bin/discord-gamestatus", "--" ]
