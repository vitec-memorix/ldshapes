class BaseShapeDto {
  id: URL;
  label: LabelDto[];
  order?: number;
  constructor(bodyValue: any = {}) {
    //set default values
    this.id = bodyValue.id;
    this.label = bodyValue.label;
    this.order = bodyValue.order;
  }
}

export class CreateShapeDto {
  name: string;
  shape: ShapeDto;
  prefix: PrefixDto[];
  group: GroupDto[];
  property: PropertyDto[];
  constructor() {
    //set default values
    this.name = '';
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
  memorixCompatible: boolean;
  comment: string;
  constructor(bodyValue: any = {}) {
    super(bodyValue);
    this.language = 'nl';
    this.identifier = bodyValue.identifier;
    this.targetClass = bodyValue.targetClass;
    this.memorixCompatible = bodyValue.memorixCompatible;
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

export class LabelDto {
  title: string;
  language: string;
  constructor(bodyValue: any = {}) {
    this.title = bodyValue.title;
    this.language = bodyValue.language;
  }
}
