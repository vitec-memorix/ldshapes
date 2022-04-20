
FROM node:14

WORKDIR /app
# ENV NODE_ENV production

## TODO: It is recommended to create and use a non-root user
# RUN addgroup --gid 1001 nodejs
# RUN adduser --gid 1001 -u 1001 --disabled-password --shell /bin/bash nodejs
# COPY . ./ 
# RUN chown -R nodejs:nodejs /app
# # COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
# # COPY --from=build-react --chown=nodejs:nodejs /app/build ./public
# USER nodejs

COPY ./backend backend
# COPY ./resources resources

WORKDIR /app/backend

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start"]
