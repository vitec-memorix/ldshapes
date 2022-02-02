<template>
    <div class="modal fade" id="rdfsUploadModal" tabindex="-1" aria-labelledby="titleModalUpload" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title" id="titleModalUpload">{{ $t('AddShape') }}</h5>
                    <button type="button" class="btn-close" @click="resetForm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row mb-3">
                            <label class="col-sm-2 col-form-label">Upload</label>
                            <div class="col-sm-10">
                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload( $event )"/>
                                <div class="text-danger" v-if="error_message">
                                    {{ error_message }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-start">
                    <button type="button" class="btn btn-primary" @click="onSubmit">{{$t('button.add')}}</button>
                    <button type="button" id="upload_cancel_button" class="btn btn-light btn-outline-dark" @click="resetForm" data-bs-dismiss="modal">{{$t('button.cancel')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {defineComponent, inject} from "vue";
  import axios from "axios";
  import {server} from "@/helper";
  import {fetchShapesKey} from "@/symbols/shape";

  export default defineComponent({
    data() {
      return {
        file:'',
        error_message:'',
      }
    },
    setup() {
      const fetchShapes = inject(fetchShapesKey);

      if (fetchShapes === undefined) {
        throw new Error('Failed to inject function');
      }

      return {
        fetchShapes
      };
    },
    methods: {
      resetForm: function() {
        (this.$refs['file'] as any).value = null;
        this.file = '';
        this.error_message = '';
      },
      onSubmit: function () {
        this.error_message = '';
        let formData = new FormData();
        formData.append('folder','/shapes');
        formData.append('file', this.file);
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        axios.post(`${server.baseURL}/file`, formData, config).then(response => {
          console.log(response.data);
          this.fetchShapes();
          this.resetForm();
          //when done. Close popup
          const button :any = document.getElementById('upload_cancel_button');
          if(button) {
            button.click();
          }
        }).catch( error => {
            if(error.response['data']['message']) {
              this.error_message = error.response['data']['message'];
            } else {
              this.error_message = 'Er ging iets mis tijdens het uploaden. Probeer het nog eens.';
            }
            return Promise.reject(error)
          }
        );
      },
      /*
        Handles a change on the file upload
      */
      handleFileUpload( event :any ){
        this.file = event.target.files[0];
      },
    },
  });
</script>
