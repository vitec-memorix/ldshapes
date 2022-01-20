<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-sm-8 page-header">
                <a href="/shape/pick">Shape creator</a> / {{settingsObject.name}} <button class="btn btn-link p-0 align-bottom" type="button" data-bs-toggle="modal" data-bs-target="#titleModal"><span class="bi-edit"></span></button>
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
                        <button class="nav-link" id="property-tab" @click="setCurrentTab('property')" data-bs-toggle="tab" data-bs-target="#property" ref="propertyTab" type="button" role="tab" aria-controls="property" aria-selected="false">Properties</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="prefix-tab" @click="setCurrentTab('prefix')" data-bs-toggle="tab" data-bs-target="#prefix" ref="prefixTab" type="button" role="tab" aria-controls="prefix" aria-selected="false">Prefixes</button>
                    </li>
                </ul>
                <div class="tab-content p-2 border-start pb-5" id="myTabContent">
                    <div class="tab-pane fade show active" id="shape" role="tabpanel" aria-labelledby="shape-tab">
                        <shape-tab/>
                    </div>
                    <div class="tab-pane fade" id="property" role="tabpanel" aria-labelledby="property-tab">
                        <property-tab/>
                        <div class="pt-3">
                            <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="prefix" role="tabpanel" aria-labelledby="prefix-tab">
                        <prefix-tab/>
                    </div>
                </div>
                <title-modal :title="$t('ChangeTitle')"/>
                <label-modal :title="$t('AddLabel')"/>
                <prefix-modal />
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
  import { Form } from 'vee-validate';
  import config from '../../../../resources/shapes/config.json';

  import { UpdateSettingFieldFunction, AddSettingRowFunction, RemoveSettingRowFunction } from "@/types/shape";
  import { updateSettingFieldKey, addSettingRowKey, removeSettingRowKey } from "@/symbols/shape";

  export default defineComponent({
    name: 'ShapeCreate',
    components: {
      ShapeTab,
      PrefixTab,
      PropertyTab,
      TitleModal,
      LabelModal,
      PrefixModal,
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
      });
      let settingsObject = reactive({
        name:'',
        shape:{},
        prefix:[],
        group:[],
        property:[]
      });

      const updateSettingField: UpdateSettingFieldFunction = function (field: string, value: any) {
        var schema :any;
        if(['modalField'].indexOf(field) > -1) {
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

      provide("settings", settingsObject);
      provide("generalConfig", generalConfig);
      provide("shapeConfig", config);
      provide(updateSettingFieldKey, updateSettingField);
      provide(addSettingRowKey, addSettingRow);
      provide(removeSettingRowKey, removeSettingRow);

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
      onSubmit() {
        axios.post(`${server.baseURL}/shape`, this.settingsObject).then(response => {
          if(response.data === 'saved') {
            alert('Shape is saved in resources folder');
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
      showValues() {
        console.log(this.settingsObject);
      },
    }
  });
</script>
