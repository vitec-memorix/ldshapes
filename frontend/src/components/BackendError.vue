<template>
  <div class=" home container">
    <div class="row justify-content-md-center">
      <div class="col-12">
        <message :msg="$t('backendOff')"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // @ is an alias to /src
  import Message from '@/components/Message.vue'

  export default {
    name: 'BackendError',
    components: {
      Message
    }
  }
</script>
