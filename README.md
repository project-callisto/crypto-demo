# Valkyrie Demo

## setting up a dev server

Install dependencies:

```
npm install
```

## running a dev server

```
NODE_ENV=dev DEBUG=* npm start
```

## running a (mock) production server (locally)

```
rm -rf node_modules && \
npm install --quiet --production && \
NODE_ENV=production npm run heroku-postbuild && \
NODE_ENV=production heroku local
```
