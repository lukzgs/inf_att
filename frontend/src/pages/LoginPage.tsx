import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { FiCalendar, FiUsers, FiCheckCircle, FiLock, FiMail, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useState } from 'react';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      const token = response.data.access_token;
      await login(token);
      toast.success('Login realizado com sucesso!');
    } catch (err: any) {
      // Apenas toast, sem erro no card
      const errorMessage = err?.response?.data?.message || 'Verifique suas credenciais e tente novamente.';
      toast.error('Falha no login', {
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

        {/* Carousel Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
          {/* Left Arrow Button - Desktop */}
          {currentSlide === 1 && (
            <button
              onClick={() => setCurrentSlide(0)}
              className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Slide anterior"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Button - Desktop */}
          {currentSlide === 0 && (
            <button
              onClick={() => setCurrentSlide(1)}
              className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Próximo slide"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="relative z-10 w-full max-w-lg px-6 sm:px-8">
            {/* Slide 1 - Welcome Card */}
            {currentSlide === 0 && (
              <div className="w-full text-white animate-slide-in-left">
                {/* Card Container */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-10 sm:p-12 py-12 sm:py-16 min-h-[500px] sm:min-h-[550px] flex flex-col transition-all duration-300">
                  {/* Logo/Icon */}
                  <div className="mb-10 sm:mb-14 text-center">
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                        <FiCalendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">INF Attendance</h1>
                        <p className="text-white/90 text-xs sm:text-sm font-medium mt-1">Sistema de Gestão Acadêmica</p>
                      </div>
                    </div>
                    <div className="h-1 w-12 sm:w-16 bg-white/40 rounded-full mx-auto" />
                  </div>

                  {/* Features */}
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
                        <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Controle de Presença</h3>
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                          Gerencie a frequência de forma simples e eficiente
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
                        <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Gestão de Turmas</h3>
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                          Organize disciplinas e horários em um só lugar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2 - Login Card */}
            {currentSlide === 1 && (
              <div className="w-full text-white animate-slide-in-right">
                {/* Login Card Container */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-10 sm:p-12 py-12 sm:py-16 min-h-[500px] sm:min-h-[550px] flex flex-col transition-all duration-300">
                  {/* Header */}
                  <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <FiLock className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold">Login</h2>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        autoComplete="current-password"
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn w-full h-12 font-semibold text-base bg-white hover:bg-white/90 text-primary border-0 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-8 rounded-xl"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Entrando...</span>
                        </span>
                      ) : (
                        'Entrar'
                      )}
                    </button>

                    {/* Register Button */}
                    <button
                      type="button"
                      onClick={() => {/* TODO: Implementar navegação para registro */}}
                      className="btn btn-outline w-full h-12 font-semibold text-base text-white border-white/30 hover:bg-white/10 hover:border-white transition-all mt-3 rounded-xl"
                    >
                      Registrar
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              <button 
                onClick={() => setCurrentSlide(0)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === 0 ? 'bg-white w-8' : 'bg-white/40'}`}
              ></button>
              <button 
                onClick={() => setCurrentSlide(1)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === 1 ? 'bg-white w-8' : 'bg-white/40'}`}
              ></button>
            </div>

            {/* Mobile Navigation Button - Centered Below Indicators */}
            <div className="sm:hidden flex justify-center mt-4">
              {currentSlide === 1 ? (
                <button
                  onClick={() => setCurrentSlide(0)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-300 active:scale-95"
                  aria-label="Slide anterior"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentSlide(1)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-300 active:scale-95"
                  aria-label="Próximo slide"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white/60 text-xs text-center bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm border-t border-white/10">
          <p className="font-medium">© 2025 INF Attendance · Instituto de Informática - UFRGS</p>
        </div>
      </div>
    </div>
  );
}