<template>
    <draggable class="dragArea list-group w-full m-2 mb-3" :list="group" handle=".handle">
        <div v-for="(group, index) in value" :key="index" class="row border p-2">
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move handle"></span>
            </div>
            <div class="form-group col-10">
                <div class="row">
                    <div class="form-group col-12">
                        <label class="form-label fw-bold">id</label>
                        <Field type="text" :name="'group-id-'+index" :rules="validateAbsoluteIRI" :value="group.id" @input="saveValue('id', index, $event.target.value)" class="form-control" :placeholder="$t('iri')"/>
                        <ErrorMessage :name="'group-id-'+index" class="error-message" />
                    </div>
                    <div class="form-group col-12">
                        <label class="form-label fw-bold">rdfs:label</label>
                        <input type="text" :value="group.label" @input="saveValue('label',index, $event.target.value)" class="form-control" :placeholder="$t('group.label')">
                    </div>
                </div>
            </div>
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeGroup(index)"></span>
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
  import shapeConfig from '../../../../resources/shapes/config.json';

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
        this.group = newVal;
      }
    },
    data() {
      return {
        group:this.value,
        current_type:'',
        config: shapeConfig,
      }
    },
    emits: ['saveValue'],
    methods: {
      validateAbsoluteIRI,
      saveValue (field:any, index:any, newValue:any) {
        this.group[index][field] = newValue;
        this.$emit('saveValue', 'group', index, this.group[index])
      },
      addGroup () {
        this.$emit('saveValue', 'group', this.group.length, {});
      },
      removeGroup: function(index:number) {
        this.group.splice(index, 1);
        if(this.group.length < 1) {
          this.addGroup();
        }
      },
    },
  });
</script>
