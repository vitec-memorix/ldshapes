<template>
    <id-field field="shape.id" :value="settings.shape.id" />
    <label-field field="shape.label" :list="settings.shape.label" />
    <div class="row mb-3">
        <label class="col-sm-2 col-form-label">dc:identifier</label>
        <div class="col-sm-10">
            <input type="text" v-model="settings.shape.identifier" class="form-control" :placeholder="$t('shape.identifier')">
        </div>
    </div>
    <id-field field="shape.targetClass" fieldName="sh:targetClass" :value="settings.shape.targetClass" />
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
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import LabelField from '../field/LabelField.vue';
  import IdField from '../field/IdField.vue';
  import { validateAbsoluteIRI } from '@/mixins/validateShape';

  export default defineComponent({
    components: {
      LabelField,
      IdField
    },
    inject: ['settings'],
    methods: {
      validateAbsoluteIRI,
    },
  });


</script>
