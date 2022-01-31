import { Injectable } from '@nestjs/common';
import { CreateShapeDto } from './../dto/create-shape.dto';
import { FileService } from '../../file/file.service';

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
      fs.writeFile(
        self.fileService.getBasePath() +
          'shapes/' +
          self.createShapeDto.name +
          '.ttl',
        result,
        (err) => {
          // throws an error, you could also catch it here
          if (err) throw err;
        },
      );
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

    self.addNamedNode(
      self.prefixes['rdf'] + 'type',
      'http://www.w3.org/ns/shacl#NodeShape',
    );
    if (self.createShapeDto.shape.memorixCompatible === true) {
      self.addNamedNode(
        self.prefixes['rdf'] + 'type',
        'http://memorix.io/ontology#Recordtype',
      );
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
    );

    this.addLiteral(
      this.prefixes['dc'] + 'identifier',
      this.createShapeDto.shape.identifier,
    );

    this.addLiteral(this.prefixes['sh'] + 'closed', true);
  }

  async addShapeProperties() {
    Object.values(this.createShapeDto.property).forEach(property => {
      const options = [
        {
          predicate: namedNode(this.prefixes['sh'] + 'path'),
          object: namedNode(this.shorthandToFullUrl(property['path'])),
        },
        {
          predicate: namedNode(this.prefixes['sh'] + 'order'),
          object: literal(
            this.ordering.toFixed(1),
            namedNode('http://www.w3.org/2001/XMLSchema#decimal'),
          ),
        },
      ];

      //add labels
      Object.values(property['label']).forEach(label => {
        options.push({
          predicate: namedNode(this.prefixes['rdfs'] + 'label'),
          object: literal(label['title'], label['language']),
        });
      });

      //add group
      for (const key in this.createShapeDto.group) {
        if (this.createShapeDto.group[key]['id'] === property['group']) {
          options.push({
            predicate: namedNode(this.prefixes['sh'] + 'group'),
            object: namedNode(this.createShapeDto.group[key]['id']),
          });
        }
      }

      //add named node fields when they exist
      Object.values(['datatype']).forEach(val => {
        if (property[val] !== undefined && property[val] !== '') {
          options.push({
            predicate: namedNode(this.prefixes['sh'] + val),
            object: namedNode(property[val]),
          });
        }
      });

      //add literal fields when they exist
      Object.values(['minCount','maxCount']).forEach(val => {
        if (property[val] !== undefined && property[val] !== '') {
          options.push({
            predicate: namedNode(this.prefixes['sh'] + val),
            object: literal(property[val]),
          });
        }
      });

      this.writer.addQuad(
        namedNode(this.createShapeDto.shape.id),
        namedNode(this.prefixes['sh'] + 'property'),
        this.writer.blank(options),
      );
      this.ordering++;
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

    //add the prefixes for the schema itself.
    this.createShapeDto.prefix.forEach(function (row) {
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

  shorthandToFullUrl(url) {
    Object.keys(this.prefixes).forEach(key => {
      if(url.substr(0,key.length+1) === `${key}:`) {
        url = `${this.prefixes[key]}${url.substr( key.length + 1)}`
      }
    });
    return url;
  }
}
