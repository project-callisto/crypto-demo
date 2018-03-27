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
npm run start:mock-prod
```

## running the tests

data-file validatity tests

```
bin/json-lint.sh
```

build integrity tests

```
npm run heroku-postbuild
npm run storybook:build -- --smoke-test
```

application tests

```
npm run test:unit -- --single-run
npm run test:e2e -- --single-run
```

## running storybook

```
npm run storybook
# open http://localhost:9001/
```