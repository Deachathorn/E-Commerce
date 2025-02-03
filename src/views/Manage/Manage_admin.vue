<template>
    <section class="section container is-max-desktop" v-if="user && user.role === 'admin'">
        <h1 class="title is-4">
            Admin Management
        </h1>

        <div class="box">
            <div class="columns">
                <div class="column" style="display: flex; justify-content: space-between;">
                    <p class="subtitle is-5 my-3">Name List</p>
                    <div class="field">
                        <div class="control">
                            <router-link :to="{name: 'add_admin'}">
                                <button class="button is-link">Add Admin</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column" style="display: flex; justify-content: center;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Edit</th>
                                <th>Save</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody v-for="(admins, index) in admin" :key="admins.user_id">
                            <tr>
                                <td>
                                    <p> {{ index + 1 }} </p>
                                </td>
                                <td>
                                    <p v-if="admins.toggle ? false : true"> {{ admins.first_name }} </p>
                                    <input class="input" type="text" v-model="first_name" v-else>
                                </td>
                                <td>
                                    <p v-if="admins.toggle ? false : true"> {{ admins.last_name }} </p>
                                    <input class="input" type="text" v-model="last_name" v-else>
                                </td>
                                <td>
                                    <p v-if="admins.toggle ? false : true"> {{ admins.email }} </p>
                                    <input class="input" type="email" v-model="email" v-else>
                                </td>
                                <td>
                                    <p> {{ admins.role }} </p>
                                </td>
                                <td>
                                    <button class="button is-link" @click="editAdmin(index)">Edit</button>
                                </td>
                                <td>
                                    <button class="button is-success" @click="saveEditAdmin(admins)">Save</button>
                                </td>
                                <td>
                                    <button class="button is-danger" @click="deleteAdmin(admins)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from '@/plugins/axios'
import swal from 'sweetalert'
import {mapGetters} from 'vuex'
export default {
    name: "manage_admin",
    data(){
        return{
            admin: null,
            first_name: "",
            last_name: "",
            email: "",
            toggle: false
        }
    },
    methods:{
        editAdmin(index){
            this.admin[index].toggle = !this.admin[index].toggle
            this.first_name = this.admin[index].first_name
            this.last_name = this.admin[index].last_name
            this.email = this.admin[index].email
        },
        saveEditAdmin(admins){
            const data = {
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email
            }
            axios.put(`/manage/update/admin/${admins.user_id}`, data)
            .then(res => {
                admins.toggle = false
                admins.first_name = res.data.first_name
                admins.last_name = res.data.last_name
                admins.email = res.data.email
                swal({
                    text: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                if(err.response && err.response.status === 400){
                    swal({
                        text: "Update fail",
                        icon: 'error'
                    })
                }
            })
        },
        deleteAdmin(admins, index){
            axios.delete(`/manage/delete/admin/${admins.user_id}`)
            .then(res => {
                if(res.status === 201){
                    swal({
                        text: res.data.message,
                        icon: 'success'
                    })
                    this.admin.splice(index, 1)
                }
            })
            .catch(err => {
                console.log(err)
                if(err.response && err.response.status === 404){
                    swal({
                        text: "User not found",
                        icon: 'error'
                    })
                }
                if(err.response && err.response.status === 400){
                    swal({
                        text: "Something Went Wrong",
                        icon: 'error'
                    })
                }
            })
        }
    },
    computed:{
        ...mapGetters(['user'])
    },
    created(){
        axios.get('/manage/admin')
        .then(res => {
            this.admin = res.data.admin
        })
        .catch(err => {
            console.log(err)
        })
    },
    mounted(){

    }
}
</script>

<style>

</style>