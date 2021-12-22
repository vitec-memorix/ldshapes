import { Injectable } from '@nestjs/common';
import {
  CreateShapeDto,
  PrefixDto,
  ShapeDto,
  GroupDto,
  PropertyDto,
} from '../dto/create-shape.dto';
import { FileService } from '../../file/file.service';
import { GenerateShapeService } from '../generate-shape/generate-shape.service';
const N3 = require('n3');
const { DataFactory } = N3;
const fs = require('fs');

@Injectable()
export class LoadShapeService {
  prefixes = {};
  shapeParents = {};
  quads;
  shapeDto = new CreateShapeDto();

  async create(file) {
    const shapeContent = await this.readShape(file);

    this.shapeDto.name = file.replace(/\.[^/.]+$/, "");

    this.setPrefixes(shapeContent['prefixes']);

    const parents = this.getShapeParents(shapeContent['quads']);

    this.shapeDto.shape = new ShapeDto(
      this.getQuadOptions(shapeContent['quads'], parents['shape']),
    );

    this.setGroups(shapeContent['quads'], parents['group']);
    this.setProperies(shapeContent['quads'], parents['property']);

    // console.log(this.shapeDto);
    return this.shapeDto;
  }
  readShape(file) {
    const fileService = new FileService();
    const fullFilePath = fileService.getBasePath() + 'shapes/' + file;
    const parser = new N3.Parser(),
      rdfStream = fs.createReadStream(fullFilePath);

    return new Promise((resolve, reject) => {
      const quads = [];
      const prefixes = [];
      parser.parse(rdfStream, (error, quad, prefix) => {
        if (error) {
          reject(error);
        }
        if (quad) {
          quads.push(quad);
        }
        if (prefix) {
          resolve({ quads: quads, prefixes: prefix });
        }
      });
    });
  }

  setPrefixes(prefixes) {
    this.prefixes = {};
    this.shapeDto.prefix = [];
    for (const key in prefixes) {
      this.prefixes[this.fixupLocalUrl(prefixes[key])] = key;
      this.shapeDto.prefix.push(
        new PrefixDto({ id: this.fixupLocalUrl(prefixes[key]), prefix: key }),
      );
    }
  }

  getShapeParents(quads) {
    const nodeShapes = [];
    const parents = { shape: '', group: [], class: [], property: [] };
    //loop through all quads and find the ones for nodeshapes and propertygroups
    for (const key in quads) {
      if (
        quads[key].predicate.value ===
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      ) {
        switch (quads[key].object.value) {
          case 'http://www.w3.org/ns/shacl#NodeShape':
            nodeShapes.push(quads[key].subject.value);
            break;
          case 'http://www.w3.org/ns/shacl#PropertyGroup':
            parents['group'].push(quads[key].subject.value);
            break;
        }
      }
      if (
        quads[key].predicate.value === 'http://www.w3.org/ns/shacl#property'
      ) {
        parents['property'].push(quads[key].object.value);
      }
    }

    //at the end. Check every class to find the one not subjected anywhere (that's the shape itself)
    for (const key in quads) {
      if (quads[key].predicate.value === 'http://www.w3.org/ns/shacl#class') {
        const index = nodeShapes.indexOf(quads[key].object.value);
        if (
          index !== -1 &&
          parents['property'].indexOf(quads[key].subject.value) !== -1
        ) {
          parents['class'].push(nodeShapes[index]);
          nodeShapes.splice(index, 1);
        }
      }
    }

    //the last nodeshape is the shape itself
    parents['shape'] = nodeShapes[0];
    return parents;
  }

  setGroups(quads, groups) {
    for (const key in groups) {
      this.shapeDto.group.push(
        new GroupDto(this.getQuadOptions(quads, groups[key])),
      );
    }
  }
  setProperies(quads, properties) {
    for (const key in properties) {
      let value = this.getQuadOptions(quads, properties[key]);
      value['property_type'] = this.getPropertyType(quads, value['id']);
      this.shapeDto.property.push(
        new PropertyDto(value),
      );
    }
  }

