<template>
    <div>
        <div class="columns is-centered" style="margin-top: 15vh;">
            <div class="column is-half">
                <form action="" @submit.prevent="submit()">
                    <div class="card my-6 mx-6">
                        <div class="field px-6 py-2">
                            <label  class="label">Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="Password" v-model="state.password" :class="{'is-danger': v$.password.$error}">
                            </div>
                            <span v-if="v$.password.$error">
                                <p class="help is-danger">{{ v$.password.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 py-2">
                            <label  class="label">Confirm Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="Confirm Password" v-model="state.confirm_password" :class="{'is-danger': v$.confirm_password.$error}">
                            </div>
                            <span v-if="v$.confirm_password.$error">
                                <p class="help is-danger">{{ v$.confirm_password.$errors[0].$message }}</p>
                            </span>
                        </div>

                        <div class="field px-6 pb-4">
                            <div class="control">
                                <button class="button is-dark is-fullwidth">SUBMIT</button>
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
import { required, sameAs, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

function complexPassword (value) {
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        return false
    }
    return true
}

export default {
    setup(){
        const state = reactive({
            password: "",
            confirm_password: ""
        })

        const rules = computed(() => {
            return{
                password:{
                    required: required,
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
        submit(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const data = {
                    password: this.state.password,
                    confirm_password: this.state.confirm_password
                }

                axios.post(`/reset-password/${this.$route.params.user_id}/${this.$route.params.reset_token}`, data)
                .then(res => {
                    swal({
                        text: res.data.message,
                        icon: 'success'
                    })
                    this.$router.push('/signin')
                })
                .catch(err => {
                    if(err.response && err.response.status === 404){
                        swal({
                            text: "Use not found",
                            icon: 'error'
                        })
                    }
                    if(err.response && err.response.status === 400){
                        swal({
                            text: "Can't change password",
                            icon: 'error'
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