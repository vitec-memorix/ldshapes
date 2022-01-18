<template>
    <draggable class="dragArea list-group w-full m-2 mb-3" v-model="groups" handle=".handle">
        <div v-for="(group, index) in groups" :key="index" class="row border p-2">
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-info btn-sm bi-arrows-move handle"></span>
            </div>
            <div class="form-group col-10">
                <div class="row">
                    <div class="form-group col-12">
                        <id-field :field="'group.'+index+'.id'" :value="group.id" />
                        <label-field :field="'group.'+index+'.label'" :list="group.label" />
                    </div>
                </div>
            </div>
            <div class="form-group col-1 align-self-center">
                <span class="btn btn-danger btn-sm bi-trash" v-on:click="removeSettingRow('group',index)"></span>
            </div>
        </div>
    </draggable>
    <button type="button" class="btn btn-info" v-on:click="addSettingRow('group',{'id':'','label':[]})">{{ $t('group.add') }}</button>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import LabelField from '../field/LabelField.vue';
  import IdField from '../field/IdField.vue';
  import { VueDraggableNext } from 'vue-draggable-next';
  import sortNestedArray from '@/mixins/sortNestedArray';
  import {addSettingRowKey, removeSettingRowKey} from "@/symbols/shape";

  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
      LabelField,
      IdField,
    },
    watch: {
      settings: {
        handler(newVal:any) {
          sortNestedArray('order',newVal.group);
          this.groups = newVal.group;
        },
        deep:true,
      },
    },
    inject: ['settings'],
    data() {
      return {
        groups:[],
        current_type:'',
        labelIndex:1,
      }
    },
    setup() {
      const addSettingRow = inject(addSettingRowKey);
      const removeSettingRow = inject(removeSettingRowKey);

      return {
        addSettingRow,
        removeSettingRow
      };
    },
  });
</script>
