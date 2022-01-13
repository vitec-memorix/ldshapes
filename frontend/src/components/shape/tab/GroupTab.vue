<template>
    <draggable class="dragArea list-group w-full m-2 mb-3" :list="groups" handle=".handle">
        <div v-for="(group, index) in groups" :key="index" class="row border p-2">
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move handle"></span>
            </div>
            <div class="form-group col-10">
                <div class="row">
                    <div class="form-group col-12">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">id</label>
                            <div class="col-sm-10">
                                <Field type="text" :name="'group-id-'+index" v-model="group.id" :rules="validateAbsoluteIRI" @input="saveValue('id', index, $event.target.value)" class="form-control" :placeholder="$t('iri')"/>
                                <ErrorMessage :name="'group-id-'+index" class="error-message" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">rdfs:label</label>
                            <div class="col-sm-10">
                                <div class="input-group">
                                    <div class="labelinput-container form-control">
                                        <span v-for="(label, groupindex) in group.label" :key="groupindex" class="labelinput rounded-3">
                                            {{label.title}}:<span class="language">{{label.language}}</span> <span class="bi-x-lg" v-on:click="removeRow(groupindex,'groups.' + index + '.label')"></span>
                                        </span>
                                    </div>
                                    <button class="btn btn-primary pe-4 ps-4" type="button" data-bs-toggle="modal" data-bs-target="#rdfsLabelModal" @click="setModalField('settings.group.' + index + '.label')">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeRow(index,'groups')"></span>
            </div>
        </div>
    </draggable>
    <button type="button" class="btn btn-info" v-on:click="addGroup()">{{ $t('group.add') }}</button>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import { VueDraggableNext } from 'vue-draggable-next';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import sortNestedArray from '@/mixins/sortNestedArray';
  import shapeConfig from '../../../../../resources/shapes/config.json';

  export default defineComponent({
    components: { draggable: VueDraggableNext, ErrorMessage, Field },
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    watch: {
      value: function(newVal:any) {
        sortNestedArray('order',newVal);
        this.groups = newVal;
      }
    },
    data() {
      return {
        groups:this.value,
        current_type:'',
        config: shapeConfig,
        labelIndex:1,
      }
    },
    emits: ['saveValue','setModalField'],
    methods: {
      validateAbsoluteIRI,
      saveValue (field:any, index:any, newValue:any) {
        this.groups[index][field] = newValue;
        this.$emit('saveValue', 'group', index, this.groups[index])
      },
      addGroup () {
        this.$emit('saveValue', 'group', this.groups.length, {});
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
