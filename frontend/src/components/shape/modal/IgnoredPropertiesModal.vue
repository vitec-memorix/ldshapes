<template>
    <div class="modal fade" id="ignoredPropertiesModal" tabindex="-1" aria-labelledby="ignoredPropertiesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-ignoredProperties" id="ignoredPropertiesModalLabel">Ignored properties</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="container list-view mb-3">
                            <div v-for="(property, index) in settings.shape.ignoredProperties" :key="index" class="row">
                                <div class="col-sm-10">
                                    {{ getShorthandFromFullIri(property) }}
                                </div>
                                <div class="col-sm-2 pe-0 p-1 text-md-end">
                                    <span class="btn btn-light btn-outline-dark ms-3 bi-trash" v-on:click="removeSettingRow('shape.ignoredProperties',index)"></span>
                                </div>
                            </div>
                        </div>
                        <id-field field="shape.ignoredProperties" fieldName="Property" altertype="add" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import IdField from '../field/IdField.vue';
  import {removeSettingRowKey, getShorthandFromFullIriKey} from "@/symbols/shape";

  export default defineComponent({
    components: {
      IdField,
    },
    inject: ['settings'],
    setup() {
      const removeSettingRow = inject(removeSettingRowKey);
      const getShorthandFromFullIri = inject(getShorthandFromFullIriKey);

      if (removeSettingRow === undefined || getShorthandFromFullIriKey === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        removeSettingRow,
        getShorthandFromFullIri,
      };
    },
  });
</script>
