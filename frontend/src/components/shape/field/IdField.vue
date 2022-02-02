<template>
    <div :class="inline === true ? 'row mb-3' : 'form-property col-12'">
        <label :class="inline === true ? 'col-sm-2 col-form-label' : 'form-label small-form-label'" >
            {{fieldName}}
        </label>
        <div class="position-relative" :class="inline === true ? 'col-sm-10' : ''">
            <Field type="text" :name="'idfield_'+field" @focus="saveOldId" @blur="addSelfPrefixById" v-model="field_value" @keyup="checkForValidPrefixes" @input="updateSettingField(field, field_value)" :rules="validateAbsoluteIRI" class="form-control" :placeholder="$t('iri')"/>
            <ErrorMessage :name="'idfield_'+field" class="error-message" />
            <span v-if="savedPrefix" :id="'add-prefix-warning-'+field" class="bg-success text-white prefix-warning">{{ $t('AddedPrefix') }}</span>
            <div v-if="!checkForValidPrefixes()" class="mt-2">
                {{ $t('prefixNotFound') }}
                <button class="btn btn-light btn-outline-dark btn-sm" type="button" data-bs-toggle="modal" @click="updateSettingField('prefixId',prefixId)" data-bs-target="#rdfsPrefixModal">Add prefix</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue';
  import axios from "axios";
  import {validateAbsoluteIRI} from '@/mixins/validateShape';
  import { ErrorMessage, Field } from 'vee-validate';
  import {updateSettingFieldKey, getFullIriKey} from "@/symbols/shape";

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
    data() {
      const prefixesCC: { [key: string]: any[] } = {};
      return {
        field_value:this.value,
        prefixesCC,
        prefixId:'',
        savedPrefix:false,
        oldId:'',
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
          this.field_value = this.getShorthandFromFullUrl(newVal[pList[len-1]]);
        },
        deep:true,
      },
    },
    mounted() {
      this.setPrefixes();
      if(this.field_value !== undefined) {
        this.field_value = this.getShorthandFromFullUrl(this.field_value);
      }
    },
    setup() {
      const settings :any = inject('settings');
      const updateSettingField = inject(updateSettingFieldKey);
      const getFullIri = inject(getFullIriKey);

      if (getFullIri === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        updateSettingField,
        getFullIri,
        settings,
      };
    },
    methods: {
      validateAbsoluteIRI,
      checkForValidPrefixes() {
        if(this.field_value !== undefined) {
          const matches: string[]|null = this.field_value.match(/^([a-z][a-z0-9]+):[a-zA-Z]/);
          // if there is a shorthand code.
          if(matches !== null && matches[1] !== undefined) {
            var prefixFound = false;
            this.prefixId = matches[1];
            //Check if the prefix is already set.
            if(this.settings.prefix !== undefined) {
              this.settings.prefix.forEach(function(prefix :any){
                if(prefix['prefix'] === matches[1]) {
                  prefixFound = true;
                }
              })
              //if no prefix is found. Check if the prefix is set on prefix.cc
              //add automatically
              if(prefixFound === false && this.prefixesCC[matches[1]] !== undefined) {
                this.settings.prefix.push({
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
        if (this.field === 'shape.id') {
          this.oldId = this.getFullIri(this.settings.shape.id);
        }
      },
      addSelfPrefixById() {
        if (this.field === 'shape.id') {
          let selfPrefixExists = false;
          var fullUrl = this.getFullIri(this.settings.shape.id);
          Object.keys(this.settings.prefix).forEach(key => {
            if(this.settings.prefix[key]['prefix'] === '') {
              selfPrefixExists = true;
              this.settings.prefix[key]['id'] = fullUrl + '#';
            }
            if(this.oldId !== '' && this.settings.prefix[key]['id'].substr(0,this.oldId.length) === this.oldId) {
              //if the id changes. Change the prefix set for self (named) also.
              this.settings.prefix[key]['id'] = fullUrl + '#';
            }
          });
          if(!selfPrefixExists) {
            this.settings.prefix.unshift({
              'prefix':'self',
              'id':fullUrl + '#'
            });
          }
        }
      },
      getShorthandFromFullUrl(url :string) {
        if(url === undefined){
          return url;
        }
        let newUrl = url;
        let prevPrefix = '';
        let prevLength = 0;
        Object.keys(this.settings.prefix).forEach(key => {
          const id = this.settings.prefix[key]['id'];
          const prefix = this.settings.prefix[key]['prefix'];
          if(id === url.substr(0,id.length) && (prevPrefix === '' || prevPrefix === 'self'  || id.length > prevLength)) {
            newUrl = prefix + ':' + url.substr(id.length);
            prevPrefix = prefix;
            prevLength = id.length;
          }
        });
        return newUrl;
      },
    },
  });
</script>
