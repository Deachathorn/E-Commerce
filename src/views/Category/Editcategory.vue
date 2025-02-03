<template>
    <div v-if="user && user.role === 'admin'">
        <div class="columns is-mobile">
            <div class="column is-12 has-text-centered">
                <h1 class="title is-size-3">Edit Category</h1>
            </div>
        </div>

        <div class="columns is-centered my-5">
            <div class="column is-6 has-text-left">
                <div class="card mx-6">
                    <div class="card-content">
                        <div class="content">
                            <form enctype="multipart/form-data" @submit.prevent="editCategory()">
                                <div class="field px-4 py-2">
                                    <label class="label">Category Name</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Name" v-model="state.name" :class="{'is-danger': v$.name.$error}">
                                    </div>
                                    <span v-if="v$.name.$error">
                                        <p class="help is-danger">{{ v$.name.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Category Image</label>
                                    <div class="file is-centered" :class="{'is-danger': v$.categoryImage.$error}">
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
                                    <span v-if="v$.categoryImage.$error">
                                        <p class="help is-danger">{{ v$.categoryImage.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div v-if="imageURL" class="field has-text-centered px-4 py-2">
                                    <label class="label">Preview</label>
                                    <figure class="image is-128x128 is-inline-block">
                                        <img :src="imageURL" alt="Preview">
                                    </figure>
                                </div>

                                <div class="field px-4 pb-3">
                                    <div class="control">
                                        <button class="button is-link is-fullwidth">Edit Category</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert'
import axios from '@/plugins/axios'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue';
import {mapGetters} from 'vuex'

const limit = (pic) => helpers.withParams(
    {type: 'limit', value: pic},
    (event) => {
        pic = event.target.files[0]
        pic.size / 1024 <= 2048
    }
)

export default {
    name: "edit_category",
    setup(){
        const state = reactive({
            name: "",
            categoryImage: null
        })

        const rules = computed(() => {
            return{
                name:{
                    required: required
                },
                categoryImage:{
                    required: helpers.withMessage("Please Attached Image", required),
                    limitSize: helpers.withMessage("Image Too Large Than 2 MB", limit(state.categoryImage))
                }
            }
        })

        const v$ = useVuelidate(rules, state)

        return{
            state,
            v$
        }
    },
    data(){
        return{
            imageURL: null
        }
    },
    methods:{
        onFileChange(event) {
            const file = event.target.files[0]
            this.state.categoryImage = file
            this.createImage(file)
        },
        createImage(file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                this.imageURL = e.target.result
            }

            reader.readAsDataURL(file)
        },
        editCategory(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const formData = new FormData()
                formData.append('name', this.state.name)
                formData.append('categoryImage', this.state.categoryImage)

                axios.post(`/admin/category/edit/${this.$route.params.id}`, formData)
                .then(res => {
                    console.log(res.data)
                    this.$router.push({name: 'admin_category'})
                    swal({
                        text: "Edit Category Success",
                        icon: "success"
                    })
                })
                .catch(err => {
                    console.log(err)
                    swal({
                        text: "Edit Category Fail",
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
    created(){
        axios.get(`/admin/category/edit/${this.$route.params.id}`)
        .then(res => {
            this.state.name = res.data.name
        })
        .catch(err => {
            console.log(err)
        })
    },
}
</script>

<style>

</style>