<template>
    <div :class="inline === true ? 'row mb-3' : 'form-property col-12'">
        <label :class="inline === true ? 'col-sm-2 col-form-label' : 'form-label small-form-label'" >
            {{fieldName}}
        </label>
        <div class="position-relative" :class="inline === true ? 'col-sm-10' : ''">
            <Field type="text" :name="'idfield_'+field" @focus="saveOldId" @blur="addSelfPrefixById" v-model="field_value" @keyup="checkForValidPrefixes" @input="updateValue" :rules="validateAbsoluteIRI" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage :name="'idfield_'+field" class="error-message" />
            <span v-if="savedPrefix" :id="'add-prefix-warning-'+field" class="bg-success text-white prefix-warning">{{ $t('AddedPrefix') }}</span>
            <div v-if="!checkForValidPrefixes()" class="mt-2">
                {{ $t('prefixNotFound') }}
                <button class="btn btn-light btn-outline-dark btn-sm" type="button" data-bs-toggle="modal" @click="updateSettingField('prefixId',prefixId)" data-bs-target="#rdfsPrefixModal">Add prefix</button>
            </div>
            <div v-if="altertype==='add'">
            <button type="button" class="btn btn-primary mt-3" @click="saveNewValue">{{$t('button.add')}}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue';
  import axios from "axios";
  import {validateAbsoluteIRI} from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import {updateSettingFieldKey, getFullIriKey, addSettingRowKey, getShorthandFromFullIriKey} from "@/symbols/shape";

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
      altertype: {
        type: String,
        default: 'update'
      },
      fieldName: {
        type: String,
        default: 'id'
      },
      inline: {
        type: Boolean,
        default: true
      }
    },
    data() {
      const prefixesCC: { [key: string]: any[] } = {};
      return {
        field_value:'',
        prefixesCC,
        prefixId:'',
        savedPrefix:false,
        oldId:'',
      }
    },
    watch: {
      field: {
        handler() {
          this.field_value = '';
          setTimeout(()=>{
            this.setFieldValue(this.field);
          },200)
        },
      },
      settings: {
        handler() {
          this.setFieldValue(this.field);
        },
        deep:true,
      },
    },
    mounted() {
      this.setPrefixes();
      this.setFieldValue(this.field);
    },
    setup() {
      const settings :any = inject('settings');
      const updateSettingField = inject(updateSettingFieldKey);
      const addSettingRow = inject(addSettingRowKey);
      const getFullIri = inject(getFullIriKey);
      const getShorthandFromFullIri = inject(getShorthandFromFullIriKey);

      if (getFullIri === undefined || addSettingRow === undefined || updateSettingField === undefined || getShorthandFromFullIri === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        updateSettingField,
        addSettingRow,
        getFullIri,
        getShorthandFromFullIri,
        settings,
      };
    },
    methods: {
      validateAbsoluteIRI,
      setFieldValue(field :string) {
        if(this.altertype === 'update') {
          var pList = field.split('.');
          var newVal = this.settings;
          var len = pList.length;
          for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!newVal[elem]) newVal[elem] = {}
            newVal = newVal[elem];
          }
          this.field_value = this.getShorthandFromFullIri(newVal[pList[len - 1]]);
        }
      },
      checkForValidPrefixes() {
        if(this.field_value !== undefined) {
          const matches: string[]|null = this.field_value.match(/^([a-z][a-z0-9]+):[a-zA-Z]/);
          // if there is a shorthand code.
          if(matches !== null && matches[1] !== undefined) {
            var prefixFound = false;
            this.prefixId = matches[1];
            //Check if the prefix is already set.
            if(this.settings['prefix'] !== undefined) {
              Object.keys(this.settings['prefix']).forEach(key => {
                if(this.settings['prefix'][key]['prefix'] === matches[1]) {
                  prefixFound = true;
                }
              });
              //if no prefix is found. Check if the prefix is set on prefix.cc
              //add automatically
              if(prefixFound === false && this.prefixesCC[matches[1]] !== undefined) {
                this.settings['prefix'].push({
                  id:this.prefixesCC[matches[1]],
                  prefix:matches[1]
                })
                this.showAddPrefix();
                prefixFound = true;
              }

              //if still not found. Show add prefix message.
              return prefixFound;
            }
          }
        }
        //if we are still here. Don't show the warning.
        return true;
      },
      setPrefixes: function() {
        if(localStorage.getItem('prefixContext') !== null) {
          const prefixes :any = localStorage.getItem('prefixContext');
          this.prefixesCC = JSON.parse(prefixes);
        } else {
          axios.get('https://prefix.cc/context')
            .then(response => {
              this.prefixesCC = response.data['@context'];
              localStorage.setItem('prefixContext', JSON.stringify(this.prefixesCC));
            })
        }
      },
      showAddPrefix: function() {
        this.savedPrefix = true;
        setTimeout(()=>{
          this.savedPrefix = false;
        },1000)
      },
      saveOldId() {
        if (this.field === 'shape.id' && this.settings['shape']['id'] !== undefined) {
          this.oldId = this.getFullIri(this.settings['shape']['id']);
        }
      },
      addSelfPrefixById() {
        if (this.field === 'shape.id') {
          let selfPrefixExists = false;
          var fullUrl = this.getFullIri(this.settings['shape']['id']);
          Object.keys(this.settings['prefix']).forEach(key => {
            if(this.settings['prefix'][key]['prefix'] === 'self') {
              selfPrefixExists = true;
              this.settings['prefix'][key]['id'] = fullUrl + '#';
            }
            if(this.oldId !== '' && this.settings['prefix'][key]['id'].substr(0,this.oldId.length) === this.oldId) {
              //if the id changes. Change the prefix set for self (named) also.
              this.settings['prefix'][key]['id'] = fullUrl + '#';
            }
          });
          //and change the paths for all properties and groups that need changing.
          Object.keys(this.settings['group']).forEach(key => {
            if(this.settings['group'][key]['id'].substr(0,this.oldId.length) === this.oldId) {
              this.settings['group'][key]['id'] = fullUrl + this.settings['group'][key]['id'].substr(this.oldId.length);
            }
          });
          Object.keys(this.settings['property']).forEach(key => {
            if(this.settings['property'][key]['path'].substr(0,this.oldId.length) === this.oldId) {
              this.settings['property'][key]['path'] = fullUrl + this.settings['property'][key]['path'].substr(this.oldId.length);
            }
            if(this.settings['property'][key]['group'] !== undefined && this.settings['property'][key]['group'].substr(0,this.oldId.length) === this.oldId) {
              this.settings['property'][key]['group'] = fullUrl + this.settings['property'][key]['group'].substr(this.oldId.length);
            }
          });
          if(!selfPrefixExists) {
            this.settings['prefix'].unshift({
              'prefix':'self',
              'id':fullUrl + '#'
            });
          }
        }
      },
      updateValue() {
        if(this.altertype === 'update') {
          this.updateSettingField(this.field, this.field_value);
        }
      },
      saveNewValue() {
        if(this.field_value !== '' && validateAbsoluteIRI(this.field_value) === true) {
          this.addSettingRow(this.field, this.getFullIri(this.field_value));
          this.field_value = '';
        }
      }
    },
  });
</script>
