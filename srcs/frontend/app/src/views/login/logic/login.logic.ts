import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default function useAuth() {
    const email = ref('')
    const password = ref('')
    const tokenSeg = ref('')
    const errorMessage = ref('')
    const router = useRouter()
    const needsAuthentication = ref(false);
    const errorToken = ref(false);
    const token = ref();

    const loginApp = () => {
        // Redirige al usuario a NestJS para iniciar la autenticación con 42network.
        window.location.href = '/api/auth/42';
    }

    const handleError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
          errorMessage.value = error.response?.data?.message || 'Error desconocido';
        } else if (error instanceof Error) {
          errorMessage.value = error.message;
        }
      };
    
    const login = async () => {
        try {
            const response = await axios.post('/api/auth/login', { email: email.value, password: password.value });
            token.value = response.data.token;
            needsAuthentication.value = response.data.authentication;

            if (!needsAuthentication.value) {
            localStorage.setItem('token', token.value);
            router.push('/load');
            }
        } catch (error) {
            handleError(error);
        }
    };

    const validateToken = async () => {
        const data = {
          token: tokenSeg.value
        };
        try {
            const response = await axios.post(`/api/auth/validate-2fa-login`, data, {
              headers: {
                'Authorization': `Bearer ${token.value}`
              }
            });
            console.log(response)
            if (response.data.status === 'success')
                localStorage.setItem('token', token.value)
                const redirectPath = '/load'
                router.push(redirectPath)
        } catch (error) {
          errorToken.value = true
          tokenSeg.value =''
          //console.error("Error de authentificacion 2FA:", error);
        }
    }

    return {
        email,
        password,
        errorMessage,
        login,
        loginApp,
        needsAuthentication,
        validateToken,
        tokenSeg,
        token,
        errorToken,
    }
}
