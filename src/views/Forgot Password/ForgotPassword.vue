<template>
        <div>
        <div class="columns is-centered" style="margin-top: 15vh;">
            <div class="column is-half">
                <form action="" @submit.prevent="submit()">
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
import { required, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
export default {
    setup(){
        const state = reactive({
            email: "",
        })

        const rules = computed(() => {
            return{
                email:{
                    requried: required,
                    email: email
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
        submit(){
            this.v$.$touch()
            if(!this.v$.$invalid){
                const data = {
                    email: this.state.email
                }

                axios.post('/forgot-password', data)
                .then(res => {
                    swal({
                        text: res.data.message,
                        icon: 'success'
                    })
                })
                .catch(err => {
                    if(err.response && err.response.status === 404){
                        swal({
                            text: "User not found",
                            icon: 'error'
                        })
                    }
                    if(err.response && err.response.status === 400){
                        swal({
                            text: "Can't send mail",
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