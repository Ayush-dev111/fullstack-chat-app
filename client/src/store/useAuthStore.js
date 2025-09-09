import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
export const useAuthStore = create((set) => ({
    authUser: null,

    isCheckingAuth: true,

    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,

    checkAuth : async()=> {
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            set({ authUser: response.data});
        } catch (error)  {
            console.log(error);
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
                    
        }
}));
