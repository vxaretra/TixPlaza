export const useAuthUser = () => {
    const cookie = useCookie('auth_user')
    return useState('authUser', () => cookie.value || null)
}