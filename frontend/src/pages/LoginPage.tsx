import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

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
      <div className="w-full max-w-md bg-base-100 p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
            INF Attendance
          </h1>
          <p className="mt-2 text-sm sm:text-base text-base-content/70">
            Por favor, faça login na sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'border-error' : ''}
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <a href="#" className="text-xs sm:text-sm text-primary hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-error' : ''}
            />
            {errors.password && (
              <p className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root?.serverError && (
            <div className="alert alert-error py-3">
              <span className="text-sm">{errors.root.serverError.message}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-base-content/60">
            Não tem uma conta?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              Solicitar acesso
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}