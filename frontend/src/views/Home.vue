<template>
  <div class=" home container">
    <div class="row justify-content-md-center">
      <div class="col-12">
        <Welcome :msg="$t('welcome')"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // @ is an alias to /src
  import Welcome from '@/components/Welcome.vue'

  export default {
    name: 'Home',
    components: {
      Welcome
    }
  }
</script>
<style lang="scss">
  .home {
    text-align:center;
  }
</style>
