# Callisto Cryptography Demo

The source code for <https://cryptography.projectcallisto.org/#>. This code is intended to illustrate select components of Callisto's cryptographic approach. It is not a full demonstration of the product, nor an official reporting platform for victims of sexual assault and coercion. For more details about our cryptographic approach, read our technical white paper: https://www.projectcallisto.org/callisto-cryptographic-approach.pdf

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

( duplicated in `.travis.yml`)

build / data integrity tests

```
bin/json-lint.sh
npm run heroku-postbuild
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
