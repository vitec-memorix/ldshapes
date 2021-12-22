<template>
    <div class="modal fade" id="titleModal" tabindex="-1" aria-labelledby="titleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title" id="titleModalLabel">{{modalTitle}}</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Titel</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="title" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-start">
                    <button type="button" class="btn btn-primary" @click="addValueToField" data-bs-dismiss="modal">{{ $t('save') }}</button>
                    <button type="button" class="btn btn-light btn-outline-dark" @click="resetForm" data-bs-dismiss="modal">{{$t('button.cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import shapeConfig from '../../../../../resources/shapes/config.json';
  // import transformString from '@/mixins/transformString';
  // import { VueDraggableNext } from 'vue-draggable-next';
  // import { validateAbsoluteIRI } from '@/mixins/validateShape';
  // import { ErrorMessage, Field } from 'vee-validate';
  // import sortNestedArray from '@/mixins/sortNestedArray';
  // import shapeConfig from '../../../../resources/shapes/config.json';
  //
  export default defineComponent({
  //   components: { draggable: VueDraggableNext, ErrorMessage, Field },
    props: {
      value: {
        type: String,
        required: true
      },
      modalTitle : {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showModal: false,
        config:shapeConfig,
        title:this.value,
      }
    },
    watch: {
      value: function(newVal:any) {
        this.title = newVal;
      }
    },
    emits: ['saveValue'],
    methods: {
      resetForm () {
        this.title = this.value;
      },
      addValueToField() {
        this.$emit('saveValue', 'name', this.title)
      },
    },
  });
</script>
