import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FiUser, FiMail, FiLock, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Define the register form schema using Zod
const registerSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.post('/auth/register', {
        uniqueIdentifier: data.email, // Usar email como identificador único
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Conta criada com sucesso!', {
        description: 'Você será redirecionado para o login',
      });
      // Redirect to login after a brief delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      toast.error('Falha no registro', {
        description: errorMessage,
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-base-200">
      {/* Left Side - Visual Branding - FULL SCREEN */}
      <div className="flex w-full bg-gradient-to-br from-primary to-primary-focus relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Back Button - Desktop */}
        <button
          onClick={() => navigate('/login')}
          className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Voltar ao login"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Register Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
          <div className="relative z-10 w-full max-w-lg px-6 sm:px-8">
            {/* Register Card */}
            <div className="w-full text-white animate-slide-in-right">
              {/* Register Card Container */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-10 sm:p-12 py-12 sm:py-16 min-h-[500px] sm:min-h-[550px] flex flex-col transition-all duration-300">
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Registrar</h2>
                  </div>
                  <p className="text-white/70 text-sm">Crie sua conta para acessar o sistema</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Name Field */}
                  <div className="form-control">
                    <label htmlFor="name" className="label pb-2">
                      <span className="label-text font-semibold text-sm text-white flex items-center gap-2">
                        <FiUser className="w-3.5 h-3.5" />
                        Nome
                      </span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      autoComplete="name"
                      className={`input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all h-12 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300/20' 
                          : ''
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isSubmitting}
                      {...register('name')}
                    />
                    <div className="h-7 mt-2">
                      {errors.name && (
                        <p className="text-sm text-red-200 flex items-center gap-1.5 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-control">
                    <label htmlFor="email" className="label pb-2">
                      <span className="label-text font-semibold text-sm text-white flex items-center gap-2">
                        <FiMail className="w-3.5 h-3.5" />
                        Email
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="seu.email@inf.ufrgs.br"
                      autoComplete="email"
                      className={`input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all h-12 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300/20' 
                          : ''
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isSubmitting}
                      {...register('email')}
                    />
                    <div className="h-7 mt-2">
                      {errors.email && (
                        <p className="text-sm text-red-200 flex items-center gap-1.5 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                    <label htmlFor="password" className="label pb-2">
                      <span className="label-text font-semibold text-sm text-white flex items-center gap-2">
                        <FiLock className="w-3.5 h-3.5" />
                        Senha
                      </span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all h-12 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300/20' 
                          : ''
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isSubmitting}
                      {...register('password')}
                    />
                    <div className="h-7 mt-2">
                      {errors.password && (
                        <p className="text-sm text-red-200 flex items-center gap-1.5 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-control">
                    <label htmlFor="confirm-password" className="label pb-2">
                      <span className="label-text font-semibold text-sm text-white flex items-center gap-2">
                        <FiLock className="w-3.5 h-3.5" />
                        Confirmar Senha
                      </span>
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all h-12 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-300/20' 
                          : ''
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isSubmitting}
                      {...register('confirmPassword')}
                    />
                    <div className="h-7 mt-2">
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-200 flex items-center gap-1.5 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn w-full h-12 font-semibold text-base bg-white hover:bg-white/90 text-primary border-0 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6 rounded-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Registrando...</span>
                      </span>
                    ) : (
                      'Registrar'
                    )}
                  </button>

                  {/* Back to Login Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn btn-outline w-full h-12 font-semibold text-base text-white border-white/30 hover:bg-white/10 hover:border-white transition-all mt-2 rounded-xl"
                  >
                    Voltar ao Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button - Mobile */}
        <button
          onClick={() => navigate('/login')}
          className="sm:hidden absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-300 active:scale-95"
          aria-label="Voltar ao login"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white/60 text-xs text-center bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm border-t border-white/10">
          <p className="font-medium">© 2025 INF Attendance · Instituto de Informática - UFRGS</p>
        </div>
      </div>
    </div>
  );
}
