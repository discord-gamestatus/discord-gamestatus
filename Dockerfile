FROM node:18-alpine AS build

USER root
WORKDIR /home/node

COPY ./package.json ./package-lock.json ./tsconfig.json /home/node/
RUN npm install
COPY ./src/ /home/node/src/
RUN chmod 644 tsconfig.json && find src -type f -print0 | xargs -0 chmod 644
RUN npm run build
COPY ./bin/ /home/node/bin/

ENV NODE_ENV=production
RUN npm clean-install

FROM rust:1.66-alpine AS build-scheduler

USER root

RUN apk add musl-dev

WORKDIR /usr/src/scheduler
COPY ./scheduler .

RUN cargo build --release

FROM scratch

ENV NODE_ENV=production

COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/group /etc/group
COPY --from=build /usr/local/bin/node /usr/local/bin/node
COPY --from=build /usr/lib/libstdc++.so.6 /usr/lib/libstdc++.so.6
COPY --from=build /usr/lib/libgcc_s.so.1 /usr/lib/libgcc_s.so.1
COPY --from=build /lib/ld-musl-x86_64.so.1 /lib/ld-musl-x86_64.so.1
COPY --from=build --chown=root:node /bin/sh /bin/sh

COPY --from=build-scheduler --chown=root:node /usr/src/scheduler/target/release/gamestatus-scheduler /usr/local/bin/gamestatus-scheduler

COPY --chown=root:node ./scripts/start.sh /opt/start.sh

COPY --from=build --chown=root:node /home/node/dist /home/node/dist
COPY --from=build --chown=root:node /home/node/bin /home/node/bin
COPY --from=build --chown=root:node /home/node/package.json /home/node/package-lock.json /home/node/
COPY --from=build --chown=root:node /home/node/node_modules /home/node/node_modules

USER node

WORKDIR /home/node

CMD ["--guild-limit", "3", "--channel-limit", "3", "--support", "https://discord.gg/CUefWnZ", "--tick-count", "120", "--tick-time", "2000"]
ENTRYPOINT [ "/opt/start.sh" ]
