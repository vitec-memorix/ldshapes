<template>
    <div class="row">
        <div class="form-group col-12">
            <label class="form-label fw-bold">prefixes</label>
            <div class="list-group border-top mb-2">
                <div v-for="(prefix, index) in settings.prefix" :key="index" class="border-top-0 border p-2 pb-1 pt-1 bg-light align-middle">
                    <span class="btn btn-danger btn-sm bi-trash float-end" v-if="!isDefaultPrefix(prefix.id)" v-on:click="removeSettingRow('prefix',index)"></span>
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
            <span class="btn btn-success btn-sm bi-plus-lg" @click="saveValue"></span>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import { validateAbsoluteIRI, validatePrefix } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import {addSettingRowKey, removeSettingRowKey} from "@/symbols/shape";

  export default defineComponent({
    components: { ErrorMessage, Field },
    inject: ['settings'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const removeSettingRow = inject(removeSettingRowKey);
      const shapeConfig :any = inject('shapeConfig');

      if (addSettingRow === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        addSettingRow,
        removeSettingRow,
        shapeConfig
      };
    },
    data() {
      return {
        new_prefix:'',
        new_id:'',
      }
    },
    methods: {
      validateAbsoluteIRI,
      validatePrefix,
      isDefaultPrefix(value:any) {
        return Object.values(this.shapeConfig.default_prefixes).includes(value);
      },
      saveValue() {
        if(this.new_id !== '' && validateAbsoluteIRI(this.new_id) === true && this.new_prefix !== '' && validatePrefix(this.new_prefix) === true) {
          this.addSettingRow('prefix', {'id': this.new_id, 'prefix': this.new_prefix});
        }
      }
    },
  });
</script>
