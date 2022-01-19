<template>
    <draggable class="dragArea list-group w-full m-2 mb-3" v-model="groups" handle=".grouphandle" @sort="reorderGroups">
        <div v-for="(group, groupindex) in groups" :key="groupindex" class="row border p-2">
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move grouphandle"></span>
            </div>
            <div class="form-group col-10">
                <div class="row">
                    <div class="form-group col-12">
                        <label-field :field="'group.'+groupindex+'.label'" :list="group.label" field-name="Groupname" :inline="false" />
                    </div>
                </div>
            </div>
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeSettingRow('group',groupindex)"></span>
            </div>
            <draggable class="dragArea list-property w-full m-2 mb-3"
                       :list="propertiesByGroup[group.id]"
                       group="people"
                       @change="log(group.id, $event)"
                       itemKey="order"
                       handle=".properyhandle" @sort="reorderProperties(group.id)">
                <div v-for="(property, propertyindex) in propertiesByGroup[group.id]" :key="propertyindex" class="row border p-2">
                        <div class="form-property col-1 align-self-center">
                            <span class="btn btn-info btn-sm bi-arrows-move properyhandle"></span>
                        </div>

                        <div class="form-property col-10">
                            <div class="row">
                                <label-field :field="'property.'+property.key+'.label'" :list="property.label" :inline="false" />
                                <id-field :field="'property.'+property.key+'.path'" fieldName="sh:path" :value="property.path"  :inline="false" />
                            </div>
                            <div class="row">
        <!--                        <div class="form-property col-12">-->
        <!--                            <label class="form-label fw-bold">Property type</label>-->
        <!--                            <select v-model="property.property_type" class="form-select" >-->
        <!--                                <option v-for="(property_type, index) in shapeConfig.property_types" :key="index" :value="index">-->
        <!--                                    {{property}}-->
        <!--                                </option>-->
        <!--                            </select>-->
        <!--                        </div>-->
                                <div class="form-property col-6">
                                    <label class="form-label fw-bold">{{$t('property.minCount')}}</label>
                                    <input type="number" v-model="property.minCount" class="form-control" :placeholder="0">
                                </div>
                                <div class="form-property col-6">
                                    <label class="form-label fw-bold">{{$t('property.maxCount')}}</label>
                                    <input type="number" v-model="property.maxCount" class="form-control" :placeholder="1">
                                </div>
                            </div>
                        </div>
                        <div class="form-property col-1 align-self-center">
                            <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeSettingRow('property',property.key)"></span>
                        </div>
                </div>
            </draggable>
        </div>
    </draggable>
    <button type="button" class="btn btn-info" v-on:click="addSettingRow('property',{'id':'','label':[],'group':getLastGroupId()})">{{ $t('property.add') }}</button>
    <button type="button" class="btn btn-info" v-on:click="addSettingRow('group',{'id':settings.shape.id+'#group'+settings.group.length,'label':[]})">{{ $t('group.add') }}</button>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import LabelField from '../field/LabelField.vue';
  import IdField from '../field/IdField.vue';
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
    inject: ['settings','shapeConfig'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const removeSettingRow = inject(removeSettingRowKey);
      const updateSettingField = inject(updateSettingFieldKey);

      if (updateSettingField === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        addSettingRow,
        removeSettingRow,
        updateSettingField
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
      }
    },
  });
</script>