  getPropertyType(quads, id) {
    let datatype = 'http://www.w3.org/2001/XMLSchema#string';
    let editor = '';
    let property_type = null;

    for (const key in quads) {
      if (quads[key].subject.value === id) {
        if(quads[key].predicate.value == 'http://datashapes.org/dash#editor') {
          editor = quads[key].object.value;
        } else if (quads[key].predicate.value == 'http://www.w3.org/ns/shacl#datatype') {
          datatype = quads[key].object.value;
        }
      }
    }

    //check which type of field it is. if it's a string. It's a text field.
    if(datatype === 'http://www.w3.org/2001/XMLSchema#string') {
      property_type = 'text';
      //if it is a textarea editor it's a textarea field.
      if(editor === 'http://datashapes.org/dash#TextAreaEditor') {
        property_type = 'textarea';
      }
    }

    return property_type;
  }

  getQuadOptions(quads, parent) {
    const shapeValues = {};

    shapeValues['id'] = this.fixupLocalUrl(parent);
    shapeValues['memorixCompatible'] = false;
    shapeValues['label'] = [];
    let index = '';
    let value;
    for (const key in quads) {
      if (quads[key].subject.value === parent) {
        switch (quads[key].predicate.value) {
          case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type':
            if(quads[key].object.value === 'http://memorix.io/ontology#Recordtype') {
              shapeValues['memorixCompatible'] = true;
            }
            break;
          case 'http://www.w3.org/2000/01/rdf-schema#label':
            console.log(quads[key].object.value);
            shapeValues['label'].push({'title':quads[key].object.value,'language':quads[key].object.language});
            break;
          case 'http://www.w3.org/ns/shacl#maxCount':
          case 'http://www.w3.org/ns/shacl#minCount':
          case 'http://www.w3.org/ns/shacl#order':
          case 'http://purl.org/dc/elements/1.1/identifier':
          case 'http://www.w3.org/2000/01/rdf-schema#comment':
            index = quads[key].predicate.value.substr(this.getPrefixUrl(quads[key].predicate.value).length);
            value = quads[key].object.value;
            if (quads[key].object.datatype !== undefined) {
              switch (quads[key].object.datatype.value) {
                case 'http://www.w3.org/2001/XMLSchema#decimal':
                  value = parseFloat(value);
                  break;
                case 'http://www.w3.org/2001/XMLSchema#integer':
                  value = parseInt(value);
                  break;
              }
            }
            shapeValues[index] = value;
            break;
          case 'http://www.w3.org/ns/shacl#group':
          case 'http://www.w3.org/ns/shacl#class':
          case 'http://www.w3.org/ns/shacl#path':
          case 'http://www.w3.org/ns/shacl#targetClass':
            index = quads[key].predicate.value.substr(this.getPrefixUrl(quads[key].predicate.value).length);
            shapeValues[index] = this.fixupLocalUrl(
              quads[key].object.value,
            );
            break;
          default:
            // console.log(quads[key].object.value);
            // console.log(quads[key].predicate.value+' - '+quads[key].predicate.value.substr(this.getPrefixUrl(quads[key].predicate.value).length));
            break;
        }
      }
    }
    return shapeValues;
  }

  fixupLocalUrl(url) {
    if (url.substring(0, 10) === 'undefined/') {
      url = url.substring(9);
    }
    return url;
  }

  getShorthand(url) {
    const prefixUrl = this.getPrefixUrl(url);
    if (this.prefixes[this.getPrefixUrl(url)]) {
      return (
        this.prefixes[this.getPrefixUrl(url)] +
        ':' +
        url.substr(this.getPrefixUrl(url).length)
      );
    }
    return url;
  }

  getPrefixUrl(url) {
    const matches = url.match(/[a-z0-9]+$/i);
    return url.substr(0, matches['index']);
  }
}
