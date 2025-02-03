<template>
    <div v-if="user && user.role === 'admin'">
        <div class="columns is-mobile">
            <div class="column is-12 has-text-centered">
                <h1 class="title is-size-3">Edit Product</h1>
            </div>
        </div>

        <div class="columns is-centered my-5">
            <div class="column is-6 has-text-left">
                <div class="card mx-6">
                    <div class="card-content">
                        <div class="content">
                            <form enctype="multipart/form-data" @submit.prevent="editProduct()">
                                <div class="field px-4 py-2">
                                    <label class="label">Category</label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="state.category" :class="{'is-danger': v$.category.$error}">
                                                <option v-for="item in select" :key="item.category_id" :value="item.name">
                                                    {{ item.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <span v-if="v$.category.$error">
                                        <p class="help is-danger">{{ v$.category.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Name</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Name" v-model="state.name" :class="{'is-danger': v$.name.$error}">
                                    </div>
                                    <span v-if="v$.name.$error">
                                        <p class="help is-danger">{{ v$.name.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Description</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="Description" v-model="state.description" :class="{'is-danger': v$.description.$error}">
                                    </div>
                                    <span v-if="v$.description.$error">
                                        <p class="help is-danger">{{ v$.description.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Price</label>
                                    <div class="control">
                                        <input class="input" type="number" placeholder="Price" v-model="state.price" :class="{'is-danger': v$.price.$error}">
                                    </div>
                                    <span v-if="v$.price.$error">
                                        <p class="help is-danger">{{ v$.price.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Quantity</label>
                                    <div class="control">
                                        <input class="input" type="number" placeholder="Quantity" v-model="state.quantity" :class="{'is-danger': v$.quantity.$error}">
                                    </div>
                                    <span v-if="v$.quantity.$error">
                                        <p class="help is-danger">{{ v$.quantity.$errors[0].$message }}</p>
                                    </span>
                                </div>

                                <div class="field px-4 py-2">
                                    <label class="label">Product Image</label>
                                    <div class="file is-centered" :class="{'is-danger': v$.productImage.$error}">
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
                                    <span v-if="v$.productImage.$error" class="has-text-centered">
                                        <p class="help is-danger">{{ v$.productImage.$errors[0].$message }}</p>
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
                                        <button class="button is-link is-fullwidth">Edit Product</button>
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
import axios from '@/plugins/axios'
import swal from 'sweetalert'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue';
import {mapGetters} from 'vuex'

function checkinputNumber(value){
    if(value <= 0){
        return false
    }
    return true
}

const limit = (pic) => helpers.withParams(
    {type: 'limit', value: pic},
    (event) => {
        pic = event.target.files[0]
        pic.size / 1024 <= 2048
    }
)

export default {
    name: "edit_product",
    setup(){
        const state = reactive({
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            productImage: null,
            category: ""
        })

        const rules = computed(() => {
            return{
                name:{
                    required: required,
                },
                description:{
                    required: required,
                },
                price:{
                    required: required,
                    min: helpers.withMessage("Value cannot be zero", checkinputNumber)
                },
                quantity:{
                    required: required,
                    min: helpers.withMessage("Value cannot be zero", checkinputNumber)
                },
                productImage:{
                    required: helpers.withMessage("Please Attached Image", required),
                    limitSize: helpers.withMessage("Image Too Large Than 2 MB", limit(state.productImage))
                },
                category:{
                    required: required,
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
            select: [],
            imageURL: null
        }
    },
    methods:{
        onFileChange(event) {
            const file = event.target.files[0]
            this.state.productImage = file
            this.createImage(file)
        },
        createImage(file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                this.imageURL = e.target.result
            }

            reader.readAsDataURL(file)
        },
        editProduct(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const formData = new FormData()
                formData.append('name', this.state.name)
                formData.append('description', this.state.description)
                formData.append('price', this.state.price)
                formData.append('quantity', this.state.quantity)
                formData.append('productImage', this.state.productImage)
                formData.append('category', this.state.category)

                axios.post(`/admin/product/edit/${this.$route.params.id}`, formData)
                .then(res => {
                    console.log(res.data)
                    this.$router.push({name: 'admin_product'})
                    swal({
                        text: "Edit Product Success",
                        icon: "success"
                    })
                })
                .catch(err => {
                    swal({
                        text: "This product is have duplicate picture",
                        button: "Close",
                        icon: "error"
                    })
                    console.log(err)
                })
            }
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get(`/admin/product/edit/${this.$route.params.id}`)
        .then(res => {
            this.state.name = res.data.name
            this.state.description = res.data.description
            this.state.price = res.data.price
            this.state.quantity = res.data.quantity
            this.state.category = res.data.category_name
            this.select = res.data.categories
        })
        .catch(err => {
            console.log(err)
        })
        console.log(this.select)
    }
}
</script>

<style>

</style>