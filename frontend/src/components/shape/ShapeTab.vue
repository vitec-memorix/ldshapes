<template>

    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">id</label>
            <Field type="text" name="shape-id" :rules="validateAbsoluteIRI" v-model="shape.id" @input="saveValue('id', $event.target.value)" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage name="shape-id" class="error-message" />
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">rdfs:label</label>
            <input type="text" v-model="shape.label" @input="saveValue('label', $event.target.value)" class="form-control" :placeholder="$t('shape.label')" >
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">language</label>
            <select :value="shape.language" @input="saveValue('language', $event.target.value)" class="form-select" >
                <option v-for="(language, index) in config.languages" :key="index" :value="language">
                    {{language}}
                </option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">dc:identifier</label>
            <input type="text" v-model="shape.identifier" @input="saveValue('identifier', $event.target.value)" class="form-control" :placeholder="$t('shape.identifier')">
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">sh:targetClass</label>
            <input type="text" v-model="shape.targetClass" @input="saveValue('targetClass', $event.target.value)" class="form-control" :placeholder="$t('shape.target_class')">
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">rdf:type</label>
            <div class="list-group border-top mb-2">
                <div v-for="(data, index) in shape.type" :key="index" class="border-top-0 border p-2 pb-1 pt-1 bg-light">
                    {{data}}
                    <span class="btn btn-danger btn-sm bi-trash" v-if="data !== 'sh:NodeShape'" v-on:click="removeRow(index,'shape.type')"></span>
                </div>
            </div>

            <select v-model="current_type" @change="savePicklist('type', $event.target.value)" class="form-select" >
                <option value="">{{ $t('shape.pick_node') }}</option>
                <option v-for="(type, index) in config.rdf_shape_classes" :key="index" :value="type" v-show="shape.type === undefined || (shape.type !== undefined && !shape.type.includes(type))">
                    {{type}}
                </option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">rdfs:comment</label>
            <textarea :value="shape.comment" @input="saveValue('comment', $event.target.value)" class="form-control" :placeholder="$t('shape.comment')">
            </textarea>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  // import transformString from '@/mixins/transformString';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import shapeConfig from '../../../../resources/shapes/config.json';

  export default defineComponent({
    components: { ErrorMessage, Field },
    props: {
      value: {
        type: Object,
        required:true,
      }
    },
    watch: {
      value: function(newVal) {
        this.shape = newVal;
      }
    },
    data() {
      return {
        shape:this.value,
        current_type:'',
        config: shapeConfig,
      }
    },
    emits: ['saveValue'],
    methods: {
      validateAbsoluteIRI,
      saveValue (index:string, newValue:any) {
        this.$emit('saveValue', 'shape', index, newValue)
      },
      savePicklist (index:string, newValue:any) {
        if(newValue !== '') {
          if(this.shape[index] === undefined) {
            this.shape[index] = [];
          }
          this.shape[index].push(newValue);
          this.$emit('saveValue', 'shape', index, this.shape[index])
          this.current_type = '';
        }
      },
      removeRow: function(index:any,object:any) {
        var thisObject = (object).split('.').reduce((p:any, c:any) => p && p[c] || null, this);
        if(Number.isInteger(index)) {
          thisObject.splice(index, 1);
        } else {
          delete thisObject[index];
        }
      },
    },
  });
</script>
