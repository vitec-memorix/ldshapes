![LDShapes Logo](frontend/public/ldshapes-logo-light.png?raw=true "")

## Description

LDShapes is a software tool used to define rdf-based data structures and transform data from miscellaneous sources to RDF data based on and validated against that data structure. The tool has a primary goal of getting data from miscellaneous sources into any RDF-based collection management system such as Memorix. Since both Memorix and LDShapes use open standards to reason about and describe data, LDShapes could be used in other environments as well, such as generic triple stores and /or other collection management systems.

## Installation

make sure you use node >= 10.13.0, except for v13

```bash
cd backend
$ npm install

cd ../

cd frontend
npm install
```

## Running the application

```bash
cd backend

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### For running the frontend (Run in a separate cmd)
```
cd frontend

npm run serve
```

## Testing the backend

```bash
cd backend

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Frontend Compiles and minifies for production
```
npm run build
```

### Frontend Lints and fixes files
```
npm run lint
```

## Cli

This tool uses @squareboat/nest-console for running scripts from the command line.

To list all commands use:
```bash
node cli list
```

To add commands see https://github.com/squareboat/nest-console

