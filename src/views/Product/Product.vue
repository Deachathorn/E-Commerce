<template>
    <div id="bg" v-if="user && user.role === 'admin'">
        <div class="container">
            <div class="columns is-centered">
                <div class="column px-6 py-6 has-text-centered">
                    <div class="column" style="display:flex; justify-content:space-between">
                        <p class="title is-size-3 mt-5">Our Products</p>
                        <router-link to="/admin/product/add">
                            <button class="button is-dark my-5">ADD PRODUCT</button>
                        </router-link>
                    </div>
                    <div class="columns is-multiline">
                        <div class="column is-one-fifth" v-for="item in product" :key="item.product_id">
                            <ProductBox :product="item"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductBox from '../../components/Product/ProductBox.vue'
import axios from '@/plugins/axios'
import {mapGetters} from 'vuex'
export default {
    name: "productView",
    components:{
        ProductBox
    },
    data(){
        return{
            product:[]
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get('/admin/product')
        .then(res => {
            this.product = res.data.product
        }).catch(err => {
            console.log(err)
        })
    },
}
</script>

<style>
    #bg{
        min-height: 100vh;
        background: url("../../assets/many-cat2.jpg");
    }
</style>