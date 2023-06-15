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

RUN apk add --update --no-cache shadow sudo nodejs npm

ARG USERNAME=user
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN addgroup --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
# Add sudo support. Omit if you don't need to install software after connecting.
# && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
# && chmod 0440 /etc/sudoers.d/$USERNAME
USER $USERNAME

WORKDIR /usr/app
COPY --from=builder  /usr/tmp/package.json /usr/tmp/package-lock.json ./
COPY --from=builder  /usr/tmp/node_modules/ ./node_modules/
COPY --from=builder  /usr/tmp/.next/ ./.next/
COPY --from=builder  /usr/tmp/config/ ./config/

ENV NODE_ENV production
# disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# TODO: port as arg
EXPOSE 3000

CMD ["npm", "run", "start", "--loglevel=verbose"]