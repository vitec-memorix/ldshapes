<template>
    <div class="container list-view mb-3">
        <div>
            <div class="row">
                <div class="col-sm-2 small-form-label">
                    Prefix
                </div>
                <div class="col-sm-10 small-form-label">
                    Path
                </div>
            </div>
            <div v-for="(prefix, index) in settings.prefix" :key="index" class="row">
                <div class="col-sm-2">
                    {{ prefix.prefix }}
                </div>
                <div class="col-sm-7">
                    &lt;{{ prefix.id }}&gt;
                </div>
                <div class="col-sm-3 pe-0 p-1 text-end">
                    <span class="btn btn-light btn-outline-dark ms-3 bi-trash" v-if="!isDefaultPrefix(prefix.id)" v-on:click="removeSettingRow('prefix',index)"></span>
                </div>
            </div>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-sm-12">
            <button class="btn btn-light btn-outline-dark pe-4 ps-4" type="button" data-bs-toggle="modal" data-bs-target="#rdfsPrefixModal">Add prefix</button>
        </div>
    </div>

</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import {removeSettingRowKey} from "@/symbols/shape";

  export default defineComponent({
    inject: ['settings'],
    setup() {
      const removeSettingRow = inject(removeSettingRowKey);
      const shapeConfig :any = inject('shapeConfig');

      return {
        removeSettingRow,
        shapeConfig
      };
    },
    methods: {
      isDefaultPrefix(value:any) {
        return Object.values(this.shapeConfig.default_prefixes).includes(value);
      },
    },
  });
</script>
