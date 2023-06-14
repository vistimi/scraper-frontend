ARG NODE_ALPINE_VARIANT=node:18.8.0-alpine
ARG VARIANT=alpine:3.16

#------------------
#    BUILDER
#------------------
FROM $NODE_ALPINE_VARIANT AS builder

# nodejs npm
RUN apk add --update --no-cache libc6-compat

WORKDIR /usr/tmp

COPY . ./
RUN npm ci
RUN npm run build

#------------------
#    runner
#------------------
FROM $NODE_ALPINE_VARIANT AS runner

# nodejs npm
RUN apk add --update --no-cache shadow sudo 

# ARG USERNAME=user
# ARG USER_UID=1001
# ARG USER_GID=$USER_UID
# RUN addgroup --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
# # Add sudo support. Omit if you don't need to install software after connecting.
# # && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
# # && chmod 0440 /etc/sudoers.d/$USERNAME
# USER $USERNAME

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /usr/app
# chown=$USERNAME:$USER_GID
COPY --from=builder /usr/tmp/package.json /usr/tmp/package-lock.json ./
COPY --from=builder /usr/tmp/node_modules/ ./node_modules/
COPY --from=builder /usr/tmp/.next/ ./.next/
COPY --from=builder /usr/tmp/config/ ./config/

# RUN sudo mkdir ./logs && sudo chown -R $USERNAME:$USER_GID ./logs

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# TODO: port as arg
EXPOSE 3000

# "--logs-dir=./logs"
# "sudo" npm ERR! Log files were not written due to an error writing to the directory: /usr/app/logs
CMD ["npm", "run", "start"]