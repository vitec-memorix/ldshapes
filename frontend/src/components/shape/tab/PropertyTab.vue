<template>
    <div v-if="!isShapeIdValid()">
        {{ $t('shapeIdRequired') }}
    </div>
    <div v-if="isShapeIdValid()">
        <div class="scrollable-content">
            <draggable class="dragArea list-group w-full m-2 mb-3" v-model="groups" handle=".grouphandle" @sort="reorderGroups">
                <div v-for="(group, groupindex) in groups" :key="groupindex" class="row pt-2">
                    <div class="form-group col-12 col-sm-1">
                        <div class="property-button-container float-sm-start">
                            <span class="btn btn-grey btn-sm grouphandle">
                            <i class="bi-arrows-move"/>
                            </span>
                        </div>
                    </div>
                    <div class="form-group col-10">
                        <div class="row">
                            <div class="form-group col-12">
                                <label-field :field="'group.'+groupindex+'.label'" :list="group.label" field-name="Groupname" :inline="false" />
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-12 col-sm-1">
                        <div class="property-button-container float-sm-end" v-if="isGroupEmpty(group.id)">
                            <span class="btn btn-grey btn-sm" v-on:click="removeSettingRow('group',groupindex)"><i class="bi-trash"/></span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row">
                    <draggable class="dragArea list-property "
                               :list="propertiesByGroup[group.id]"
                               group="people"
                               @change="log(group.id, $event)"
                               itemKey="order"
                               handle=".properyhandle" @sort="reorderProperties(group.id)">
                        <div v-for="(property, propertyindex) in propertiesByGroup[group.id]" :key="propertyindex" class="row pt-2">
                                <div class="col-12 col-sm-1">
                                    <div class="property-button-container float-sm-start">
                                        <span class="btn btn-grey btn-sm properyhandle"><i class="bi-arrows-move"/></span>
                                    </div>
                                </div>
                                <div class="form-property col-12 col-sm-10">
                                    <div class="row">
                                        <label-field :field="'property.'+property.key+'.label'" :list="property.label" :inline="false" />
                                    </div>
                                    <div class="row">
                                        <div class="form-property col-12 col-lg-5">
                                            <div class="row">
                                                <id-field :field="'property.'+property.key+'.path'" fieldName="sh:path" :value="property.path"  :inline="false" />
                                            </div>
                                        </div>
                                        <div class="form-property col-12 col-lg-3">
                                            <label class="form-label small-form-label">sh:datatype</label>
                                            <select v-model="property.datatype" class="form-select" >
                                                <option v-for="(data_type, index) in shapeConfig.datatypes" :key="index" :value="index">
                                                    {{data_type}}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="form-property col-12 col-lg-4">
                                            <div class="row">
                                                <div class="form-property col-12">
                                                    <label class="form-label small-form-label">{{$t('property.minMaxCount')}}</label>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="form-property col-6">
                                                    <input type="number" v-model="property.minCount" class="form-control" :placeholder="0">
                                                </div>
                                                <div class="form-property col-6">
                                                    <input type="number" v-model="property.maxCount" class="form-control" :placeholder="1">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-property col-12 col-sm-1">
                                    <div class="property-button-container float-sm-end">
                                        <span class="btn btn-grey btn-sm" v-on:click="removeSettingRow('property',property.key)">
                                            <i class="bi-trash"/>
                                        </span>
                                    </div>
                                </div>
                        </div>
                    </draggable>
                        </div>
                    </div>
                </div>
            </draggable>
        </div>
        <button type="button" class="btn btn-light btn-outline-dark pe-4 ps-4 me-3" v-on:click="addSettingRow('group',{'id':':group'+settings.group.length,'label':[]})">{{ $t('group.add') }}</button>
        <button type="button" class="btn btn-light btn-outline-dark pe-4 ps-4" v-if="settings.group.length > 0" v-on:click="addSettingRow('property',{'id':'','label':[],'group':getLastGroupId()})">{{ $t('property.add') }}</button>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import LabelField from '../field/LabelField.vue';
  import IdField from '../field/IdField.vue';
  import {validateAbsoluteIRI} from '@/mixins/validateShape';
  import { VueDraggableNext } from 'vue-draggable-next'
  import sortNestedArray from "@/mixins/sortNestedArray";
  import {addSettingRowKey, removeSettingRowKey, updateSettingFieldKey} from "@/symbols/shape";

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
      LabelField,
      IdField
    },
    watch: {
      settings: {
        handler(newVal:any) {
          // sortNestedArray('order',newVal.group);
          this.groups = newVal.group;

          sortNestedArray('order',newVal.property);
          this.properties = newVal.property;

          this.setPropertiesByGroup();
        },
        deep:true,
      },
    },
    inject: ['shapeConfig'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const removeSettingRow = inject(removeSettingRowKey);
      const updateSettingField = inject(updateSettingFieldKey);
      const settings :any = inject('settings');

      if (updateSettingField === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        addSettingRow,
        removeSettingRow,
        updateSettingField,
        settings
      };
    },
    data() {
      let propertiesByGroup :any = {};
      return {
        properties:[],
        groups:[],
        propertiesByGroup:propertiesByGroup,
      }
    },
    methods: {
      validateAbsoluteIRI,
      setPropertiesByGroup() {
        this.propertiesByGroup = {};
        for(const key in this.properties) {
          if(this.properties[key]['group'] !== undefined) {
            if(this.propertiesByGroup[this.properties[key]['group']] === undefined) {
              this.propertiesByGroup[this.properties[key]['group']] = [];
            }
            let property = this.properties[key];
            (property['key'] as string) = key;
            this.propertiesByGroup[this.properties[key]['group']].push(property);
          }
        }
      },
      getLastGroupId() {
          return this.groups[this.groups.length-1]['id'];
      },
      reorderGroups() {
        let order = 1.0;
        for(const key in this.groups) {
          (this.groups[key]['order'] as any) = order;
          order++;
        }
        this.updateSettingField('group',this.groups);
      },
      reorderProperties(groupId :string) {
        let order = 1.0;
        for(const key in this.propertiesByGroup[groupId]) {
          (this.properties[this.propertiesByGroup[groupId][key]['key']]['order'] as any) = order;
          order++;
        }
        this.updateSettingField('property',this.properties);
      },
      log: function(groupId :string, evt :any) {
        if(evt.added !== undefined) {
          (this.properties[evt.added.element.key]['group'] as string) = groupId;
          evt.added.element.group = groupId;
          this.propertiesByGroup[groupId].splice(evt.added.newIndex, 0, evt.added.element);
          this.reorderProperties(groupId);
        }
      },
      isGroupEmpty(group:string) {
        if(this.propertiesByGroup[group] === undefined || this.propertiesByGroup[group].length == 0) {
          return true;
        }
        return false;
      },
      isShapeIdValid() {
        if(!this.settings.shape.id) {
          return false;
        }
        if(this.settings.shape.id !== undefined) {
          const matches: string[]|null = this.settings.shape.id.match(/^([a-z][a-z0-9]+):[a-zA-Z]/);
          if(matches !== null && matches[1] !== undefined) {
            var prefixFound = false;
            //Check if the prefix is already set.
            if(this.settings.prefix !== undefined) {
              this.settings.prefix.forEach(function(prefix :any){
                if(prefix['prefix'] === matches[1]) {
                  prefixFound = true;
                }
              });
            }
            if(!prefixFound) {
              return false;
            }
          }
        }
        return (this.validateAbsoluteIRI(this.settings.shape.id) === true);
      }
    },
  });
</script>
