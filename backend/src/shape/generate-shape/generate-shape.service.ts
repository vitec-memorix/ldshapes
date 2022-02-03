import { Injectable } from '@nestjs/common';
import { CreateShapeDto } from './../dto/create-shape.dto';
import { FileService } from '../../file/file.service';
import { fixupLocalUrl, getPrefixUrl } from '../../helper/transformShape';
import {BlankNode} from "n3";

const shapeConfig = require('./../../../../resources/shapes/config.json');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;
const fs = require('fs');

const N3Util = N3.Util;

// @ts-ignore
@Injectable()
export class GenerateShapeService {
  createShapeDto;
  writer;
  originalContent;
  contentLists;
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

    //remove shorthand from shape id.
    this.createShapeDto.shape.id = this.shorthandToFullUrl(this.createShapeDto.shape.id);

    this.originalContent = new N3.Store(this.createShapeDto['original']);
    this.contentLists = this.originalContent.extractLists()

    this.writer = new N3.Writer({
      end: false,
      prefixes: this.prefixes,
    });

    this.ordering = 1;
    this.addShapeGroups();
    this.addShape();

    this.ordering = 1;
    this.addShapeProperties(self.createShapeDto.shape.id);

    //also fill separate shape nodes.
    const shapes = this.originalContent.getQuads( null, null, 'http://www.w3.org/ns/shacl#NodeShape');
    Object.values(shapes).forEach(shape => {
      let original = fixupLocalUrl(shape['subject']['id']);
      if(original !== self.createShapeDto.shape.original) {
        let id = this.replaceShapeIdChanges(original);

        //fill additional data
        this.fillAdditionalData(id, original, [this.prefixes['sh'] + 'property']);

        //also add the properties for these shapes.
        this.ordering = 1;
        this.addShapeProperties(id);
      }
    });

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
    Object.values(this.createShapeDto.group).forEach((group :any) => {
      group['id'] = this.shorthandToFullUrl(group['id']);
      if(!group['deleted']) {
        let ignoreOld = [];

        this.addNamedNode(
          this.prefixes['rdf'] + 'type',
          this.prefixes['sh'] + 'PropertyGroup',
          group['id'],
        );
        ignoreOld.push(this.prefixes['rdf'] + 'type');
        Object.values(group['label']).forEach((label) => {
          this.addLiteral(
            this.prefixes['rdfs'] + 'label',
            label['title'],
            label['language'],
            group['id'],
          );
        });
        ignoreOld.push(this.prefixes['rdfs'] + 'label');

        this.addLiteral(
          this.prefixes['sh'] + 'order',
          this.ordering.toFixed(1),
          namedNode('http://www.w3.org/2001/XMLSchema#decimal'),
          group['id'],
        );
        ignoreOld.push(this.prefixes['sh'] + 'order');

        //fill additional data
        this.fillAdditionalData(group['id'], group['original'], ignoreOld);
        this.ordering++;
      }
    });
  }

  async addShape() {
    const self = this;
    let ignoreOld = [];
    self.addNamedNode(
      self.prefixes['rdf'] + 'type',
      self.prefixes['sh'] + 'NodeShape',
    );
    if (self.createShapeDto.shape.memorixCompatible === true) {
      self.addNamedNode(
        self.prefixes['rdf'] + 'type',
        'http://memorix.io/ontology#Recordtype',
      );
    }
    ignoreOld.push(self.prefixes['rdf'] + 'type');

    this.addNamedNode(
      this.prefixes['sh'] + 'targetClass',
      this.createShapeDto.shape.targetClass,
    );
    ignoreOld.push(this.prefixes['sh'] + 'targetClass');

    // this.addNamedNode(
    //   this.prefixes['dash'] + 'defaultViewForRole',
    //   this.prefixes['dash'] + 'all',
    // );
    // ignoreOld.push(this.prefixes['dash'] + 'defaultViewForRole');

    // this.writer.addQuad(
    //   namedNode(this.createShapeDto.shape.id),
    //   namedNode(this.prefixes['sh'] + 'ignoredProperties'),
    //   self.writer.list([namedNode(this.prefixes['rdf'] + 'type')]),
    // );
    // ignoreOld.push(this.prefixes['sh'] + 'ignoredProperties');

    Object.values(this.createShapeDto.shape.label).forEach(label => {
      this.addLiteral(
        this.prefixes['rdfs'] + 'label',
        label['title'],
        label['language'],
      );
    });
    ignoreOld.push(this.prefixes['rdfs'] + 'label');

    this.addLiteral(
      this.prefixes['rdfs'] + 'comment',
      this.createShapeDto.shape.comment,
    );
    ignoreOld.push(this.prefixes['rdfs'] + 'comment');

    this.addLiteral(
      this.prefixes['dc'] + 'identifier',
      this.createShapeDto.shape.identifier,
    );
    ignoreOld.push(this.prefixes['dc'] + 'identifier');

    this.addLiteral(this.prefixes['sh'] + 'closed', true);
    ignoreOld.push(this.prefixes['sh'] + 'closed');

    ignoreOld.push(this.prefixes['sh'] + 'property');

    //fill additional data
    this.fillAdditionalData(self.createShapeDto.shape.id, self.createShapeDto.shape.original, ignoreOld);

  }

  async addShapeProperties(id) {
    Object.values(this.createShapeDto.property).forEach(property => {
      if(property !== null && property['id'] !== undefined) {
        let shape = this.createShapeDto.shape.id;
        if(property['id'] !== '' && property['id'] !== undefined) {
          shape = fixupLocalUrl(this.originalContent.getQuads(null, null, '_:' + property['id'])[0].subject.id);
          if(this.createShapeDto.shape.id !== this.createShapeDto.shape.original) {
            shape = shape.replace(this.createShapeDto.shape.original,this.createShapeDto.shape.id);
          }
        }
        if(shape === id) {
          let ignoreOld = [];
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
          ignoreOld.push(this.prefixes['sh'] + 'path');
          ignoreOld.push(this.prefixes['sh'] + 'order');

          //add labels
          Object.values(property['label']).forEach(label => {
            options.push({
              predicate: namedNode(this.prefixes['rdfs'] + 'label'),
              object: literal(label['title'], label['language']),
            });
          });
          ignoreOld.push(this.prefixes['rdfs'] + 'label');

          //add group
          for (const key in this.createShapeDto.group) {
            if (this.createShapeDto.group[key]['id'] === property['group']) {
              options.push({
                predicate: namedNode(this.prefixes['sh'] + 'group'),
                object: namedNode(this.shorthandToFullUrl(this.createShapeDto.group[key]['id'])),
              });
            }
          }
          ignoreOld.push(this.prefixes['sh'] + 'group');

          //add named node fields when they exist
          Object.values(['datatype']).forEach(val => {
            if (property[val] !== undefined && property[val] !== '') {
              options.push({
                predicate: namedNode(this.prefixes['sh'] + val),
                object: namedNode(property[val]),
              });
              ignoreOld.push(this.prefixes['sh'] + val);
            }
          });

          //add literal fields when they exist
          Object.values(['minCount', 'maxCount']).forEach(val => {
            if (property[val] !== undefined && property[val] !== '') {
              options.push({
                predicate: namedNode(this.prefixes['sh'] + val),
                object: literal(property[val]),
              });
              ignoreOld.push(this.prefixes['sh'] + val);
            }
          });

          // this.fillAdditionalData(group['id'], group['original'], ignoreOld);
          if (property['id'] !== '') {
            Object.values(this.originalContent.getQuads('_:' + property['id'])).forEach(val => {
              if (!ignoreOld.includes(val['predicate']['id'])) {
                val['object']['id'] = this.replaceShapeIdChanges(fixupLocalUrl(val['object']['id']));
                let object: any = val['object'];
                if (N3Util.isBlankNode(val['object'])) {
                  object = this.fillBlankNode(val['object']['id']);
                }
                options.push({
                  predicate: val['predicate'],
                  object: object,
                });
              }
            });
          }
          this.writer.addQuad(
            namedNode(shape),
            namedNode(this.prefixes['sh'] + 'property'),
            this.writer.blank(options),
          );
          this.ordering++;
        }
      }
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
    if(url === undefined) {
      return url;
    }
    Object.keys(this.prefixes).forEach(key => {
      if(url.substr(0,key.length+1) === `${key}:`) {
        url = `${this.prefixes[key]}${url.substr( key.length + 1)}`
      }
    });
    return url;
  }

  fillAdditionalData(id:string, original:string, ignoreOld:any, fillBlanknode = false){
    Object.values(this.originalContent.getQuads()).forEach((content:any) => {
      content.object.id = fixupLocalUrl(content.object.id);
      content.subject.id = fixupLocalUrl(content.subject.id);
      if(original === content.subject.id && !ignoreOld.includes(content.predicate.id)) {
        if(content.object.id.substr(0,original.length) === original) {
          content.object.id = id + content.object.id.substr(original.length);
        }
        content.subject.id = id;
        if(N3Util.isBlankNode(content.object)) {
          this.writer.addQuad(
            namedNode(content.subject.id),
            namedNode(content.predicate.id),
            this.fillBlankNode(content.object.id),
          );
        } else {
          this.writer.addQuad(content);
        }
      }
    })
  }

  replaceShapeIdChanges(url) {
    if(this.createShapeDto.shape.id !== this.createShapeDto.shape.original) {
      url = url.replace(this.createShapeDto.shape.original,this.createShapeDto.shape.id);
    }
    return url;
  }

  fillBlankNode(id) {
    let options = [];
    if(this.contentLists[id.substr(2)] !== undefined) {
      Object.keys(this.contentLists[id.substr(2)]).forEach(key => {
        let object = this.contentLists[id.substr(2)][key];
        if (N3Util.isBlankNode(this.contentLists[id.substr(2)][key])) {
          object = this.fillBlankNode(this.contentLists[id.substr(2)][key]['id']);
        }
        options.push(object);
      });

      return this.writer.list(options);

    } else {
      Object.values(this.originalContent.getQuads(id)).forEach(val => {
        let object = val['object'];
        if (N3Util.isBlankNode(val['object'])) {
          object = this.fillBlankNode(val['object']['id']);
        }
        object['id'] = fixupLocalUrl(object['id']);
        options.push({
          predicate: val['predicate'],
          object: object,
        });
      });
      return this.writer.blank(options);
    }

  }
}
