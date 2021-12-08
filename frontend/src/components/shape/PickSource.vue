<template>
    <div class="container">
        <div class="col-md-8 form-wrapper">
            <h2>{{ $t('createNewShape') }}</h2>
            <p>{{ $t('pickShapeText') }}</p>
            <div v-for="(shape, index) in sourceShapes" :key="index" :value="shape" class="pb-3">
                <button class="btn btn-primary" @click="chooseAndRedirect(shape)">{{shape}}</button>
            </div>
            <button class="btn btn-secondary" @click="chooseAndRedirect('')">{{ $t('beginNewShape') }}</button>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import axios from "axios";
  import { server } from "../../helper";

  export default defineComponent({
    el: '#app',
    data() {
      return {
        sourceShapes:[]
      }
    },
    mounted() {
      axios.get(`${server.baseURL}/shape`).then(response => {
        if(typeof response.data === 'object') {
          this.sourceShapes = response.data;
        }
      });
    },
    methods: {
      chooseAndRedirect(value:string) {
        sessionStorage.setItem('sourceShape', value);
        this.$router.push('create');
      },
    }
  });</script>

