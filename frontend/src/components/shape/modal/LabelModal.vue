<template>
    <div class="modal fade" id="rdfsLabelModal" tabindex="-1" aria-labelledby="labelModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title" id="labelModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Label</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="label" class="form-control">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Language</label>
                            <div class="col-sm-10">
                                <select v-model="language" class="form-select" >
                                    <option v-for="(language, index) in shapeConfig.languages" :key="index" :value="index">
                                        {{ language }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-start">
                    <button type="button" class="btn btn-primary" @click="addSettingRow(generalConfig.modalField,{'title':label,'language':language}); resetForm()" data-bs-dismiss="modal">{{$t('button.add')}}</button>
                    <button type="button" class="btn btn-light btn-outline-dark" @click="resetForm()" data-bs-dismiss="modal">{{$t('button.cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import {addSettingRowKey} from "@/symbols/shape";
  export default defineComponent({
    props: {
      title : {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showModal: false,
        label:'',
        language:'nl',
      }
    },
    inject: ['generalConfig','shapeConfig'],
    setup() {
      const addSettingRow = inject(addSettingRowKey);

      return {
        addSettingRow
      };
    },
    methods: {
      resetForm () {
        this.label = '';
        this.language = 'nl';
      },
    },
  });
</script>
