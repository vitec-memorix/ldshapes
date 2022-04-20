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
```bash
cd frontend

npm run serve
```

## Deploying with docker

Alternatively you can also deploy the backend on http://localhost:3000, and the frontend on http://localhost:8080 with docker:

```bash
docker-compose up
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
```bash
npm run build
```

### Frontend Lints and fixes files
```bash
npm run lint
```

## Configuration Shape Creator

The Shape creator uses a small configuration file (json) to fill lists and default prefixes.

This configuration file is located in "/resources" and named "config.json". 
If needed you can add (or remove) your own values to choose from.

Be carefull of which default prefixes you remove. Most are needed for a proper Shape when starting from scratch.

## Creating a mapping
To transform your data to rdf, you need an [rml](https://rml.io/specs/rml/) mapping.

The mapping should be put in the `/resources/mappings/` folder.

Example:
```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix ex: <http://example.com/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rml:    <http://semweb.mmlab.be/ns/rml#> .
@prefix ql:     <http://semweb.mmlab.be/ns/ql#> .
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#> .
@prefix schema: <http://schema.org/> .
@prefix fno: <http://w3id.org/function/ontology#> .

@base <http://example.com/base/> .

<TriplesMap1>
  a rr:TriplesMap;
  rml:logicalSource [
    rml:source "<absolute-path-to-data-source>";
    rml:referenceFormulation ql:JSONPath;
    rml:iterator "$.persons[*]"
  ];
    
    rr:subjectMap [ 
        rml:reference "firstName";
        rr:termType rr:IRI;
    ];
    
     rr:predicateObjectMap [
     	rr:predicate rdf:type;
     	rr:object foaf:Person;
     ];

     rr:predicateObjectMap [
         rr:predicate foaf:givenName;
         rr:objectMap [ rml:reference "firstName" ];
     ];
    
     rr:predicateObjectMap [
         rr:predicate foaf:familyName;
         rr:objectMap [ rml:reference "lastName" ];
     ];
```

## Transforming data with the cli

```bash
cd backend

npm run cli:dev -- transform --mapping <name> --output <name>
```

```bash
-m, --mapping <name>        the mapping file in `/resources/mappings/`
-o, --output <name>         the output file that will be placed in `/resources/rdf/`
```

Example:
```bash
cd backend

npm run cli:dev -- transform --mapping person-mapping.ttl --output persons.n3
```
## Validating RDF with the cli
```bash
cd backend

npm run cli:dev -- validate --rdf <name> --shape <name>
```

```bash
-r, --rdf <name>            the name of the rdf file in `/resources/rdf/`
-s, --shape <name>          the name of the shape file in `/resources/shapes/`
```

Example:
```bash
cd backend

npm run cli:dev -- validate --rdf persons.n3 --shape person-shape.ttl
```
