<template>
    <draggable class="dragArea list-property w-full m-2 mb-3" v-model="properties" handle=".handle">
        <div v-for="(property, index) in properties" :key="index" class="row border p-2">
            <div class="form-property col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move handle"></span>
            </div>
            <div class="form-property col-10">
                <div class="row">
                    <label-field :field="'property.'+index+'.label'" :list="property.label" :inline="false" />
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">sh:path</label>
                        <input type="text" v-model="property.path" class="form-control" :placeholder="$t('iri')">
                    </div>
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">sh:group</label>
                        <select v-model="property.group" class="form-select">
                            <option v-for="(group, index) in settings.group" :key="index" :value="group.id">
                                {{ (group.label[0] !== undefined) ? group.label[0].title : 'Undefined' }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">Property type</label>
                        <select v-model="property.property_type" class="form-select" >
                            <option v-for="(property_type, index) in shapeConfig.property_types" :key="index" :value="index">
                                {{index}}
                            </option>
                        </select>
                    </div>
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
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeSettingRow('property',index)"></span>
            </div>
        </div>
    </draggable>
    <button type="button" class="btn btn-info" v-on:click="addSettingRow('property',{'id':'','label':[]})">{{ $t('property.add') }}</button>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import LabelField from '../field/LabelField.vue';
  import { VueDraggableNext } from 'vue-draggable-next'
  import sortNestedArray from "@/mixins/sortNestedArray";
  import {addSettingRowKey, removeSettingRowKey} from "@/symbols/shape";

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
      LabelField
    },
    watch: {
      settings: {
        handler(newVal:any) {
          sortNestedArray('order',newVal.property);
          this.properties = newVal.property;
        },
        deep:true,
      },
    },
    inject: ['settings','shapeConfig'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const removeSettingRow = inject(removeSettingRowKey);

      return {
        addSettingRow,
        removeSettingRow
      };
    },
    data() {
      return {
        properties:[],
      }
    },
  });
</script>
