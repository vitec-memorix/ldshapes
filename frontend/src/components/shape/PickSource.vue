<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-12 col-md-7">
                <h2 class="page-header">Shape creator</h2>
            </div>
            <div class="col-12 col-md-5 text-md-end">
                <button class="btn btn-primary" @click="chooseAndRedirect('')"><span class="bi-plus-lg"></span> {{ $t('beginNewShape') }}</button>
                <button class="btn btn-primary ms-3" data-bs-toggle="modal" data-bs-target="#rdfsUploadModal"><span class="bi-upload"></span> Import</button>
            </div>
        </div>
        <div class="container list-view">
            <div>
                <div class="row">
                    <div class="col-sm-12 list-header">
                        Name
                    </div>
                </div>
                <div class="row">
                    <div class="scrollable-content">
                        <div class="col-sm-12">
                            <div v-for="(shape, index) in data.shapes" :key="index" :value="shape" class="row border-bottom">
                                <div class="col-12 col-md-6 ps-0">
                                    <button class="btn" @click="chooseAndRedirect(shape)">{{shape}}</button>
                                </div>
                                <div class="col-12 col-md-6 text-md-end">
                                    <button class="btn btn-outline-dark ms-3" @click="downloadShape(shape)"><span class="bi-download"></span> Download</button>
                                    <button class="btn btn-outline-dark ms-3" @click="deleteShape(shape)"><span class="bi-trash"></span> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <upload-modal />
</template>

<script lang="ts">
  import {defineComponent, provide, reactive} from 'vue'
  import axios from "axios";
  import { server } from "../../helper";
  import UploadModal from './modal/UploadModal.vue';
  import { FetchShapesFunction } from "@/types/shape";
  import {fetchShapesKey} from "@/symbols/shape";

  export default defineComponent({
    name: 'ShapePickSource',
    components: {
      UploadModal,
    },
    setup() {
      let data = reactive({'shapes':[]});

      const fetchShapes: FetchShapesFunction = function () {
        axios.get(`${server.baseURL}/shape`).then(response => {
          if(typeof response.data === 'object') {
            data['shapes'] = response.data;
          }
        });
      }

      provide("datahapes", data);
      provide(fetchShapesKey, fetchShapes);
      return {
        data,
        fetchShapes
      };
    },
    mounted() {
      this.fetchShapes();
    },
    methods: {
      chooseAndRedirect(value:string) {
        sessionStorage.setItem('sourceShape', value);
        this.$router.push('create');
      },
      deleteShape(value:string) {
        axios.delete(`${server.baseURL}/shape/${value}`).then(response => {
          this.fetchShapes();
        });
      }
    }
  });</script>

