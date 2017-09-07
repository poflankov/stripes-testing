FROM ubuntu:xenial

ARG folio_registry=https://repository.folio.org/repository/npm-folioci/

RUN apt-get -q update && \
    DEBIAN_FRONTEND="noninteractive" apt-get -q install -y \
    -o Dpkg::Options::="--force-confnew"  --no-install-recommends \
    git wget unzip xvfb && \
    apt-get install -y libgtk2.0-0 libxtst6 libxss1 libgconf-2-4 libnss3 libnspr4  libasound2 && \
    apt-get -q clean -y && rm -rf /var/lib/apt/lists/* && \
    rm -f /var/cache/apt/*.bin

ENV NODEJS_VERSION 6

RUN wget --no-check-certificate --no-cookies https://deb.nodesource.com/setup_${NODEJS_VERSION}.x -O /tmp/node.sh  && \
    chmod +x /tmp/node.sh && \
    sh -c "/tmp/node.sh" && \
    rm -f /tmp/node.sh && \
    apt-get install -y nodejs && \
    npm install -g yarn

WORKDIR /usr/src/ui-testing

COPY test /usr/src/ui-testing/test
COPY LICENSE /usr/src/ui-testing/LICENSE
COPY package.json /usr/src/ui-testing/package.json
COPY docker-run.sh /usr/src/ui-testing/docker-run.sh
COPY yarn.lock /usr/src/ui-testing/yarn.lock
COPY *.js /usr/src/ui-testing/

RUN useradd -ms /bin/bash folio
RUN chown -R folio /usr/src/ui-testing
USER folio

RUN yarn config set @folio:registry $folio_registry

RUN yarn install

ENTRYPOINT ["./docker-run.sh"]

