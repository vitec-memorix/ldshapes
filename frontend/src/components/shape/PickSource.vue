<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-sm-8">
                <h2 class="page-header">Shape creator</h2>
            </div>
            <div class="col-sm-4 text-end">
                <button class="btn btn-primary" @click="chooseAndRedirect('')"><span class="bi-plus-lg"></span> {{ $t('beginNewShape') }}</button>
                <button class="btn btn-primary disabled ms-3" disabled="true"><span class="bi-upload"></span> Import</button>
            </div>
        </div>
        <div class="container list-view">
            <div>
                <div class="row">
                    <div class="col-sm-12 list-header">
                        Name
                    </div>
                </div>
                <div v-for="(shape, index) in sourceShapes" :key="index" :value="shape" class="row">
                    <div class="col-sm-9 ps-0">
                        <button class="btn" @click="chooseAndRedirect(shape)">{{shape}}</button>
                    </div>
                    <div class="col-sm-3 pe-0 text-end">
                        <button class="btn btn-outline-dark ms-3" @click="deleteShape(shape)"><span class="bi-trash"></span> Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import axios from "axios";
  import { server } from "../../helper";

  export default defineComponent({
    name: 'ShapePickSource',
    data() {
      return {
        sourceShapes:[]
      }
    },
    mounted() {
      this.fetchShapes();
    },
    methods: {
      fetchShapes() {
        axios.get(`${server.baseURL}/shape`).then(response => {
          if(typeof response.data === 'object') {
            this.sourceShapes = response.data;
          }
        });
      },
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

