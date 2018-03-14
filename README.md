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

## running a mock production server locally

```
npm run heroku-postbuild
npm run start:prod
```

## running the tests

```
npm run test:unit -- --single-run
npm run test:e2e -- --single-run
```

## running storybook

```
npm run storybook
# open http://localhost:9001/
```