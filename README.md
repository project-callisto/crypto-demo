# Valkyrie Demo

## running the auto-linter

```
npm run clean
```

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

## running local e2e tests

[ process 1 ]

```
npm run start:e2e
```

[ process 2 ]

```
npm run test:e2e
```