<template>
    <div class="modal fade" id="titleModal" tabindex="-1" aria-labelledby="titleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title" id="titleModalLabel">{{title}}</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Titel</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="shapeName" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-start">
                    <button type="button" class="btn btn-primary" @click="updateSettingField('name', shapeName)" data-bs-dismiss="modal">{{$t('button.add')}}</button>
                    <button type="button" class="btn btn-light btn-outline-dark" @click="resetForm" data-bs-dismiss="modal">{{$t('button.cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import {updateSettingFieldKey} from "@/symbols/shape";
  export default defineComponent({
    props: {
      title : {
        type: String,
        required: true
      }
    },
    watch: {
      settings: {
        handler(newVal:any) {
          this.shapeName = newVal.name;
          this.originalName = newVal.name;
        },
        deep:true,
      }
    },
    inject: ['settings'],
    setup() {
      const updateSettingField = inject(updateSettingFieldKey);
      return {
        updateSettingField
      };
    },
    data() {
      return {
        shapeName: '',
        originalName: '',
        showModal: false,
      }
    },
    methods: {
      resetForm () {
        this.shapeName = this.originalName;
      },
    },
  });
</script>
