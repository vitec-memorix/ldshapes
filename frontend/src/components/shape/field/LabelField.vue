<template>
    <div :class="inline === true ? 'row mb-3' : 'form-property col-12'">
        <label :class="inline === true ? 'col-sm-2 col-form-label' : 'form-label small-form-label'" >
            {{fieldName}}
        </label>
        <div :class="inline === true ? 'col-sm-10' : ''">
            <div class="input-group">
                <div class="labelinput-container form-control">
                    <span v-for="(label, index) in list" :key="index" class="labelinput rounded-3">
                        {{label.title}}:<span class="language">{{label.language}}</span> <span class="bi-x-lg remove-record" v-on:click="removeSettingRow(field,index)"></span>
                    </span>
                </div>
                <button class="btn btn-primary pe-4 ps-4" type="button" data-bs-toggle="modal" data-bs-target="#rdfsLabelModal" @click="updateSettingField('modalField',field)">Add</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue'
  import {removeSettingRowKey, updateSettingFieldKey} from "@/symbols/shape";

  export default defineComponent({
    name: 'LabelField',
    props: {
      field: {
        type: String,
        required:true,
      },
      list: {
        type: Object,
      },
      fieldName: {
        type: String,
        default: 'rdfs:label'
      },
      inline: {
        type: Boolean,
        default: true
      }
    },
    inject: ['settings'],
    setup() {
      const updateSettingField = inject(updateSettingFieldKey);
      const removeSettingRow = inject(removeSettingRowKey);

      return {
        updateSettingField,
        removeSettingRow
      };
    },
  });
</script>
