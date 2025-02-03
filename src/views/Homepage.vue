<template>
    <div v-if="user || !user">
        <section class="hero is-fullheight is-relative">
            <img src="../assets/many-cat2.jpg" alt="" class="hero-image">
            <div class="hero-body has-text-centered">
                <div class="container">
                    <p class="title is-3 has-text-dark">
                        Great Product For Your Cat
                    </p>
                    <div class="columns" style="align-items: center; justify-content: center;">
                        <div class="column is-4">
                            <router-link to="/product">
                                <button class="button is-fullwidth is-dark">
                                    SHOP NOW
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div class="columns">
            <div class="column px-6 py-6">
                <p class="title is-size-3 has-text-centered">Category</p>
                <div class="columns is-multiline has-text-centered is-centered py-5">
                    <div class="column is-one-fifth" v-for="item in category" :key="item.category_id">
                        <CategoryBox :category="item"/>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="columns">
            <div class="column px-6 py-6">
                <p class="title is-size-3 has-text-centered">Product</p>
                <div class="columns is-multiline has-text-centered is-centered py-5">
                    <div class="column is-one-fifth" v-for="item in product" :key="item.product_id">
                        <ProductBox :product="item"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductBox from '@/components/Product/ProductBox.vue'
import CategoryBox from '@/components/Category/CategoryBox.vue'
import axios from '@/plugins/axios'
import {mapGetters} from 'vuex'
export default {
    name: "homepageView",
    components:{
        ProductBox,
        CategoryBox
    },
    data(){
        return{
            categorySize: 0,
            category:[],
            product:[]
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get('/')
        .then(res => {
            this.category = res.data.categories
            this.product = res.data.products
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>

<style scoped>
.hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}
</style>