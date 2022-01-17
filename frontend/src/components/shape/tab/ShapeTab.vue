<template>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">id</label>
        <div class="col-sm-10">
            <Field type="text" name="shape-id" :rules="validateAbsoluteIRI" v-model="settings.shape.id" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage name="shape-id" class="error-message" />
        </div>
    </div>
    <label-field field="shape.label" :list="settings.shape.label" />
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">dc:identifier</label>
        <div class="col-sm-10">
            <input type="text" v-model="settings.shape.identifier" class="form-control" :placeholder="$t('shape.identifier')">
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">sh:targetClass</label>
        <div class="col-sm-10">
            <input type="text" v-model="settings.shape.targetClass" class="form-control" :placeholder="$t('shape.target_class')">
        </div>
    </div>
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">rdfs:comment</label>
        <div class="col-sm-10">
            <textarea :value="settings.shape.comment" class="form-control" :placeholder="$t('shape.comment')"></textarea>
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
<!--    <label-modal :value="shape.label" :title="$t('AddLabel')" field="label"/>-->
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import LabelField from '../field/LabelField.vue';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';

  export default defineComponent({
    components: {
      ErrorMessage,
      Field,
      LabelField
    },
    inject: ['settings'],
    methods: {
      validateAbsoluteIRI,
    },
  });


</script>
