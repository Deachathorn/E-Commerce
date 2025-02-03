<template>
    <div v-if="user && user.role === 'user'">
        <div class="container">
            <div class="columns">
                <div class="column my-6 mx-6">
                    <div class="box">
                        <p class="title is-3">Wishlist ({{ wishlist.length }})</p>
                        <table class="table is-fullwidth">
                            <tbody>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Unit Price</th>
                                    <th colspan="3">Stock Status</th>
                                </tr>
                                <tr v-for="(product, index) in wishlist" :key="product.product_id">
                                    <td style="display: flex; align-items: center;">
                                        <figure class="image is-128x128">
                                            <img :src="'http://localhost:3000/uploads/product/' + product.file_path">
                                        </figure>
                                        <p class="subtitle is-6 ml-2">{{ product.name }}</p>
                                    </td>
                                    <td>
                                        <p class="subtitle is-6">฿ {{ product.price }}</p>
                                    </td>
                                    <td >
                                        <span>
                                            <p class="subtitle is-6" v-show="product.quantity >= 25">In Stock</p>
                                            <p class="subtitle is-6" v-show="product.quantity <= 15">There are few products left</p>
                                            <p class="subtitle is-6" v-show="product.quantity === 0">Out of stock</p>
                                        </span>
                                    </td>
                                    <td>
                                        <button class="button is-link" @click="addtoCart(product)">Add To Cart</button>
                                    </td>
                                    <td>
                                        <button class="button is-danger" @click="removeFromWishlist(index)">Remove</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert'
import {mapGetters} from 'vuex'
export default {
    name: "wishlistViews",
    data(){
        return{
            wishlist: [],
            cart: []
        }
    },
    methods:{
        addtoCart(product){
            let duplicate = this.cart.find(item => item.product_id === product.product_id)
            if(duplicate){
                swal({
                    text: "This product has already been added",
                    button: "Ok",
                    icon: "warning"
                })
            }
            else{
                this.cart.push({...product, quantity: 1})
                swal({
                    text: "Product Added To Cart",
                    button: "Ok",
                    icon: "success"
                })
            }
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        removeFromWishlist(index){
            this.wishlist.splice(index, 1)
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist))
        },
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
        this.cart = JSON.parse(localStorage.getItem('cart')) || []
    }
}
</script>

<style>

</style>