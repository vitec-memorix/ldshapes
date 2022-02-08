#!/bin/bash

test -d /var/lib/ldshapes/resources || {
  test -d /var/lib/ldshapes || mkdir -p /var/lib/ldshapes
  echo "Detected first run: creating resource infrastructure"
  mv /app/ldshapes/resources /var/lib/ldshapes
  ln -s /var/lib/ldshapes/resources /app/ldshapes/resources
}

supervisord -c /app/supervisord.conf
