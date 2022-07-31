FROM node:17-alpine AS build

WORKDIR /home/node

COPY ./package.json ./package-lock.json ./tsconfig.json /home/node/
RUN npm install
COPY ./src/ /home/node/src/
RUN npm run build
COPY ./bin/ /home/node/bin/

ENV NODE_ENV=production
RUN npm clean-install

FROM scratch

ENV NODE_ENV=production

COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/group /etc/group
COPY --from=build /usr/local/bin/node /usr/local/bin/node

COPY --from=build --chown=root:node /home/node/dist /home/node/dist
COPY --from=build --chown=root:node /home/node/bin /home/node/bin
COPY --from=build --chown=root:node /home/node/package.json /home/node/package-lock.json /home/node/
COPY --from=build --chown=root:node /home/node/node_modules /home/node/node_modules

USER node

CMD ["--guild-limit", "3", "--channel-limit", "3", "--support", "https://discord.gg/CUefWnZ", "--tick-count", "120", "--tick-time", "2000"]
ENTRYPOINT [ "node", "--title", "discord-gamestatus", "/home/node/bin/discord-gamestatus", "--" ]
