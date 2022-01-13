<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-sm-8 page-header">
                <a href="/shape/pick">Shape creator</a> / {{settings.name}} <button class="btn btn-link p-0 align-bottom" type="button" data-bs-toggle="modal" data-bs-target="#titleModal"><span class="bi-edit"></span></button>
            </div>
            <div class="col-sm-4 text-end" v-show="getActiveTab() === 'shape' ">
                <button class="btn btn-primary" @click="showValues">Test</button>
                <button class="btn btn-primary" @click="chooseAndRedirect('')"><span class="bi-plus-lg"></span> {{ $t('beginNewShape') }}</button>
                <button class="btn btn-primary disabled ms-3" disabled="true"><span class="bi-upload"></span> Import</button>
            </div>
        </div>
        <div class="col-md-12 form-wrapper">
            <Form id="app" @submit="onSubmit">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" @click="setCurrentTab('shape')" id="shape-tab" data-bs-toggle="tab" data-bs-target="#shape" ref="shapeTab" type="button" role="tab" aria-controls="home" aria-selected="true">Shape</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="prefix-tab" @click="setCurrentTab('prefix')" data-bs-toggle="tab" data-bs-target="#prefix" ref="prefixTab" type="button" role="tab" aria-controls="prefix" aria-selected="false">Prefixes</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="group-tab" @click="setCurrentTab('group')" data-bs-toggle="tab" data-bs-target="#group" ref="groupTab" type="button" role="tab" aria-controls="group" aria-selected="false">Groups</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="property-tab" @click="setCurrentTab('property')" data-bs-toggle="tab" data-bs-target="#property" ref="propertyTab" type="button" role="tab" aria-controls="property" aria-selected="false">Properties</button>
                    </li>
                </ul>
                <div class="tab-content p-2 border-start pb-5" id="myTabContent">
                    <div class="tab-pane fade show active" id="shape" role="tabpanel" aria-labelledby="shape-tab">
                        <shape-tab :value="settings.shape" @setModalField="setCurrentModalField"/>
                    </div>
                    <div class="tab-pane fade" id="prefix" role="tabpanel" aria-labelledby="prefix-tab">
                        <prefix-tab :value="settings.prefix" />
                    </div>
                    <div class="tab-pane fade" id="group" role="tabpanel" aria-labelledby="group-tab">
                        <group-tab :value="settings.group" @setModalField="setCurrentModalField" />
                    </div>
                    <div class="tab-pane fade" id="property" role="tabpanel" aria-labelledby="property-tab">
                        <property-tab :value="settings.property" @setModalField="setCurrentModalField" :settings="settings"/>
                        <div class="pt-3">
                            <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
                        </div>
                    </div>
                </div>
                <title-modal :value="settings.name" @saveValue="saveValue" :modal-title="$t('ChangeTitle')"/>
                <label-modal @saveValue="addLabel" :title="$t('AddLabel')" :field="currentModalField"/>
            </Form>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import axios from "axios";
  import { server } from "../../helper";
  import ShapeTab from './tab/ShapeTab.vue';
  import PrefixTab from './tab/PrefixTab.vue';
  import GroupTab from './tab/GroupTab.vue';
  import PropertyTab from './tab/PropertyTab.vue';
  import TitleModal from './modal/TitleModal.vue';
  import LabelModal from './modal/LabelModal.vue';
  import { Form } from 'vee-validate';
  import shapeConfig from '../../../../resources/shapes/config.json';

  const settings: any = {name:'', shape:{}, prefix:[], group:[], property:[]};

  export default defineComponent({
    el: '#app',
    components: {
      ShapeTab, PrefixTab, GroupTab, PropertyTab, TitleModal, LabelModal, Form },
    data() {
      return {
        currentModalField:'',
        currentTab:'shape',
        optionalPrefixes: {},
        listPrefix: '',
        config:shapeConfig,
        settings: settings
      }
    },
    async created() {
      this.settings = await this.fetchShapeSettings();
    },
    methods: {
      async fetchShapeSettings() {
        let sourceShape = sessionStorage.getItem('sourceShape');

        if(sourceShape === null || sourceShape === '' || sourceShape === undefined ) {
          sourceShape = 'new';
        }
        return await axios.get(encodeURI(`${server.baseURL}/shape/${sourceShape}`)).then(response => {
          return response.data;
        });
      },
      onSubmit() {
        axios.post(`${server.baseURL}/shape`, this.settings).then(response => {
          if(response.data === 'saved') {
            alert('Shape is saved in resources folder');
          }
        });
      },
      chooseAndRedirect(value:string) {
        sessionStorage.setItem('sourceShape', value);
        window.location.reload();
      },
      setCurrentModalField(field:string) {
        this.currentModalField = field;
      },
      setCurrentTab(tab:string) {
        this.currentTab = tab;
      },
      getActiveTab() :string {
        return this.currentTab;
      },
      showValues() {
        console.log(this.settings);
      },
      saveValue (field:any, newValue:any) {
        this.settings[field] = newValue;
      },
      addLabel (field:any, newTitle:any, newLanguage:any) {
        var thisObject = (field).split('.').reduce((p:any, c:any) => p && p[c] || null, this);
        thisObject.push({'title':newTitle,'language':newLanguage});
      }
    }
  });
</script>
