<template>
    <id-field field="shape.id" />
    <label-field field="shape.label" :list="settings.shape.label" />
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">dc:identifier</label>
        <div class="col-sm-10">
            <Field type="text" name="dc_identifier" v-model="settings.shape.identifier" @blur="addFilenameByIdentifier" :rules="validateIdentifier" class="form-control" :placeholder="$t('shape.identifier')"/>
            <ErrorMessage name="dc_identifier" class="error-message" />
       </div>
    </div>
    <id-field field="shape.targetClass" fieldName="sh:targetClass" />
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">rdfs:comment</label>
        <div class="col-sm-10">
            <textarea v-model="settings.shape.comment" class="form-control" :placeholder="$t('shape.comment')"></textarea>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-sm-10 offset-sm-2">
            <div class="form-check form-switch">
                <input class="form-check-input" v-model="settings.shape.memorixCompatible" type="checkbox" id="flexSwitchCheckDefault" :checked="settings.shape.memorixCompatible === true">
                <label class="form-check-label" for="flexSwitchCheckDefault">{{ $t('memorixCompatible') }}</label>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import LabelField from '../field/LabelField.vue';
  import IdField from '../field/IdField.vue';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import {updateSettingFieldKey} from "@/symbols/shape";

  export default defineComponent({
    components: {
      LabelField,
      IdField,
      ErrorMessage,
      Field
    },
    setup() {
      const updateSettingField = inject(updateSettingFieldKey);
      const settings :any = inject('settings');

      if (updateSettingField === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        updateSettingField,
        settings
      };
    },
    methods: {
      validateAbsoluteIRI,
      addFilenameByIdentifier() {
        //if the name of the file is still New Shape. Change the name.
        if(this.settings.name === 'New shape') {
          this.updateSettingField('name',this.settings.shape.identifier);
        }
      },

      validateIdentifier(value:string): string | boolean {
        // if the field is empty. No need to check the value
        if (!value) {
          return true;
        }
        // if the field is not a valid absolute IRI
        const regex = new RegExp('^[A-Z][a-zA-Z]+$');
        // const regex = new RegExp('^[a-z](?:[-a-z0-9\\+\\.])*$');
        if (!regex.test(value)) {
          // return t('validate.absoluteIri');
          return 'Dit is geen geldige identifier';
        }
        // All is good
        return true;
      }
    },
  });


</script>
