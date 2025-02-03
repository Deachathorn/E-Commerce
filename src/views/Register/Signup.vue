<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-half">
                <form action="" @submit.prevent="signup()">
                    <div class="card my-6 mx-6">
                        <div class="field px-6 py-2">
                            <label  class="label">First Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="First Name" v-model.trim="state.first_name" :class="{'is-danger': v$.first_name.$error}">
                            </div>
                            <span v-if="v$.first_name.$error">
                                <p class="help is-danger">{{ v$.first_name.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Last Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Last Name" v-model.trim="state.last_name" :class="{'is-danger': v$.last_name.$error}">
                            </div>
                            <span v-if="v$.last_name.$error">
                                <p class="help is-danger">{{ v$.last_name.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" placeholder="Email" v-model.trim="state.email" :class="{'is-danger': v$.email.$error}">
                            </div>
                            <span v-if="v$.email.$error">
                                <p class="help is-danger">{{ v$.email.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="Password" v-model.trim="state.password" :class="{'is-danger': v$.password.$error}">
                            </div>
                            <span v-if="v$.password.$error">
                                <p class="help is-danger">{{ v$.password.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Confirm Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="Confirm Password" v-model.trim="state.confirm_password" :class="{'is-danger': v$.confirm_password.$error}">
                            </div>
                            <span v-if="v$.confirm_password.$error">
                                <p class="help is-danger">{{ v$.confirm_password.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 pb-4">
                            <div class="control">
                                <button class="button is-dark is-fullwidth">CREATE</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert'
import axios from '@/plugins/axios'
import { useVuelidate } from '@vuelidate/core'
import { required, email, sameAs, minLength, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

function complexPassword (value) {
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        return false
    }
    return true
}

export default {
    name:"sign_up",
    setup(){
        const state = reactive({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: ""
        })

        const rules = computed(() => {
            return{
                first_name:{
                    required: required,
                },
                last_name:{
                    required: required,
                },
                email:{
                    required: required,
                    email: email
                },
                password:{
                    required: required,
                    minLength: minLength(8),
                    complex: helpers.withMessage("Password too easy", complexPassword)
                },
                confirm_password:{
                    required: required,
                    sameAs: helpers.withMessage("Passwords did not match", sameAs(state.password))
                }
            }
        })

        const v$ = useVuelidate(rules, state)

        return{
            state,
            v$
        }
    },
    methods:{
        signup(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const data = {
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    email: this.state.email,
                    password: this.state.password,
                    confirm_password: this.state.confirm_password
                }
                axios.post('/signup', data)
                .then(res => {
                    console.log(res.data)
                    this.v$.$reset()
                    swal({
                        text: "Sign Up Success",
                        icon: "success"
                    })
                    this.$router.push({name: 'signin'})
                })
                .catch(err =>{
                    if(err.response && err.response.status === 400){
                        swal({
                            text: "Can't Sign Up",
                            icon: "error"
                        })
                    }
                })
            }
        }
    }
}
</script>

<style>

</style>