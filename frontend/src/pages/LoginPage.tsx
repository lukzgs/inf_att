import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FiCalendar, FiUsers, FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';

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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center text-white max-w-lg mx-auto">
          {/* Logo/Icon */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FiCalendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">INF Attendance</h1>
              <p className="text-white/80 text-sm">Sistema de Gestão Acadêmica</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Controle de Presença</h3>
                <p className="text-white/70 text-sm">
                  Gerencie a frequência de alunos de forma simples e eficiente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Gestão de Turmas</h3>
                <p className="text-white/70 text-sm">
                  Organize disciplinas, turmas e horários em um só lugar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Relatórios Automáticos</h3>
                <p className="text-white/70 text-sm">
                  Acompanhe métricas e gere relatórios detalhados
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 text-white/60 text-sm">
            <p>© 2025 INF Attendance. Instituto de Informática - UFRGS</p>
          </div>
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
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
                  Bem-vindo de volta
                </h2>
                <p className="mt-2 text-sm text-base-content/70">
                  Entre com suas credenciais para acessar o sistema
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text font-medium">Email institucional</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="seu.nome@inf.ufrgs.br"
                      className={`input input-bordered w-full pl-10 ${
                        errors.email ? 'input-error' : 'focus:input-primary'
                      }`}
                      disabled={isSubmitting}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text font-medium">Senha</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={`input input-bordered w-full pl-10 ${
                        errors.password ? 'input-error' : 'focus:input-primary'
                      }`}
                      disabled={isSubmitting}
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password.message}</span>
                    </label>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="label cursor-pointer gap-2 p-0">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                    <span className="label-text">Lembrar-me</span>
                  </label>
                  <a href="#" className="link link-primary link-hover font-medium">
                    Esqueceu a senha?
                  </a>
                </div>

                {/* Error Alert */}
                {errors.root?.serverError && (
                  <div className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
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
                    <span className="text-sm">{errors.root.serverError.message}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <Button
                    type="submit"
                    size="block"
                    loading={isSubmitting}
                    className="btn-primary text-base font-semibold h-12"
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar no sistema'}
                  </Button>
                </div>
              </form>

              {/* Footer */}
              <div className="divider text-xs text-base-content/50">OU</div>
              <div className="text-center">
                <p className="text-sm text-base-content/70">
                  Não tem uma conta?{' '}
                  <a href="#" className="link link-primary font-semibold hover:underline">
                    Solicitar acesso
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/50">
              Problemas para acessar?{' '}
              <a href="#" className="link link-hover text-base-content/70">
                Entre em contato com o suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}