import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
    } catch (err) {
      setError('root.serverError', {
        type: 'manual',
        message: 'Falha no login. Verifique suas credenciais.',
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              INF Attendance
            </h1>
            <p className="mt-2 text-sm sm:text-base text-base-content/70">
              Por favor, faça login na sua conta
            </p>
          </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
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
              <a href="#" className="label-text-alt link link-hover link-primary">
                Esqueceu a senha?
              </a>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.password.message}</span>
              </label>
            )}
          </div>

          {errors.root?.serverError && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            >
              Entrar
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="divider"></div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-base-content/60">
            Não tem uma conta?{' '}
            <a href="#" className="link link-primary font-medium">
              Solicitar acesso
            </a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}