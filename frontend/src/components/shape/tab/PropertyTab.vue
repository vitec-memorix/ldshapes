<template>
    <draggable class="dragArea list-property w-full m-2 mb-3" :list="property" handle=".handle">
        <div v-for="(property, index) in value" :key="index" class="row border p-2">
            <div class="form-property col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move handle"></span>
            </div>
            <div class="form-property col-10">
                <div class="row">
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">rdfs:label</label>
                        <div class="input-group">
                            <div class="labelinput-container form-control">
                                <span v-for="(label, propertyindex) in property.label" :key="propertyindex" class="labelinput rounded-3">
                                    {{label.title}}:<span class="language">{{label.language}}</span> <span class="bi-x-lg" v-on:click="removeRow(propertyindex,'property.' + index + '.label')"></span>
                                </span>
                            </div>
                            <button class="btn btn-primary pe-4 ps-4" type="button" data-bs-toggle="modal" data-bs-target="#rdfsLabelModal"  @click="setModalField('settings.property.'+index+'.label')">Add</button>
                        </div>
                    </div>
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">sh:path</label>
                        <input type="text" :value="property.path" @input="saveValue('path',index, $event.target.value)" class="form-control" :placeholder="$t('iri')">
                    </div>
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">sh:group</label>
                        <select :value="property.group !== '' ? property.group : settings.group[0].id " @input="saveValue('group', index, $event.target.value)" class="form-select">
                            <option v-for="(group, index) in settings.group" :key="index" :value="group.id">
                                {{ (group.label[0] !== undefined) ? group.label[0].title : 'Undefined' }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="form-property col-12">
                        <label class="form-label fw-bold">Property type</label>
                        <select :value="property.property_type" @input="saveValue('property_type', index, $event.target.value)" class="form-select" >
                            <option v-for="(property_type, index) in config.property_types" :key="index" :value="index">
                                {{index}}
                            </option>
                        </select>
                    </div>
                    <div class="form-property col-6">
                        <label class="form-label fw-bold">{{$t('property.minCount')}}</label>
                        <input type="number" :value="property.minCount" @input="saveValue('minCount',index, $event.target.value)" class="form-control" :placeholder="0">
                    </div>
                    <div class="form-property col-6">
                        <label class="form-label fw-bold">{{$t('property.maxCount')}}</label>
                        <input type="number" :value="property.maxCount" @input="saveValue('maxCount',index, $event.target.value)" class="form-control" :placeholder="1">
                    </div>
                </div>
            </div>
            <div class="form-property col-1 align-self-center">
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeRow(index,'property')"></span>
            </div>
        </div>
    </draggable>
    <button type="button" class="btn btn-info" v-on:click="addProperty()">{{ $t('property.add') }}</button>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import { VueDraggableNext } from 'vue-draggable-next'
  import shapeConfig from '../../../../../resources/shapes/config.json';
  import sortNestedArray from "@/mixins/sortNestedArray";

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    props: {
      value: {
        type: Object,
        required: true
      },
      settings : {
        type: Object,
        required: true
      }
    },
    watch: {
      value: function(newVal) {
        sortNestedArray('order',newVal);
        this.property = newVal;
      }
    },
    data() {
      return {
        property:this.value,
        config: shapeConfig,
      }
    },
    emits: ['saveValue','setModalField'],
    methods: {
      saveValue (field:string, index:string, newValue:any) {
        this.property[index][field] = newValue;
        this.$emit('saveValue', 'property', index, this.property[index])
      },
      addProperty () {
        this.$emit('saveValue', 'property', this.property.length, {});
      },
      removeRow: function(index:any,object:any) {
        var thisObject = (object).split('.').reduce((p:any, c:any) => p && p[c] || null, this);
        if(Number.isInteger(index)) {
          thisObject.splice(index, 1);
        } else {
          delete thisObject[index];
        }
      },
      setModalField: function(field:string) {
        this.$emit('setModalField', field);
      },
    },
  });
</script>
