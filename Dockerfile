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

COPY package.json package-lock.json* ./
# RUN npm ci --omit=dev
RUN npm ci

RUN npm run build
RUN npm prune --production

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
COPY --from=builder-workflow /usr/tmp/node_modules ./node_modules
COPY --from=builder-workflow /usr/tmp/.next ./.next
COPY --from=builder-workflow /usr/tmp/package.json ./package.json

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

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