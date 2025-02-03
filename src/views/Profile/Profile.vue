<template>
    <div v-if="user">
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box mx-6 my-6">

                    <div class="field has-text-centered">
                        <div class="control">
                            <figure class="image is-128x128 is-inline-block">
                                <img class="is-rounded" :src="user.file_path ? 'http://localhost:3000/uploads/profile/' + user.file_path : 'https://bulma.io/images/placeholders/128x128.png'">
                            </figure>
                        </div>
                    </div>

                    <div class="field has-text-centered">
                        <label class="label">Username</label>
                        <div class="control">
                            <p class="subtitle is-6">{{ user.first_name }} {{ user.last_name }}</p>
                        </div>
                    </div>

                    <div class="field has-text-centered">
                        <label class="label">Email</label>
                        <div class="control">
                            <p class="subtitle is-6">{{ user.email }}</p>
                        </div>
                    </div>

                    <form enctype="multipart/form-data">
                        <div class="field has-text-centered">
                            <label class="label">Profile Picture</label>
                            <div class="file is-centered" :class="{'is-danger': v$.picture.$error}">
                                <label class="file-label">
                                    <input class="file-input" type="file" accept="image/png, image/jpeg" @change="onFileChange">
                                    <span class="file-cta">
                                        <span class="file-icon">
                                            <font-awesome-icon :icon="['fas', 'upload']" />
                                        </span>
                                        <span class="file-label">
                                            Choose a file…
                                        </span>
                                    </span>
                                </label>
                            </div>
                            <span v-if="v$.picture.$error">
                                <p class="help is-danger">{{ v$.picture.$errors[0].$message }}</p>
                            </span>
                        </div>
                    </form>

                    <div v-if="imageURL" class="field has-text-centered mt-3">
                        <label class="label">Preview</label>
                        <figure class="image is-128x128 is-inline-block">
                            <img :src="imageURL" alt="Preview">
                        </figure>
                    </div>

                    <div class="field has-text-right">
                        <div class="control">
                            <button class="button is-link" @click="uploadFile()">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/plugins/axios'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue';
import {mapGetters} from 'vuex'
import swal from 'sweetalert'

const limit = (pic) => helpers.withParams(
    {type: 'limit', value: pic},
    (event) => {
        pic = event.target.files[0]
        pic.size / 1024 <= 2048
    }
)

export default {
    name: "profile_view",
    setup(){
        const state = reactive({
            picture: null,
        })

        const rules = computed(() => {
            return{
                picture:{
                    required: helpers.withMessage("Please Attached Image", required),
                    limitSize: helpers.withMessage("Image Too Large Than 2 MB", limit(state.picture))
                }
            }
        })

        const v$ = useVuelidate(rules, state)

        return{
            state,
            v$
        }
    },
    data() {
        return {
            imageURL: null,
        }
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0]
            this.state.picture = file
            this.createImage(file)
        },
        createImage(file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                this.imageURL = e.target.result
            }

            reader.readAsDataURL(file)
        },
        uploadFile(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const formData = new FormData()
                formData.append('picture', this.state.picture)

                axios.post(`/profile/${this.$route.params.id}`, formData)
                .then(res =>{
                    this.user.file_path = res.data.path
                    this.imageURL = null
                    swal({
                        text: "Upload Picture Success",
                        icon: "success"
                    })
                })
                .catch(err => {
                    console.log(err)
                    swal({
                        text: "Somethings Went Wrong",
                        button: "Close",
                        icon: "error"
                    })
                })
            }
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
}
</script>

<style>

</style>