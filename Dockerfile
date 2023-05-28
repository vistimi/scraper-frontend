ARG VARIANT=node:18.8.0-alpine
ARG RUNNER=workflow

#-------------------------
#    BUILDER FINAL
#-------------------------
FROM ${VARIANT} as builder-final

#-------------------------
#    RUNNER
#-------------------------
#                    --->   workflow   ---
#                   /                      \
#  builder-final ---                        ---> runner
#                   \                      /
#                    ---> devcontainer ---

#-------------------------
#    RUNNER WORKFLOW
#-------------------------
# builder
FROM builder-final AS builder-workflow

WORKDIR /usr/tmp

RUN apk add --update --no-cache libc6-compat

COPY . ./
RUN npm ci
RUN npm run build

# runner
FROM builder-final AS runner-workflow

# ARG USER_NAME=user
# ARG USER_UID=1000
# ARG USER_GID=$USER_UID
# RUN apk update && apk add --update sudo
# RUN addgroup --gid $USER_GID $USER_NAME \
#     && adduser --uid $USER_UID -D -G $USER_NAME $USER_NAME \
#     && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER_NAME \
#     && chmod 0440 /etc/sudoers.d/$USER_NAME
# USER $USER_NAME

WORKDIR /usr/app
COPY --from=builder-workflow /usr/tmp/node_modules /usr/tmp/.next /usr/tmp/package.json /usr/tmp/package-lock.json ./

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# TODO: port as arg
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]

#-------------------------
#    RUNNER DEVCONTAINER
#-------------------------
FROM builder-final AS runner-devcontainer

#-------------------------
#       RUNNER
#-------------------------
FROM runner-${RUNNER} AS runner