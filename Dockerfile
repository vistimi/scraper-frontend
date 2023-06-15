ARG VARIANT=alpine:3.16

#------------------
#    BUILDER
#------------------
FROM $VARIANT AS builder

RUN apk add --update --no-cache libc6-compat nodejs npm

WORKDIR /usr/tmp

COPY . ./
RUN npm ci
RUN npm run build

#------------------
#    runner
#------------------
FROM $VARIANT AS runner

RUN apk add --update --no-cache shadow sudo npm nodejs

ARG USERNAME=user
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN addgroup --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    # Add sudo support. Omit if you don't need to install software after connecting.
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME
USER $USERNAME

WORKDIR /usr/app
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/package.json /usr/tmp/package-lock.json ./
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/node_modules/ ./node_modules/
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/.next/ ./.next/
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/config/ ./config/

ENV NODE_ENV production
# disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# creates the common node_modules folder
RUN npm root -g

# TODO: port as arg
EXPOSE 3000

CMD ["/bin/sh", "-c", "npm run start --logs-dir=${TMPFS_NPM}"]