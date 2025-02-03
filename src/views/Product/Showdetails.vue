<template>
    <div>
        <!-- Product Section -->
        <div class="container box my-6">
            <div class="columns is-vcentered mt-5">

                <div class="column is-offset-1 is-4">
                    <img :src="'http://localhost:3000/uploads/product/' + file_path">
                </div>

                <div class="column is-6 mt-3">
                    <h4 class="title is-size-4 pb-3">{{ name }}</h4>
                    <h6 class="subtitle is-size-6 is-italic pb-3">{{ category_name }}</h6>
                    <h6 class="title is-size-6 has-text-weight-bold pb-3"> ฿ {{ price }}</h6>
                    <p class="subtitle is-size-6">
                        {{ description }}
                    </p>
                    <div class="columns">
                        <div class="column">
                            <div class="field has-addons">
                                <div class="control">
                                    <a class="button is-static mb-3">
                                        quantity
                                    </a>
                                    <span>
                                        <p class="subtitle is-size-6 has-text-grey" v-show="quantity >= 25">In stock</p>
                                        <p class="subtitle is-size-6 has-text-grey" v-show="quantity < 25">There are few products left</p>
                                        <p class="subtitle is-size-6 has-text-grey" v-show="quantity === 0">Out of stock</p>
                                    </span>
                                </div>
                                <div class="control" style="width: 20%;">
                                    <input class="input" type="number" min="1" value="1" v-model="add_quantity" :disabled="user ? user.role === 'admin' : false">
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <div class="control">
                                    <button class="button is-link is-light has-text-weight-bold" @click="addtoCart()" :disabled="user ? user.role === 'admin' : false">
                                        Add To Cart
                                        <span class="icon ml-2">
                                            <font-awesome-icon :icon="['fas', 'cart-shopping']"/>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="content mt-3">
                        <h5 class="title is-size-5 has-text-weight-bold">Benefit</h5>
                        <ul>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, voluptas.</li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, hic!</li>
                            <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic, ipsam!</li>
                        </ul>
                    </div> -->

                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-danger is-light has-text-weight-bold" @click="sendtoWishlist()" :disabled="user ? user.role === 'admin' : false">
                                <span class="icon mr-2" :class="{ 'has-text-danger': this.checkFavorite }">
                                    <font-awesome-icon :icon="[this.checkFavorite ? 'fas' : 'far', 'heart']" />
                                </span>
                                Add To Wishlist
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Comment Section -->
        <div class="container">
            <div class="columns">
                <div class="column is-8">
                    <div class="box">
                        <div class="media">
                            <!-- <div class="media-left">
                                <figure class="image is-128x128">
                                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                                </figure>
                            </div> -->

                            <div class="media-content">
                                <form @submit.prevent="addComment()">
                                    <div class="columns">
                                        <div class="column mx-2">
                                            <div class="field">
                                                <div class="control">
                                                    <div class="rate">
                                                        <input type="radio" id="star5" name="rate" value="5" v-model="state.rating"/>
                                                        <label class="label" for="star5">5 stars</label>
                                                        <input type="radio" id="star4" name="rate" value="4" v-model="state.rating"/>
                                                        <label class="label" for="star4">4 stars</label>
                                                        <input type="radio" id="star3" name="rate" value="3" v-model="state.rating"/>
                                                        <label class="label" for="star3">3 stars</label>
                                                        <input type="radio" id="star2" name="rate" value="2" v-model="state.rating"/>
                                                        <label class="label" for="star2">2 stars</label>
                                                        <input type="radio" id="star1" name="rate" value="1" v-model="state.rating"/>
                                                        <label class="label" for="star1">1 star</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="columns">
                                        <div class="column is-9 mx-4">
                                            <div class="field">
                                                <div class="control">
                                                    <!-- <input class="input" type="text" placeholder="Comment" v-model="state.comment" :class="{'is-danger': v$.comment.$error}"> -->
                                                    <textarea class="textarea" placeholder="Comment" v-model="state.comment" :class="{'is-danger': v$.comment.$error}"></textarea>
                                                </div>
                                                <span v-if="v$.comment.$error">
                                                    <p class="help is-danger">{{ v$.comment.$errors[0].$message }}</p>
                                                </span>
                                                <span v-if="v$.rating.$error">
                                                    <p class="help is-danger">{{ v$.rating.$errors[0].$message }}</p>
                                                </span>
                                            </div>

                                            <div class="field" v-if="user && user.role === 'user'">
                                                <div class="control">
                                                    <input class="input" type="hidden" name="user_id" :value="user.user_id">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="column my-6">
                                            <button class="button is-link is-fullwidth" :disabled="user ? user.role === 'admin' : false">Review</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    
                    <!-- comment data -->
                    <div class="columns">
                        <div class="column">
                            <div class="box" v-for="comments in comment" :key="comments.user_id">
                                <div class="media">
                                    <div class="media-left">
                                        <figure class="image is-128x128">
                                            <img class="is-rounded" :src="comments.file_path ? 'http://localhost:3000/uploads/profile/' + comments.file_path : 'https://bulma.io/images/placeholders/128x128.png'">
                                        </figure>
                                    </div>
                                    <div class="media-content my-5 mx-5">
                                        <StarComment :comment="comments" class="mb-4"/>
                                        <p class="subtitle is-size-6">{{ comments.comment }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="column" style="position: static;">
                    <div class="box">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-size-3 has-text-centered">Point Of Review</p>
                                <p class="title is-size-4">Rating</p>
                                <Star/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/plugins/axios';
import Star from '@/components/Star.vue'
import StarComment from '@/components/Star_comment.vue'
import swal from 'sweetalert';
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

export default {
    name: "show_details",
    components:{
        Star,
        StarComment
    },
    setup(){
        const state = reactive({
            rating: 0,
            comment: ""
        })

        const rules = computed(() => {
            return{
                comment:{
                    required: helpers.withMessage("Comment is required", required)
                },
                rating:{
                    required: required,
                    min: helpers.withMessage("Rating is required", checkinputNumber)
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
            user_id: 0,
            id: 0,
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            add_quantity: 1,
            file_path: "",
            category_name: "",
            wishlist: [],
            cart: [],
            comment: []
        }
    },
    computed: {
        checkFavorite() {
            return this.wishlist.some(item => item.product_id === this.id);
        },
        checkCart(){
            return this.cart.some(item => item.product_id === this.id)
        },
        ...mapGetters(['user'])
    },
    methods:{
        sendtoWishlist(){
            const token = localStorage.getItem('token')
            const data = {
                product_id: this.id,
                file_path: this.file_path,
                name: this.name,
                price: this.price,
                quantity: this.quantity,
            }
            if(token){
                if (this.checkFavorite) {
                    // Remove from wishlist
                    this.wishlist = this.wishlist.filter(item => item.product_id !== this.id);
                    swal({
                        text: "Product Has Removed From Wishlist",
                        button: "Ok",
                        icon: "success"
                    })
                } else {
                    // Add to wishlist
                    this.wishlist.push(data);
                    swal({
                        text: "Product Added To Wishlist",
                        button: "Ok",
                        icon: "success"
                    })
                }
                // Save the updated wishlist to localStorage
                localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
            }
            else{
                swal({
                    text: "Please Login First",
                    icon: "warning"
                })
            }
        },
        addtoCart(){
            const token = localStorage.getItem('token')
            const data = {
                product_id: this.id,
                file_path: this.file_path,
                name: this.name,
                price: this.price,
                quantity: this.add_quantity,
            }
            if(token){
                if(this.checkCart){
                    swal({
                        text: "This product has already been added",
                        button: "Ok",
                        icon: "warning"
                    })
                }
                if(this.quantity === 0){
                    swal({
                        text: "Product Out Of Stock",
                        icon: "error"
                    })
                }
                else{
                    swal({
                        text: "Product Added To Cart",
                        button: "Ok",
                        icon: "success"
                    })
                    this.cart.push(data)
                }
                localStorage.setItem('cart', JSON.stringify(this.cart))
            }
            else{
                swal({
                    text: "Please Login First",
                    icon: "warning"
                })
            }
        },
        addComment(){
            const token = localStorage.getItem('token')
            if(token){
                this.v$.$touch()
                if(!this.v$.$invalid){
                    const data = {
                        rating: this.state.rating,
                        comment: this.state.comment,
                        user_id: document.querySelector('div.control input[name=user_id]').value
                    }

                    axios.post(`/product/${this.$route.params.id}/comment`, data)
                    .then(res => {
                        swal({
                            text: res.data.message,
                            button: "Ok",
                            icon: "success"
                        })
                        this.v$.$reset()
                        this.rating = 0
                    })
                    .catch(err => {
                        if(err.response && err.response.status === 400){
                            swal({
                                text: "Somethings Went Wrong Can't Comment",
                                button: "Ok",
                                icon: "error"
                            })
                        }
                    })
                }
            }
            else{
                swal({
                    text: "Please Login First",
                    icon: "warning"
                })
            }
        }
    },
    created(){
        axios.get(`/product/${this.$route.params.id}`)
        .then(res => {
            this.id = res.data.id
            this.name = res.data.name
            this.description = res.data.description
            this.price = res.data.price
            this.quantity = res.data.quantity
            this.file_path = res.data.file_path
            this.category_name = res.data.category_name
        })
        .catch(err => {
            console.log(err)
        })

        axios.get(`/${this.$route.params.id}/comment`)
        .then(res => {
            this.comment = res.data.comment
        })
        .catch(err => {
            console.log(err)
        })

        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
        this.cart = JSON.parse(localStorage.getItem('cart')) || []
    },
}
</script>

<style>
    .rate {
        float: left;
        height: 46px;
        padding: 0 10px;
    }
    .rate:not(:checked) > input {
        position:absolute;
        left:-9999px;
    }
    .rate:not(:checked) > label {
        float:right;
        width:1em;
        overflow:hidden;
        white-space:nowrap;
        cursor:pointer;
        font-size:30px;
        color:#ccc;
    }
    .rate:not(:checked) > label:before {
        content: '★ ';
    }
    .rate > input:checked ~ label {
        color: #ffc700;
    }
    .rate:not(:checked) > label:hover,
    .rate:not(:checked) > label:hover ~ label {
        color: #deb217;
    }
    .rate > input:checked + label:hover,
    .rate > input:checked + label:hover ~ label,
    .rate > input:checked ~ label:hover,
    .rate > input:checked ~ label:hover ~ label,
    .rate > label:hover ~ input:checked ~ label {
        color: #c59b08;
    }
</style>