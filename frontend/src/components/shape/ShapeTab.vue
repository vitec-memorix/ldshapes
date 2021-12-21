<template>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">id</label>
        <div class="col-sm-10">
            <Field type="text" name="shape-id" :rules="validateAbsoluteIRI" v-model="shape.id" @input="saveValue('id', $event.target.value)" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage name="shape-id" class="error-message" />
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">rdfs:label</label>
        <div class="col-sm-10">
            <input type="text" v-model="shape.label" @input="saveValue('label', $event.target.value)" class="form-control" :placeholder="$t('shape.label')" >
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">language</label>
        <div class="col-sm-10">
            <select :value="shape.language" @input="saveValue('language', $event.target.value)" class="form-select" >
                <option v-for="(language, index) in config.languages" :key="index" :value="language">
                    {{language}}
                </option>
            </select>
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">dc:identifier</label>
        <div class="col-sm-10">
            <input type="text" v-model="shape.identifier" @input="saveValue('identifier', $event.target.value)" class="form-control" :placeholder="$t('shape.identifier')">
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">sh:targetClass</label>
        <div class="col-sm-10">
            <input type="text" v-model="shape.targetClass" @input="saveValue('targetClass', $event.target.value)" class="form-control" :placeholder="$t('shape.target_class')">
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">rdfs:comment</label>
        <div class="col-sm-10">
            <textarea :value="shape.comment" @input="saveValue('comment', $event.target.value)" class="form-control" :placeholder="$t('shape.comment')"></textarea>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-sm-10 offset-sm-2">
            <div class="form-check form-switch">
                <input class="form-check-input" v-model="shape.memorixCompatible" @input="saveValue('memorixCompatible', $event.target.value)" type="checkbox" id="flexSwitchCheckDefault" :checked="shape.memorixCompatible === true">
                <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('memorixCompatible') }}</label>
            </div>
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
    },
  });
</script>
