<template>
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <router-link to="/">
                        <p class="title">CAT SHOP</p>
                    </router-link>
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" :class="{'is-active' : isActive}" @click="isActive = !isActive">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active' : isActive}">

                <div class="navbar-end">

                    <a class="navbar-item" v-if="user && user.role === 'user'">
                        <router-link to="/wishlist">
                            <p class="has-text-white">Wishlist</p>
                        </router-link>
                    </a>

                    <a class="navbar-item" v-if="user && user.role === 'user'">
                        <router-link to="/cart">
                            <p class="has-text-white">Shopping Cart</p>
                        </router-link>
                    </a>

                    <a class="navbar-item">
                        <router-link to="/product">
                            <p class="has-text-white">All Product</p>
                        </router-link>
                    </a>

                    <a class="navbar-item">
                        <router-link to="/category">
                            <p class="has-text-white">All Category</p>
                        </router-link>
                    </a>

                    <div class="navbar-item has-dropdown is-hoverable" v-if="user && user.role === 'admin'">
                        <a class="navbar-link">
                        ADMIN
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item">
                                <router-link to="/admin/category">
                                    ADMIN Category
                                </router-link>
                            </a>
                            <a class="navbar-item">
                                <router-link to="/admin/product">
                                    ADMIN Product
                                </router-link>
                            </a>
                            <a class="navbar-item">
                                <router-link to="/manage/admin">
                                    Manage Admin
                                </router-link>
                            </a>
                            <a class="navbar-item">
                                <router-link to="/manage/order">
                                    Manage Order
                                </router-link>
                            </a>
                        </div>
                    </div>

                    <div class="navbar-item" v-if="!user">
                        <div class="mr-5">
                            <router-link to="/signin">
                                <font-awesome-icon :icon="['fas', 'user']" :style="{color: 'white'}"/>
                            </router-link>
                        </div>
                    </div>
                    
                    <div class="navbar-item has-dropdown is-hoverable" v-if="user">
                        <a class="navbar-link">
                            <span>{{ user.first_name }} {{ user.last_name }}</span>
                        </a>
                        <!-- <div class="navbar-dropdown">
                            <a class="navbar-item">
                                <router-link :to="'/profile/' + user.user_id">
                                    Profile
                                </router-link>
                            </a>
                        </div> -->
                        <div class="navbar-dropdown">
                            <a class="navbar-item">
                                <router-link :to="'/profile/' + user.user_id">
                                    <strong>Profile</strong>
                                </router-link>
                            </a>
                            <a class=" navbar-item has-text-dark has-background-danger" href="javascript:void(0)" @click.prevent="logout()">
                                <strong>Log Out</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: "navbarView",
    data(){
        return{
            isActive: false,
        }
    },
    methods:{
        logout(){
            localStorage.removeItem('token')
            this.$store.dispatch('user', null)
            this.$router.push({name: 'signin'})
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
}
</script>

<style>

</style>