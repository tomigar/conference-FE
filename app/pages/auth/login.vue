<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="p-4  rounded-lg shadow-md">
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="login">
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormField>
    
                <UFormField label="Password" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormField>
    
                <UButton type="submit">
                    Login
                Submit
                </UButton>
            </UForm>   
        </div>
    </div>
</template>

<script setup lang="ts">
import { useApiCalls } from '~~/composables/useApiCalls'
import * as v from 'valibot'

const api = useApiCalls()

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})



const state = reactive({
  email: 'tomi@aaa.sk',
  password: 'Password1'
})

const toast = useToast()
const login = async () => {
  try {
    const {data} = await api.auth.login(state)
    console.log(data)
    toast.add(
    { 
        title: 'Success', 
        description: 'The form has been submitted.', 
        color: 'success', 
        ui: {root: "fixed flex top-10 flex h-20 w-auto mx-auto w-96"} 
    })
    sessionStorage.setItem('user', JSON.stringify(data))
    navigateTo('/dashboard/conferences')
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}
</script>

<style scoped>

</style>