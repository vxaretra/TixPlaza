import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
    try{
        setCookie(event, 'token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0 // Expire immediately
          });
        
          return { message: 'Logout Berhasil' };
    }catch(err){
        console.error('Logout error: ', err)

        throw createError({ statusCode: 500, statusMessage: "Logout Failed", message: "Terjadi kesalahan saat logout, mohon coba lagi" });
    }
  });