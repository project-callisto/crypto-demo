# Valkyrie Demo

## running a dev server

```
DEBUG=* npm start
```

## running a (mock) production server (locally)

```
NODE_ENV=production npm run heroku-postbuild && NODE_ENV=production heroku local
```
