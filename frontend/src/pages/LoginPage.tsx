import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FiCalendar, FiUsers, FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

// Define the shape of the login response
interface LoginResponse {
  access_token: string;
}

// Define the form schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
});

// Infer the type from the schema
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      const token = response.data.access_token;
      await login(token);
      toast.success('Login realizado com sucesso!', {
        description: 'Você será redirecionado...',
      });
    } catch (err) {
      setError('root.serverError', {
        type: 'manual',
        message: 'Falha no login. Verifique suas credenciais.',
      });
      toast.error('Falha no login', {
        description: 'Verifique suas credenciais e tente novamente.',
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-base-200">
      {/* Left Side - Visual Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="relative z-10 text-white max-w-lg w-full">
            {/* Logo/Icon */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <FiCalendar className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">INF Attendance</h1>
                <p className="text-white/90 text-base mt-1">Sistema de Gestão Acadêmica</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FiCheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Controle de Presença</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Gerencie a frequência de alunos de forma simples e eficiente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FiUsers className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Gestão de Turmas</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Organize disciplinas, turmas e horários em um só lugar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FiCalendar className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Relatórios Automáticos</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Acompanhe métricas e gere relatórios detalhados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white/70 text-sm text-center bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
          <p className="font-medium">© 2025 INF Attendance · Instituto de Informática - UFRGS</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <FiCalendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">INF Attendance</h1>
            <p className="text-base-content/60 text-sm mt-1">Sistema de Gestão Acadêmica</p>
          </div>

          {/* Login Card */}
          <div className="relative">
            {/* Subtle gradient glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur-sm opacity-30"></div>
            
            <div className="relative bg-white dark:bg-base-100 shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-base-300">
              <div className="p-8 sm:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                    <FiLock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    INF Attendance
                  </h2>
                  <p className="text-base text-gray-600 dark:text-base-content/70">
                    Faça login para continuar
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="form-control">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-base-content mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="seu.email@inf.ufrgs.br"
                        autoComplete="email"
                        className={`w-full pl-12 pr-4 py-4 text-base bg-gray-50 dark:bg-base-200 border-2 rounded-xl transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 dark:border-base-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-base-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={isSubmitting}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-error flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-base-content mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={`w-full pl-12 pr-4 py-4 text-base bg-gray-50 dark:bg-base-200 border-2 rounded-xl transition-all duration-200 ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 dark:border-base-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-base-100'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={isSubmitting}
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 dark:text-error flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-base-content/80 group-hover:text-gray-900 dark:group-hover:text-base-content transition-colors">
                        Lembrar-me
                      </span>
                    </label>
                    <a 
                      href="#" 
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-primary dark:hover:text-primary-focus transition-colors"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>

                  {/* Error Alert */}
                  {errors.root?.serverError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-error/10 border-l-4 border-red-500 dark:border-error rounded-lg">
                      <svg
                        className="w-5 h-5 text-red-500 dark:text-error flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-error">
                          Erro ao fazer login
                        </p>
                        <p className="text-sm text-red-700 dark:text-error/80 mt-1">
                          {errors.root.serverError.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Entrando...
                      </span>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-base-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-base-100 text-gray-500 dark:text-base-content/60 font-medium">
                      Ou
                    </span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-base-content/70">
                    Não tem uma conta?{' '}
                    <a 
                      href="#" 
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-primary dark:hover:text-primary-focus transition-colors"
                    >
                      Solicitar acesso
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-base-content/60">
              Problemas para acessar?{' '}
              <a 
                href="#" 
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-primary dark:hover:text-primary-focus transition-colors"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}