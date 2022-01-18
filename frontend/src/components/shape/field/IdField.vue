<template>
    <div :class="inline === true ? 'row mb-3' : 'form-property col-12'">
        <label :class="inline === true ? 'col-sm-2 col-form-label' : 'form-label small-form-label'" >
            {{fieldName}}
        </label>
        <div :class="inline === true ? 'col-sm-10' : ''">
            <Field type="text" :name="'idfield_'+field" v-model="field_value" @input="updateSettingField(field, field_value)" :rules="validateAbsoluteIRI" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage :name="'idfield_'+field" class="error-message" />
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue';
  import {validateAbsoluteIRI} from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import {updateSettingFieldKey} from "@/symbols/shape";

  export default defineComponent({
    name: 'IdField',
    components: {
      ErrorMessage,
      Field,
    },
    props: {
      field: {
        type: String,
        required:true,
      },
      fieldName: {
        type: String,
        default: 'id'
      },
      value: {
        type: String,
      },
      inline: {
        type: Boolean,
        default: true
      }
    },
    inject: ['settings'],
    data() {
      return {
        field_value:this.value,
      }
    },
    watch: {
      settings: {
        handler(newVal:any) {
          var pList = this.field.split('.');
          var len = pList.length;
          for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !newVal[elem] ) newVal[elem] = {}
            newVal = newVal[elem];
          }
          this.field_value = newVal[pList[len-1]];
        },
        deep:true,
      },
    },
    setup() {
      const updateSettingField = inject(updateSettingFieldKey);

      return {
        updateSettingField,
      };
    },
    methods: {
      validateAbsoluteIRI,

    },
  });
</script>
