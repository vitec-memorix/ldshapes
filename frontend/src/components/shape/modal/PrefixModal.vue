<template>
    <div class="modal fade" id="rdfsPrefixModal" tabindex="-1" aria-labelledby="titleModalPrefix" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title" id="titleModalPrefix">{{ $t('AddPrefix') }}</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Prefix</label>
                            <div class="col-sm-10">
                                <Field type="text" v-model="this.generalConfig.prefixId" name="new-prefix-prefix" class="form-control" :rules="validatePrefix" :placeholder="$t('prefix')" />
                                <ErrorMessage name="new-prefix-prefix" class="error-message" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Path</label>
                            <div class="col-sm-10">
                                <Field type="text" v-model="new_path" name="new-prefix-id" :rules="validateAbsoluteIRI" class="form-control" :placeholder="$t('iri')" />
                                <ErrorMessage name="new-prefix-id" class="error-message" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-start">
                    <button type="button" class="btn btn-primary" @click="saveValue" data-bs-dismiss="modal">{{$t('button.add')}}</button>
                    <button type="button" class="btn btn-light btn-outline-dark" @click="resetForm" data-bs-dismiss="modal">{{$t('button.cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import { ErrorMessage, Field } from 'vee-validate';
  import {addSettingRowKey} from "@/symbols/shape";
  import {validateAbsoluteIRI, validatePrefix} from "@/mixins/validateShape";
  export default defineComponent({
    components: { ErrorMessage, Field },
    inject: ['settings'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const generalConfig :any = inject('generalConfig');

      if (addSettingRow === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        addSettingRow,
        generalConfig
      };
    },
    data() {
      return {
        new_path:'',
      }
    },
    methods: {
      validateAbsoluteIRI,
      validatePrefix,
      resetForm () {
        this.generalConfig['prefixId'] = '';
        this.new_path = '';
      },
      saveValue() {
        if(this.new_path !== '' && validateAbsoluteIRI(this.new_path) === true && this.generalConfig['prefixId'] !== '' && validatePrefix(this.generalConfig['prefixId']) === true) {
          this.addSettingRow('prefix', {'id': this.new_path, 'prefix': this.generalConfig['prefixId']});
        }
        this.resetForm();
      }
    },
  });
</script>
