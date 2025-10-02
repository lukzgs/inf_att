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
            {/* Card with gradient border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20"></div>
            <div className="relative card bg-base-100 shadow-2xl rounded-3xl overflow-hidden">
              <div className="card-body p-10 sm:p-12">
                {/* Header with accent line */}
                <div className="text-center mb-10">
                  <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                    <FiLock className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-4 tracking-tight">
                    Bem-vindo de volta
                  </h2>
                  <p className="text-lg text-base-content/70 font-medium">
                    Entre com suas credenciais para acessar
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                  {/* Email Field */}
                  <div className="form-control">
                    <label htmlFor="email" className="label pb-3">
                      <span className="label-text font-bold text-base uppercase tracking-wide text-base-content/80">
                        Email Institucional
                      </span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-300">
                        <div className="p-2 rounded-lg bg-base-200 group-focus-within:bg-primary/10 transition-colors">
                          <FiMail className="h-5 w-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="seu.nome@inf.ufrgs.br"
                        className={`input w-full pl-[4.5rem] pr-5 h-16 text-lg font-medium rounded-2xl transition-all duration-300 ${
                          errors.email 
                            ? 'border-2 border-error bg-error/5 focus:border-error focus:ring-4 focus:ring-error/20' 
                            : 'border-2 border-base-300 bg-base-200/50 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-base-100'
                        }`}
                        disabled={isSubmitting}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <label className="label pt-3">
                        <span className="label-text-alt text-error font-semibold flex items-center gap-2 text-base">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                    <label htmlFor="password" className="label pb-3">
                      <span className="label-text font-bold text-base uppercase tracking-wide text-base-content/80">
                        Senha
                      </span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-300">
                        <div className="p-2 rounded-lg bg-base-200 group-focus-within:bg-primary/10 transition-colors">
                          <FiLock className="h-5 w-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`input w-full pl-[4.5rem] pr-5 h-16 text-lg font-medium rounded-2xl transition-all duration-300 ${
                          errors.password 
                            ? 'border-2 border-error bg-error/5 focus:border-error focus:ring-4 focus:ring-error/20' 
                            : 'border-2 border-base-300 bg-base-200/50 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-base-100'
                        }`}
                        disabled={isSubmitting}
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <label className="label pt-3">
                        <span className="label-text-alt text-error font-semibold flex items-center gap-2 text-base">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.password.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-md" />
                      <span className="text-base font-semibold text-base-content/70 group-hover:text-base-content transition-colors">
                        Lembrar-me
                      </span>
                    </label>
                    <a href="#" className="text-base font-bold text-primary hover:text-primary-focus hover:underline transition-all">
                      Esqueceu a senha?
                    </a>
                  </div>

                  {/* Error Alert */}
                  {errors.root?.serverError && (
                    <div className="alert alert-error shadow-xl rounded-2xl border-2 border-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-base font-bold">{errors.root.serverError.message}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="form-control mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary h-16 text-xl font-black rounded-2xl shadow-2xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? (
                          <span className="flex items-center gap-3">
                            <span className="loading loading-spinner loading-md"></span>
                            Entrando no sistema...
                          </span>
                        ) : (
                          'Entrar no sistema'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-focus to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-base-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-base-100 text-base-content/50 font-bold uppercase tracking-wider">
                      Ou
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-lg text-base-content/80 font-medium">
                    Não tem uma conta?{' '}
                    <a href="#" className="font-black text-primary hover:text-primary-focus hover:underline transition-all text-xl">
                      Solicitar acesso
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-10 text-center">
            <p className="text-base text-base-content/70 font-medium">
              Problemas para acessar?{' '}
              <a href="#" className="font-bold text-primary hover:text-primary-focus hover:underline transition-all">
                Entre em contato com o suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}