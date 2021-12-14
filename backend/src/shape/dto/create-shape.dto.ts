class BaseShapeDto {
  id: URL;
  label: string;
  order?: number;
  constructor(bodyValue: any = {}) {
    //set default values
    this.id = bodyValue.id;
    this.label = bodyValue.label;
    this.order = bodyValue.order;
  }
}

export class CreateShapeDto {
  shape: ShapeDto;
  prefix: PrefixDto[];
  group: GroupDto[];
  property: PropertyDto[];
  constructor() {
    //set default values
    this.shape = new ShapeDto();
    this.prefix = [];
    this.group = [];
    this.property = [];
  }
}

export class ShapeDto extends BaseShapeDto {
  language: string;
  identifier: string;
  targetClass: string;
  type: string[];
  comment: string;
  constructor(bodyValue: any = {}) {
    super(bodyValue);
    this.language = bodyValue.language;
    this.identifier = bodyValue.identifier;
    this.targetClass = bodyValue.targetClass;
    this.type = bodyValue.type;
    this.comment = bodyValue.comment;
  }
}

export class GroupDto extends BaseShapeDto {
  constructor(bodyValue: any = {}) {
    super(bodyValue);
  }
}

export class PropertyDto extends BaseShapeDto {
  path: string;
  path_name: string;
  group: string;
  minCount: number;
  maxCount: number;
  property_type: string;
  constructor(bodyValue: any = {}) {
    super(bodyValue);
    this.path = bodyValue.path;
    this.path_name = bodyValue.path_name;
    this.group = bodyValue.group;
    this.minCount = bodyValue.minCount;
    this.maxCount = bodyValue.maxCount;
    this.property_type = bodyValue.property_type;
  }
}

export class PrefixDto {
  id: URL;
  prefix: string;

  constructor(bodyValue: any = {}) {
    this.id = bodyValue.id;
    this.prefix = bodyValue.prefix;
  }
}
