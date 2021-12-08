<template>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">prefixes</label>
            <div class="list-group border-top mb-2">
                <div v-for="(prefix, index) in prefixes" :key="index" class="border-top-0 border p-2 pb-1 pt-1 bg-light align-middle">
                    <span class="btn btn-danger btn-sm bi-trash float-end" v-if="!isDefaultPrefix(prefix.id)" v-on:click="removeRow(index,'prefixes')"></span>
                    <span class="align-middle">{{ prefix.prefix }} &lt;{{ prefix.id }}&gt;</span>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="form-property col-3">
            <label class="form-label fw-bold">Prefix</label>
        </div>
        <div class="form-property col-8">
            <label class="form-label fw-bold">Path</label>
        </div>
    </div>
    <div class="row">
        <div class="form-property col-3">
            <Field type="text" v-model="new_prefix" name="new-prefix-prefix" class="form-control" :rules="validatePrefix" :placeholder="$t('prefix')" />
            <ErrorMessage name="new-prefix-prefix" class="error-message" />
        </div>
        <div class="form-property col-8">
            <Field type="text" v-model="new_id" name="new-prefix-id" :rules="validateAbsoluteIRI" class="form-control" :placeholder="$t('iri')" />
            <ErrorMessage name="new-prefix-id" class="error-message" />
        </div>
        <div class="form-property col-1 mt-1">
            <span class="btn btn-success btn-sm bi-plus-lg" @click="saveValue()"></span>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  // // import transformString from '@/mixins/transformString';
  import { validateAbsoluteIRI, validatePrefix } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import shapeConfig from '../../../../resources/shapes/config.json';
  //
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
        this.prefixes = newVal;
      }
    },
    data() {
      return {
        prefixes:this.value,
        config:shapeConfig,
        new_prefix:'',
        new_id:'',
      }
    },
    emits: ['saveValue'],
    methods: {
      validateAbsoluteIRI,
      validatePrefix,
      saveValue () {
        const index = this.prefixes.length;
        //when adding new prefixes dubble check format and filled
        if(this.new_id !== '' && validateAbsoluteIRI(this.new_id) === true && this.new_prefix !== '' && validatePrefix(this.new_prefix) === true){
          this.prefixes.push({
            'prefix' : this.new_prefix,
            'id' : this.new_id,
          });
          this.$emit('saveValue', 'prefix', index, this.prefixes[index]);
          this.new_id = '';
          this.new_prefix = '';
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
      isDefaultPrefix(value:any) {
        return Object.values(this.config.default_prefixes).includes(value);
      }
    },
  });
</script>
