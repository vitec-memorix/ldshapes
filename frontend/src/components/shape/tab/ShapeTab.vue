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
            <div class="input-group">
                <div class="labelinput-container form-control">
                    <span v-for="(label, index) in shape.label" :key="index" class="labelinput rounded-3">
                        {{label.title}}:<span class="language">{{label.language}}</span> <span class="bi-x-lg" v-on:click="removeRow(index,'shape.label')"></span>
                    </span>
                </div>
                <button class="btn btn-primary pe-4 ps-4" type="button" data-bs-toggle="modal" data-bs-target="#rdfsLabelModal"  @click="setModalField('settings.shape.label')">Add</button>
            </div>
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
<!--    <label-modal :value="shape.label" :title="$t('AddLabel')" field="label"/>-->
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  // import LabelModal from './modal/LabelModal.vue';
  // import transformString from '@/mixins/transformString';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import shapeConfig from '../../../../../resources/shapes/config.json';

  export default defineComponent({
    components: {
      ErrorMessage,
      Field,
      // LabelModal
    },
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
    emits: ['saveValue','setModalField'],
    methods: {
      validateAbsoluteIRI,
      saveValue (index:string, newValue:any) {
        this.$emit('saveValue', 'shape', index, newValue)
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
