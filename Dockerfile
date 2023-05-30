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

RUN apk add --no-cache shadow
ARG USERNAME=user
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN addgroup --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
    # # Add sudo support. Omit if you don't need to install software after connecting.
    # && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    # && chmod 0440 /etc/sudoers.d/$USERNAME
USER $USERNAME

WORKDIR /usr/app
COPY --chown=$USERNAME:$USER_GID --from=builder /usr/tmp/node_modules /usr/tmp/.next /usr/tmp/package.json /usr/tmp/package-lock.json ./

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# TODO: port as arg
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]