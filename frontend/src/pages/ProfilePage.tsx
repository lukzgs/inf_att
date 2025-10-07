import { useState } from 'react';
import { FiUser, FiLock, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
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
    // Clear error on change
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
      // TODO: Integrate with API
      // await api.put(`/users/${user?.id}`, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // TODO: Integrate with API
      // await api.put(`/users/${user?.id}/password`, passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const getRoleBadge = (roles: string[]) => {
    const role = roles[0] || 'USER'; // Pega o primeiro role
    const badges = {
      ADMIN: 'badge-error',
      TEACHER: 'badge-info',
      PROFESSOR: 'badge-info',
      STUDENT: 'badge-success',
      USER: 'badge-ghost',
    };
    return badges[role as keyof typeof badges] || 'badge-ghost';
  };

  const getRoleLabel = (roles: string[]) => {
    const role = roles[0] || 'USER'; // Pega o primeiro role
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Meu Perfil</h1>
        <p className="text-base-content/70 mt-2">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="lg:col-span-1">
          <div className="premium-card p-6 text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-32 h-32">
                <span className="text-5xl font-bold">
                  {formatNameToInitials(user.name)}
                </span>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-base-content mb-2">{user.name}</h2>
            
            <div className="flex justify-center gap-2 mb-4">
              <span className={`badge ${getRoleBadge(user.roles)}`}>
                {getRoleLabel(user.roles)}
              </span>
            </div>

            <p className="text-base-content/70 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <FiUser className="text-primary" />
                Informações Pessoais
              </h3>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-accent"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nome Completo</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name}</span>
                  </label>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">E-mail</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email}</span>
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-2 justify-end pt-4">
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost"
                    disabled={isSaving}
                  >
                    <FiX /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-accent"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <FiSave /> Salvar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Card */}
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <FiLock className="text-primary" />
                Alterar Senha
              </h3>
              
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn btn-sm btn-outline btn-accent"
                >
                  Alterar
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <p className="text-base-content/70 text-sm">
                Por segurança, recomendamos alterar sua senha periodicamente
              </p>
            ) : (
              <div className="space-y-4">
                {/* Current Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Senha Atual</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={`input input-bordered w-full ${errors.currentPassword ? 'input-error' : ''}`}
                    placeholder="Digite sua senha atual"
                  />
                  {errors.currentPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.currentPassword}</span>
                    </label>
                  )}
                </div>

                {/* New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nova Senha</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`input input-bordered w-full ${errors.newPassword ? 'input-error' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.newPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.newPassword}</span>
                    </label>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirmar Nova Senha</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Digite a senha novamente"
                  />
                  {errors.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                    </label>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-4">
                  <button
                    onClick={handleCancelPasswordChange}
                    className="btn btn-ghost"
                    disabled={isSaving}
                  >
                    <FiX /> Cancelar
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="btn btn-accent"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Alterando...
                      </>
                    ) : (
                      <>
                        <FiLock /> Alterar Senha
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
  );
}
