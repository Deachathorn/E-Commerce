<template>
    <div v-if="user && user.role === 'user'">
        <div class="container">
            <div class="columns">
                <div class="column my-6 mx-6">
                    <div class="card">
                        <div class="card-content">
                            <div class="content">
                                <p class="title is-4">Customer Information</p>
                                <form>
                                    <div class="columns">
                                        <div class="column">
                                            <div class="field">
                                                <label class="label">FirstName - LastName</label>
                                                <div class="control">
                                                    <input class="input" type="text" placeholder="FirstName - LastName" v-model="state.fullname">
                                                </div>
                                                <span v-if="v$.fullname.$error">
                                                    <p class="help is-danger">{{ v$.fullname.$errors[0].$message }}</p>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="column">
                                            <div class="field">
                                                <label class="label">Email</label>
                                                <div class="control">
                                                    <input class="input" type="email" placeholder="example@gmail.com" v-model="state.email">
                                                </div>
                                                <span v-if="v$.email.$error">
                                                    <p class="help is-danger">{{ v$.email.$errors[0].$message }}</p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="columns">
                                        <div class="column">
                                            <div class="field">
                                                <label class="label">Phone Number</label>
                                                <div class="control">
                                                    <input class="input" type="text" placeholder="Phone Number" v-model="state.phone">
                                                </div>
                                                <span v-if="v$.phone.$error">
                                                    <p class="help is-danger">{{ v$.phone.$errors[0].$message }}</p>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="column">
                                            <div class="field">
                                                <label class="label">Address</label>
                                                <div class="control">
                                                    <textarea class="textarea is-small" placeholder="Address" v-model="state.address"></textarea>
                                                    <span v-if="v$.address.$error">
                                                        <p class="help is-danger">{{ v$.address.$errors[0].$message }}</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="field" v-if="user && user.role === 'user'">
                                            <div class="control">
                                                <input class="input" type="hidden" name="user_id" :value="user.user_id">
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="box">
                        <p class="title is-3">Shopping Cart</p>
                        <div class="field has-text-right">
                            <div class="control">
                                <button class="button is-danger" @click="clearCart()">Clear Cart</button>
                            </div>
                        </div>
                        <table class="table is-fullwidth">
                            <tbody>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>SubTotal</th>
                                    <th>Action</th>
                                </tr>
                                <tr v-for="(product, index) in cart" :key="product.id">
                                    <td style="display: flex; align-items: center;">
                                        <figure class="image is-128x128">
                                            <img :src="'http://localhost:3000/uploads/product/' + product.file_path">
                                        </figure>
                                        <p class="subtitle is-6 ml-2 has-text-weight-bold">{{ product.name }}</p>
                                    </td>
                                    <td>
                                        <p class="subtitle is-6 has-text-weight-bold"> ฿ {{ product.price }} </p>
                                    </td>
                                    <td>
                                        <div class="field has-addons">
                                            <div class="control">
                                                <button class="button is-link is-small" @click="removeQuantity(index)">-</button>
                                            </div>
                                            <div class="control mx-2 mt-1">
                                                <p class="subtitle is-6 has-text-weight-bold">{{ product.quantity }}</p>
                                            </div>
                                            <div class="control">
                                                <button class="button is-link is-small" @click="addQuantity(index)">+</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p class="subtitle is-6 has-text-weight-bold"> ฿ {{ productPrice(product) }} </p>
                                    </td>
                                    <td>
                                        <button class="button is-danger" @click="removeProduct(index)">Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <th colspan="2">
                                    </th>
                                    <th>
                                        Total
                                    </th>
                                    <th colspan="2">
                                        ฿ {{ totalPrice }}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        <div class="field has-text-right">
                            <div class="control">
                                <button class="button is-link" @click.prevent="checkOut()">Check Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue';
import {mapGetters} from 'vuex'
import { loadStripe } from '@stripe/stripe-js'
import axios from '@/plugins/axios'
const stripe = await loadStripe('pk_test_51OdtOoG6vm99QmveeCKpbTmXZttVk9gJg77u9zpkBpfanf01ogWVSp50G8WyCz4WKM8TqHgRec8VkiKglnjQlj3W00eaMxZ7r3')
export default {
    name: "shopping_cart",
    setup(){
        const state = reactive({
            fullname: "",
            email: "",
            phone: "",
            address: "",
        })

        const rules = computed(() => {
            return{
                fullname:{
                    required: required,
                },
                email:{
                    required: required,
                    email: email,
                },
                phone:{
                    required: required,
                },
                address:{
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
            cart: []
        }
    },
    methods:{
        addQuantity(index){
            this.cart[index].quantity += 1
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        removeQuantity(index){
            this.cart[index].quantity -= 1
            if(this.cart[index].quantity <= 1){
                this.cart[index].quantity = 1
            }
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        removeProduct(index){
            this.cart.splice(index, 1)
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        clearCart(){
            this.cart = []
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },
        checkOut() {
            this.v$.$touch()
            if (!this.v$.$invalid && this.cart.length !== 0){

                    const userData = {
                        user_id: document.querySelector('div.control input[name=user_id]').value,
                        fullname: this.state.fullname,
                        email: this.state.email,
                        phone: this.state.phone,
                        address: this.state.address,
                    }

                    const data = {
                        user: userData,
                        product: this.cart
                    }

                axios.post('/cart/checkout', data)
                .then(res => {
                    this.v$.$reset();
                    const sessionId = res.data.sessionId
                    stripe.redirectToCheckout({ sessionId })
                    this.cart = []
                    localStorage.setItem('cart', JSON.stringify(this.cart))
                })
                .catch(err => {
                    if(err.response && err.response.status === 400){
                        swal({
                            text: 'Error during checkout',
                            icon: 'error'
                        })
                    }
                })
            }
        }
    },
    computed:{
        productPrice(){
            return (product) => product.price * product.quantity
        },
        totalPrice(){
            let sum = 0
            for(let i = 0; i < this.cart.length; i++){
                sum += this.cart[i].price * this.cart[i].quantity
            }
            return sum
        },
        ...mapGetters(['user'])
    },
    created(){
        this.cart = JSON.parse(localStorage.getItem('cart')) || []
    }
}
</script>

<style>

</style>