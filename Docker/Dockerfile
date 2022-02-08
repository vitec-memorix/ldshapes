FROM node:16

WORKDIR /app

RUN \
  apt update && apt install -y python-pip nginx && \
  pip install supervisor && npm install -g serve && \
  mkdir /var/log/ldshapes && \
  git clone https://github.com/picturae/ldshapes.git && \
  echo "export const server = {baseURL: '/backend/',}" > ldshapes/frontend/src/helper.ts && \
  cd ldshapes/backend && npm install && \
  cd ../frontend && npm install && npm run build 

COPY supervisord.conf ./
COPY entrypoint.sh ./
COPY ldshapes.conf /etc/nginx/sites-enabled/default

ENTRYPOINT [ "/app/entrypoint.sh" ]
