import { Injectable } from '@nestjs/common';
import { CreateShapeDto } from './../dto/create-shape.dto';
import { ShapeService } from '../shape.service';
import { FileService } from '../../file/file.service';
import transformString from './../../shared/transformString';

const shapeConfig = require('./../../../../resources/shapes/config.json');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;
const fs = require('fs');

// @ts-ignore
@Injectable()
export class GenerateShapeService {
  createShapeDto;
  writer;
  fileService = new FileService();
  parentNode = '';
  ordering = 1;
  currentGroup = '';
  prefixes = {};
  private schemaPath: string;

  async create(createShapeDto: CreateShapeDto) {
    const self = this;

    this.createShapeDto = createShapeDto;

    this.addShapePrefixes();

    this.writer = new N3.Writer({
      end: false,
      prefixes: this.prefixes,
    });

    this.ordering = 1;
    this.addShapeGroups();
    this.addShape();
    this.ordering = 1;
    this.addShapeProperties();

    await this.writer.end((error, result) => {
      fs.writeFile(self.fileService.getBasePath() + 'shapes/' + self.createShapeDto.name + '.ttl', result, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
      });
    });
    // success case, the file was saved
    return 'saved';
  }

  async addShapeGroups() {
    const self = this;
    this.createShapeDto.group.forEach(function (group) {
      self.addNamedNode(
        self.prefixes['rdf'] + 'type',
        self.prefixes['sh'] + 'PropertyGroup',
        group.id,
      );

      group.label.forEach(function (label) {
        self.addLiteral(
          self.prefixes['rdfs'] + 'label',
          label.title,
          label.language,
          group.id,
        );
      });

      self.addLiteral(
        self.prefixes['sh'] + 'order',
        self.ordering.toFixed(1),
        namedNode('http://www.w3.org/2001/XMLSchema#decimal'),
        group.id,
      );
      self.ordering++;
    });
  }

  async addShape() {
    const self = this;

    self.addNamedNode(self.prefixes['rdf'] + 'type', 'http://www.w3.org/ns/shacl#NodeShape');
    if(self.createShapeDto.shape.memorixCompatible === true) {
      self.addNamedNode(self.prefixes['rdf'] + 'type', 'http://memorix.io/ontology#Recordtype');
    }

    this.addNamedNode(
      this.prefixes['sh'] + 'targetClass',
      this.createShapeDto.shape.targetClass,
    );

    this.addNamedNode(
      this.prefixes['dash'] + 'defaultViewForRole',
      this.prefixes['dash'] + 'all',
    );

    this.writer.addQuad(
      namedNode(this.createShapeDto.shape.id),
      namedNode(this.prefixes['sh'] + 'ignoredProperties'),
      self.writer.list([namedNode(this.prefixes['rdf'] + 'type')]),
    );

    this.createShapeDto.shape.label.forEach(function (label) {
      self.addLiteral(
        self.prefixes['rdfs'] + 'label',
        label.title,
        label.language,
      );
    });

    this.addLiteral(
      this.prefixes['rdfs'] + 'comment',
      this.createShapeDto.shape.comment,
      this.createShapeDto.shape.language,
    );

    this.addLiteral(
      this.prefixes['dc'] + 'identifier',
      this.createShapeDto.shape.identifier,
    );

    this.addLiteral(this.prefixes['sh'] + 'closed', true);
  }

  async addShapeProperties() {
    const self = this;
    this.createShapeDto.property.forEach(function (property) {
      const options = [
        {
          predicate: namedNode(self.prefixes['sh'] + 'path'),
          object: namedNode(property.path),
        },
        {
          predicate: namedNode(self.prefixes['sh'] + 'order'),
          object: literal(
            self.ordering.toFixed(1),
            namedNode('http://www.w3.org/2001/XMLSchema#decimal'),
          ),
        },
      ];
      //add labels
      property.label.forEach(function (label) {
        options.push({
          predicate: namedNode(self.prefixes['rdfs'] + 'label'),
          object: literal(label.title, label.language),
        });
      });

      //add group
      for (const key in self.createShapeDto.group) {
        if (self.createShapeDto.group[key]['id'] === property.group) {
          options.push({
            predicate: namedNode(self.prefixes['sh'] + 'group'),
            object: namedNode(self.createShapeDto.group[key]['id']),
          });
        }
      }
      //add field specifics
      for(var key in shapeConfig.property_types[property.property_type]) {
        var object = namedNode(shapeConfig.property_types[property.property_type][key]);
        if(typeof shapeConfig.property_types[property.property_type][key] === 'boolean') {
          object = literal(shapeConfig.property_types[property.property_type][key]);
        }
        options.push({
          predicate: namedNode(key),
          object: object,
        });
      }

      //add minCount
      if(property.minCount !== undefined && property.minCount !== '') {
        options.push({
          predicate: namedNode(self.prefixes['sh'] + 'minCount'),
          object: literal(property.minCount),
        })
      }
      //add max count
      if(property.maxCount !== undefined && property.maxCount !== '') {
        options.push({
          predicate: namedNode(self.prefixes['sh'] + 'maxCount'),
          object: literal(property.maxCount),
        })
      }

      self.writer.addQuad(
        namedNode(self.createShapeDto.shape.id),
        namedNode(self.prefixes['sh'] + 'property'),
        self.writer.blank(options),
      );
      self.ordering++;
    });
  }

  async addFieldShape(fieldGroup) {
    const self = this;

    this['addShape' + fieldGroup['field_type']](fieldGroup);
    if (fieldGroup['children'].length > 0) {
      fieldGroup['children'].forEach(function (fieldGroup) {
        self.addFieldShape(fieldGroup);
      });
    }
  }

  addShapePrefixes() {
    const self = this;

    // console.log(this.createShapeDto.prefix);
    //add the prefixes for the schema itself.
    this.createShapeDto.prefix.forEach(function(row){
      self.prefixes[row.prefix] = row.id;
    });
    return this.prefixes;
  }

  async addNamedNode(type, node, parent = null) {
    if (parent === null) {
      parent = this.createShapeDto.shape.id;
    }
    this.writer.addQuad(namedNode(parent), namedNode(type), namedNode(node));
  }

  async addLiteral(
    type,
    literalValue,
    languageOrDatatype = null,
    parent = null,
  ) {
    if (parent === null) {
      parent = this.createShapeDto.shape.id;
    }
    this.writer.addQuad(
      namedNode(parent),
      namedNode(type),
      literal(literalValue, languageOrDatatype),
    );
  }
}
