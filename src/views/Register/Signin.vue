<template>
    <div>
        <div class="columns is-centered" style="margin-top: 15vh;">
            <div class="column is-half">
                <form action="" @submit.prevent="signin()">
                    <div class="card my-6 mx-6">
                        <div class="field px-6 py-2">
                            <label  class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" placeholder="Email" v-model="state.email" :class="{'is-danger': v$.email.$error}">
                            </div>
                            <span v-if="v$.email.$error">
                                <p class="help is-danger">{{ v$.email.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="Password" v-model="state.password" :class="{'is-danger': v$.password.$error}">
                            </div>
                            <span v-if="v$.password.$error">
                                <p class="help is-danger">{{ v$.password.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 pb-4">
                            <div class="control">
                                <button class="button is-dark is-fullwidth">SIGN IN</button>
                            </div>
                            <div class="mt-3 has-text-centered">
                                <router-link to="/signup">
                                    <p class="is-inline">Create Account</p>
                                </router-link>
                                <p class="is-inline"> \ </p>
                                <router-link to="/forgot-password">
                                    <p class="is-inline">Forgot your password?</p>
                                </router-link>
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
import { required, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
export default {
    name:"sign_in",
    setup(){
        const state = reactive({
            email: "",
            password: ""
        })

        const rules = computed(() => {
            return{
                email:{
                    requried: required,
                    email: email
                },
                password:{
                    required: required
                },
            }
        })

        const v$ = useVuelidate(rules, state)

        return{
            state,
            v$
        }
    },
    methods:{
        signin(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const data = {
                    email: this.state.email,
                    password: this.state.password
                }

                axios.post('/signin', data)
                .then(res => {
                    const token = res.data.token
                    localStorage.setItem('token', token)
                    // this.$store.dispatch('user', res.data.users)
                    this.$emit('auth-change')
                    this.$router.push({name: 'homepage'})
                    this.v$.$reset()
                    swal({
                        text: "Welcome",
                        icon: "success"
                    })
                })
                .catch(err => {
                    console.log(err)
                    if (err.response && err.response.status === 401) {
                        swal({
                            text: "Invalid Email or Password",
                            icon: "error"
                        })
                    }
                    else {
                        swal({
                            text: "An error occurred. Please try again later.",
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