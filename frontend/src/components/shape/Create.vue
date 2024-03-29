<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-12 col-lg-8 page-header">
                <a href="/shape/pick">Shape creator</a> / <span class="object-name">{{settingsObject.name}}</span>
                <button class="btn btn-link p-0 align-bottom" type="button" data-bs-toggle="modal" data-bs-target="#titleModal"><span class="bi-edit"></span></button>
            </div>
            <div class="col-12 col-lg-4 text-lg-end">
                <button class="btn btn-primary" @click="onSubmit('save')">{{ $t('save') }}</button>
                <button class="btn btn-primary ms-3" @click="onSubmit('download')">{{ $t('saveDownload') }}</button>
            </div>
        </div>
        <div class="col-md-12 form-wrapper">
            <Form id="app">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" @click="setCurrentTab('shape')" id="shape-tab" data-bs-toggle="tab" data-bs-target="#shape" ref="shapeTab" type="button" role="tab" aria-controls="home" aria-selected="true">Shape</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="property-tab" @click="setCurrentTab('property')" data-bs-toggle="tab" data-bs-target="#property" ref="propertyTab" type="button" role="tab" aria-controls="property" aria-selected="false">Properties</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="prefix-tab" @click="setCurrentTab('prefix')" data-bs-toggle="tab" data-bs-target="#prefix" ref="prefixTab" type="button" role="tab" aria-controls="prefix" aria-selected="false">Prefixes</button>
                    </li>
                </ul>
                <div class="tab-content p-2 ps-3 pe-3 border-start" id="myTabContent">
                    <div class="tab-pane fade show active" id="shape" role="tabpanel" aria-labelledby="shape-tab">
                        <shape-tab/>
                    </div>
                    <div class="tab-pane fade" id="property" role="tabpanel" aria-labelledby="property-tab">
                        <property-tab/>
                        <div class="pt-3">
                        </div>
                    </div>
                    <div class="tab-pane fade" id="prefix" role="tabpanel" aria-labelledby="prefix-tab">
                        <prefix-tab/>
                    </div>
                </div>
                <title-modal :title="$t('ChangeTitle')"/>
                <label-modal :title="$t('AddLabel')"/>
                <prefix-modal />
                <ignored-properties-modal />
            </Form>
        </div>
    </div>
</template>

<script lang="ts">
  import {defineComponent, provide, reactive} from 'vue'
  import axios from "axios";
  import { server } from "../../helper";
  import ShapeTab from './tab/ShapeTab.vue';
  import PrefixTab from './tab/PrefixTab.vue';
  import PropertyTab from './tab/PropertyTab.vue';
  import TitleModal from './modal/TitleModal.vue';
  import LabelModal from './modal/LabelModal.vue';
  import PrefixModal from './modal/PrefixModal.vue';
  import IgnoredPropertiesModal from './modal/IgnoredPropertiesModal.vue';
  import { Form } from 'vee-validate';
  import config from '../../../../resources/shapes/config.json';

  import { UpdateSettingFieldFunction, AddSettingRowFunction, RemoveSettingRowFunction, GetFullIriFunction, GetShorthandFromFullIriFunction } from "@/types/shape";
  import { updateSettingFieldKey, addSettingRowKey, removeSettingRowKey, getFullIriKey, getShorthandFromFullIriKey } from "@/symbols/shape";

  export default defineComponent({
    name: 'ShapeCreate',
    components: {
      ShapeTab,
      PrefixTab,
      PropertyTab,
      TitleModal,
      LabelModal,
      PrefixModal,
      IgnoredPropertiesModal,
      Form },
    data() {
      return {
        currentTab:'shape',
        optionalPrefixes: {},
        listPrefix: '',
      }
    },
    async created() {
      var settings = await this.fetchShapeSettings();
      var fields = Object.keys(this.settingsObject);
      for( const index in fields ) {
        this.updateSettingField(fields[index],settings[fields[index]]);
      }
    },
    setup() {

      let generalConfig = reactive({
        modalField:'',
        prefixId:'',
      });
      let settingsObject = reactive({
        name:'',
        original:'',
        shape:{},
        prefix:[],
        group:[],
        property:[]
      });

      const updateSettingField: UpdateSettingFieldFunction = function (field: string, value: any) {
        var schema :any;
        if(['modalField','prefixId'].indexOf(field) > -1) {
          schema = generalConfig;
        } else {
          schema = settingsObject;
        }

        var pList = field.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
          var elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
        }
        schema[pList[len-1]] = value;
      };

      const addSettingRow: AddSettingRowFunction = function (field: string, row: any) {
        var schema :any = settingsObject;
        var pList = field.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
          var elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
        }
        schema[pList[len-1]].push(row);
      }

      const removeSettingRow: RemoveSettingRowFunction = function (field: string, index: number) {
        var schema :any = settingsObject;
        var pList = field.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
          var elem = pList[i];
          if( !schema[elem] ) schema[elem] = {}
          schema = schema[elem];
        }
        if(Number.isInteger(index)) {
          schema[pList[len-1]].splice(index, 1);
        } else {
          delete schema[pList[len-1]][index];
        }
      }

      const getFullIri: GetFullIriFunction = function (iri :string) {
        const matches: string[]|null = iri.match(/^([a-z][a-z0-9]+):([a-zA-Z].*)/);
        if(matches !== null && matches[1] !== undefined && matches[2] !== undefined) {
          settingsObject.prefix.forEach(function(value :any){
            if(matches[1] === value['prefix']) {
              iri = value['id'] + matches[2];
            }
          })
        }
        return iri;
      }

      const getShorthandFromFullIri: GetShorthandFromFullIriFunction = function (iri :string) {
        if(iri === undefined){
          return iri;
        }
        let newIri = iri;
        let prevPrefix = '';
        let prevLength = 0;
        Object.keys(settingsObject['prefix']).forEach(number => {
          const key :any = number;
          const id :string = settingsObject['prefix'][key]['id'];
          const prefix :string = settingsObject['prefix'][key]['prefix'];
          if(id === iri.substr(0,id.length) && (prevPrefix === '' || prevPrefix === 'self'  || id.length > prevLength)) {
            newIri = prefix + ':' + iri.substr(id.length);
            prevPrefix = prefix;
            prevLength = id.length;
          }
        });
        return newIri;
      }

      provide("settings", settingsObject);
      provide("generalConfig", generalConfig);
      provide("shapeConfig", config);
      provide(updateSettingFieldKey, updateSettingField);
      provide(addSettingRowKey, addSettingRow);
      provide(removeSettingRowKey, removeSettingRow);
      provide(getFullIriKey, getFullIri);
      provide(getShorthandFromFullIriKey, getShorthandFromFullIri);

      return {
        settingsObject,
        generalConfig,
        updateSettingField,
        addSettingRow,
        removeSettingRow
      };
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
      onSubmit(type:string) {
        axios.post(`${server.baseURL}/shape`, this.settingsObject).then(response => {
          if(response.data === 'saved') {
              if(type === 'download') {
                let file = this.settingsObject.name+'.ttl';
                let params =  {
                  file: file,
                  folder:'/shapes'
                };
                axios.get(`${server.baseURL}/file`,{ params: params }).then(response => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', file); //or any other extension
                  document.body.appendChild(link);
                  link.click();
                });
              } else {
                alert('Shape is saved in resources folder');
              }
          }
        });
      },
      chooseAndRedirect(value:string) {
        sessionStorage.setItem('sourceShape', value);
        window.location.reload();
      },

      setCurrentTab(tab:string) {
        this.currentTab = tab;
      },
      getActiveTab() :string {
        return this.currentTab;
      },
    }
  });
</script>
