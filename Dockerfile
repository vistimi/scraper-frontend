ARG ALPINE_VARIANT=node:18.8.0-alpine

#------------------
#    BUILDER
#------------------
FROM $ALPINE_VARIANT AS builder

WORKDIR /usr/tmp

RUN apk add --update --no-cache libc6-compat

COPY . ./
RUN npm ci
RUN npm run build

#------------------
#    runner
#------------------
FROM builder AS runner

ARG USER_NAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN apk update && apk add --update sudo
RUN addgroup --gid $USER_GID $USER_NAME \
    && adduser --uid $USER_UID -D -G $USER_NAME $USER_NAME \
    && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER_NAME \
    && chmod 0440 /etc/sudoers.d/$USER_NAME
USER $USER_NAME

WORKDIR /usr/app
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/node_modules /usr/tmp/.next /usr/tmp/package.json /usr/tmp/package-lock.json ./

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# TODO: port as arg
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]