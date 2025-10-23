import { useState } from 'react';
import { FiUser, FiLock, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { validateEmail, validateRequired } from '@/utils/validation';
import { formatNameToInitials } from '@/utils/format';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateRequired(formData.name, 'Nome');
    if (!nameValidation.valid) newErrors.name = nameValidation.message;

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    const newPassValidation = validateRequired(passwordData.newPassword, 'Nova senha');
    if (!newPassValidation.valid) {
      newErrors.newPassword = newPassValidation.message;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter no mínimo 6 caracteres';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
      });
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Senha alterada com sucesso!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Erro ao alterar senha');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setIsChangingPassword(false);
  };

  const getRoleLabel = (roles: string[]) => {
    const role = roles[0] || 'USER';
    const labels = {
      ADMIN: 'Administrador',
      TEACHER: 'Professor',
      PROFESSOR: 'Professor',
      STUDENT: 'Aluno',
      USER: 'Usuário',
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Main Card Container */}
      <div className="bg-white dark:bg-base-100 rounded-2xl border border-gray-200 dark:border-base-content/10 overflow-hidden">
        {/* Card Header with Title */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Meu Perfil
          </h1>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-base-100 rounded-xl p-6 border border-gray-200 dark:border-base-content/10 text-center sticky top-20">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center border-2 border-primary/30 dark:border-primary/40">
                <span className="text-4xl sm:text-5xl font-bold text-primary">
                  {formatNameToInitials(user.name)}
                </span>
              </div>
            </div>
            
            {/* Name */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
              {user.name}
            </h2>
            
            {/* Role Badge */}
            <div className="flex justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-medium text-xs sm:text-sm rounded-full border border-primary/20 dark:border-primary/40">
                {getRoleLabel(user.roles)}
              </span>
            </div>

            {/* Email */}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">
              {user.email}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white dark:bg-base-100 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-base-content/10">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Informações Pessoais
                </h3>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all flex-shrink-0"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                    Nome Completo
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={`input input-bordered w-full text-gray-900 dark:text-white focus:border-primary transition-all text-sm h-10 rounded-lg ${
                    isEditing 
                      ? 'bg-white dark:bg-base-100 border border-gray-200 dark:border-base-content/20' 
                      : '!bg-gray-100 dark:!bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  } ${errors.name ? '!border-2 !border-red-500 dark:!border-red-500' : ''}`}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                    E-mail
                  </span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={`input input-bordered w-full text-gray-900 dark:text-white focus:border-primary transition-all text-sm h-10 rounded-lg ${
                    isEditing 
                      ? 'bg-white dark:bg-base-100 border border-gray-200 dark:border-base-content/20' 
                      : '!bg-gray-100 dark:!bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  } ${errors.email ? '!border-2 !border-red-500 dark:!border-red-500' : ''}`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 -mx-5 sm:-mx-6 px-5 sm:px-6 py-6 mt-6 flex justify-center gap-4">
                  <button
                    onClick={handleCancel}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 min-w-[140px]"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 gap-2 flex items-center justify-center min-w-[140px]"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">Salvando...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span className="hidden sm:inline">Salvar</span>
                        <span className="sm:hidden">Salvar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white dark:bg-base-100 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-base-content/10">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center flex-shrink-0">
                  <FiLock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Alterar Senha
                </h3>
              </div>
              
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all flex-shrink-0"
                >
                  Alterar
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Por segurança, recomendamos alterar sua senha periodicamente
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                      Senha Atual
                    </span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white focus:border-primary transition-all text-sm h-10 rounded-lg ${
                      errors.currentPassword ? 'border-2 border-red-500 dark:border-red-500' : 'border border-gray-200 dark:border-base-content/20'
                    }`}
                    placeholder="Digite sua senha atual"
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                      Nova Senha
                    </span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white focus:border-primary transition-all text-sm h-10 rounded-lg ${
                      errors.newPassword ? 'border-2 border-red-500 dark:border-red-500' : 'border border-gray-200 dark:border-base-content/20'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">
                      Confirmar Nova Senha
                    </span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white focus:border-primary transition-all text-sm h-10 rounded-lg ${
                      errors.confirmPassword ? 'border-2 border-red-500 dark:border-red-500' : 'border border-gray-200 dark:border-base-content/20'
                    }`}
                    placeholder="Digite a senha novamente"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 -mx-5 sm:-mx-6 px-5 sm:px-6 py-6 mt-6 flex justify-center gap-4">
                  <button
                    onClick={handleCancelPasswordChange}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 min-w-[140px]"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 gap-2 flex items-center justify-center min-w-[140px]"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="hidden sm:inline">Alterando...</span>
                      </>
                    ) : (
                      <>
                        <FiLock className="w-4 h-4" />
                        <span className="hidden sm:inline">Alterar Senha</span>
                        <span className="sm:hidden">Alterar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
