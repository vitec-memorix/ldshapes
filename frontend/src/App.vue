<template>
  <div class="main-content">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="/">Home</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="bi-list"></span>
        </button>
        <div class="collapse navbar-collapse pb-5 pb-lg-0" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item" :class="isActiveMenu('shape')">
              <a class="nav-link" href="/shape/pick"><span class="bi-grid"></span>Shape creator</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="page-content">
      <router-view v-if="backendOnline"/>
      <backend-error v-if="!backendOnline"/>
    </div>
  </div>
</template>
<script lang="ts">
  import {defineComponent} from "vue";
  import BackendError from "@/components/BackendError.vue";
  import axios from "axios";
  import {server} from "@/helper";

  export default defineComponent({
    components: {
      BackendError
    },
    data() {
      return {
        backendOnline:true,
        currentRoute: window.location.pathname
      }
    },
    beforeMount() {
      this.checkConnectionBackend();
    },
    methods: {
      checkConnectionBackend() {
        axios.get(encodeURI(server.baseURL)).then(() => {
          this.backendOnline = true;
        }).catch(e => {
          this.backendOnline = false;
        });
      },
      isActiveMenu(menu:string):string {
        if(this.currentRoute.substr(1,menu.length) === menu) {
          return ' active';
        }
        return '';
      },
    },
  });
</script>
<style lang="scss">
  @import './styles/app.scss';
</style>
