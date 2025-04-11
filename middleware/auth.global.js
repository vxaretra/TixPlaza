export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) return

  const token = useCookie('token')
  const publicRoutes = ['auth-login', 'auth-register']
  const isPublic = publicRoutes.includes(to.name)

  // If route doesn't exist (e.g., /), handle based on token
  if (!to.name) {
    return navigateTo(token.value ? '/home' : '/auth/login')
  }

  // If non-public route and no token, redirect to login
  if (!isPublic && !token.value) {
    return navigateTo('/auth/login')
  }
  if(isPublic && token.value){
    return navigateTo('/home')
  }
})
