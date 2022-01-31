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
            <li class="nav-item" :class="isActiveMenu('transformer')">
              <a class="nav-link" href="/transformer/index"><span class="bi-share"></span>LD Transformer</a>
            </li>
            <li class="nav-item navbar-right" :class="isActiveMenu('config')">
              <a class="nav-link" href="/config/index"><span class="bi-gear"></span>Config</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="page-content">
      <router-view/>
    </div>
  </div>
</template>
<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
    data() {
      return {
        currentRoute: window.location.pathname
      }
    },
    methods: {
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
