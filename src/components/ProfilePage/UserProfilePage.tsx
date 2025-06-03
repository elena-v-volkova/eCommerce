import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Avatar,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Switch,
  Spinner,
} from '@heroui/react';
import {
  Edit,
  Save,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Calendar,
  User,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Customer, Address as CTAddress } from '@commercetools/platform-sdk';
import { z } from 'zod';

import { useSession } from '@/shared/model/useSession';
import { UserProfileService } from '@/commercetools/tokenClient';

// Types
interface Address {
  id: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  isBilling?: boolean;
  isShipping?: boolean;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Validation schemas based on your utils
const namePattern = z
  .string()
  .regex(/^(?:\S(?:.*\S)?)?$/, { message: 'No leading or trailing spaces' })
  .regex(/^[A-ZА-Яа-яЁёa-z]+$/, {
    message:
      'Must contain at least one character and no special characters or numbers',
  });

const passwordSchema = z
  .string()
  .regex(/^(?:[^\s\t]+)?$/, { message: 'No spaces allowed' })
  .min(8, 'Minimum 8 characters')
  .max(20, { message: 'Password is too long' })
  .regex(/[a-z]/, { message: 'Must contain a lowercase letter' })
  .regex(/[A-Z]/, { message: 'Must contain at least 1 uppercase letter' })
  .regex(/[0-9]/, { message: 'Must contain a number' });

const emailSchema = z
  .string()
  .refine((val) => val === val.trim(), {
    message: 'Email must not have leading or trailing spaces',
  })
  .refine((val) => !val.includes(' '), {
    message: 'Email must not contain spaces',
  })
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Must be a valid email (e.g., user@example.com)',
  });

const countries = [
  { key: 'RU', label: 'Russia' },
  { key: 'JP', label: 'Japan' },
  { key: 'CA', label: 'Canada' },
  { key: 'GB', label: 'United Kingdom' },
];

export default function UserProfilePage() {
  const { user, setUser } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Customer | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [userProfileService, setUserProfileService] =
    useState<UserProfileService | null>(null);
  const isDataLoadedRef = useRef(false);

  const {
    isOpen: isAddressModalOpen,
    onOpen: onAddressModalOpen,
    onOpenChange: onAddressModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isPasswordModalOpen,
    onOpen: onPasswordModalOpen,
    onOpenChange: onPasswordModalOpenChange,
  } = useDisclosure();

  // Инициализация сервиса
  useEffect(() => {
    try {
      const service = new UserProfileService();

      setUserProfileService(service);
    } catch (err) {
      console.error('Error creating UserProfileService:', err);
      setError('Ошибка инициализации сервиса. Пожалуйста, войдите снова.');
    }
  }, []);

  // Загрузка данных пользователя
  const loadUserData = useCallback(async () => {
    if (!userProfileService || !user || isDataLoadedRef.current) return;

    try {
      setLoading(true);
      isDataLoadedRef.current = true;

      const fullUserData = await userProfileService.getCurrentUser();

      // Обновляем сессию с полными данными пользователя
      setUser(fullUserData);
      setEditedUser({ ...fullUserData });
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ошибка загрузки данных пользователя',
      );
      isDataLoadedRef.current = false; // Сброс флага при ошибке
    } finally {
      setLoading(false);
    }
  }, [userProfileService, user, setUser]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Validation functions
  const validateField = (field: string, value: string): string | null => {
    try {
      switch (field) {
        case 'firstName':
        case 'lastName':
          namePattern.parse(value);

          return null;
        case 'email':
          emailSchema.parse(value);

          return null;
        default:
          return null;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.errors[0]?.message || 'Invalid value';
      }

      return null;
    }
  };

  const validatePassword = (password: string): string | null => {
    try {
      passwordSchema.parse(password);

      return null;
    } catch (err) {
      if (err instanceof z.ZodError) {
        return err.errors[0]?.message || 'Invalid password';
      }

      return null;
    }
  };

  const mapAddress = (ctAddress: CTAddress, customer: Customer): Address => {
    return {
      id: ctAddress.id || '',
      firstName: ctAddress.firstName || '',
      lastName: ctAddress.lastName || '',
      streetName: ctAddress.streetName || '',
      streetNumber: ctAddress.streetNumber || '',
      city: ctAddress.city || '',
      postalCode: ctAddress.postalCode || '',
      country: ctAddress.country || '',
      isDefault:
        customer.defaultShippingAddressId === ctAddress.id ||
        customer.defaultBillingAddressId === ctAddress.id,
      isBilling:
        customer.billingAddressIds?.includes(ctAddress.id || '') || false,
      isShipping:
        customer.shippingAddressIds?.includes(ctAddress.id || '') || false,
    };
  };

  const handleEditToggle = () => {
    if (isEditing && user) {
      setEditedUser({ ...user });
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    if (!editedUser) return;

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[field];

        return newErrors;
      });
    }

    setEditedUser((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null,
    );
  };

  // Сохранение профиля
  const handleSaveProfile = async () => {
    if (!userProfileService || !editedUser || !user) {
      setError('Сервис не инициализирован');

      return;
    }

    // Валидация
    const errors: Record<string, string> = {};

    if (editedUser.firstName) {
      const firstNameError = validateField('firstName', editedUser.firstName);

      if (firstNameError) errors.firstName = firstNameError;
    }

    if (editedUser.lastName) {
      const lastNameError = validateField('lastName', editedUser.lastName);

      if (lastNameError) errors.lastName = lastNameError;
    }

    if (editedUser.email) {
      const emailError = validateField('email', editedUser.email);

      if (emailError) errors.email = emailError;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      return;
    }

    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      const actions: any[] = [];

      // Сравниваем и создаем actions для обновления
      if (editedUser.firstName !== user.firstName) {
        actions.push({
          action: 'setFirstName',
          firstName: editedUser.firstName,
        });
      }

      if (editedUser.lastName !== user.lastName) {
        actions.push({
          action: 'setLastName',
          lastName: editedUser.lastName,
        });
      }

      if (editedUser.email !== user.email) {
        actions.push({
          action: 'changeEmail',
          email: editedUser.email,
        });
      }

      if (editedUser.dateOfBirth !== user.dateOfBirth) {
        actions.push({
          action: 'setDateOfBirth',
          dateOfBirth: editedUser.dateOfBirth,
        });
      }

      if (actions.length > 0) {
        const updatedUser = await userProfileService.updateProfile(
          user.version,
          actions,
        );

        // Обновляем сессию с новыми данными пользователя
        setUser(updatedUser);
        setEditedUser({ ...updatedUser });
      }

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err instanceof Error ? err.message : 'Ошибка обновления профиля',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress({ ...address });
    onAddressModalOpen();
  };

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: '',
      firstName: editedUser?.firstName || '',
      lastName: editedUser?.lastName || '',
      streetName: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      country: 'RU',
      isDefault: false,
      isBilling: false,
      isShipping: false,
    };

    setSelectedAddress(newAddress);
    onAddressModalOpen();
  };

  // Сохранение адреса
  const handleSaveAddress = async () => {
    if (!selectedAddress || !userProfileService || !user) return;

    try {
      setSaving(true);
      setError(null);

      const addressData = {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        streetName: selectedAddress.streetName,
        streetNumber: selectedAddress.streetNumber,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      };

      let updatedCustomer;
      const actions: any[] = [];

      if (
        selectedAddress.id &&
        user.addresses?.find((a: any) => a.id === selectedAddress.id)
      ) {
        // Обновление существующего адреса
        actions.push({
          action: 'changeAddress',
          addressId: selectedAddress.id,
          address: addressData,
        });
      } else {
        // Добавление нового адреса
        actions.push({
          action: 'addAddress',
          address: addressData,
        });
      }

      updatedCustomer = await userProfileService.updateProfile(
        user.version,
        actions,
      );

      // Обработка свойств адреса
      if (
        selectedAddress.isDefault ||
        selectedAddress.isBilling ||
        selectedAddress.isShipping
      ) {
        const newAddressId =
          selectedAddress.id ||
          updatedCustomer.addresses?.[updatedCustomer.addresses.length - 1]?.id;

        if (newAddressId) {
          const additionalActions: any[] = [];

          if (selectedAddress.isDefault && selectedAddress.isShipping) {
            additionalActions.push({
              action: 'setDefaultShippingAddress',
              addressId: newAddressId,
            });
          }

          if (selectedAddress.isDefault && selectedAddress.isBilling) {
            additionalActions.push({
              action: 'setDefaultBillingAddress',
              addressId: newAddressId,
            });
          }

          if (selectedAddress.isShipping && !selectedAddress.isDefault) {
            additionalActions.push({
              action: 'addShippingAddressId',
              addressId: newAddressId,
            });
          }

          if (selectedAddress.isBilling && !selectedAddress.isDefault) {
            additionalActions.push({
              action: 'addBillingAddressId',
              addressId: newAddressId,
            });
          }

          if (additionalActions.length > 0) {
            updatedCustomer = await userProfileService.updateProfile(
              updatedCustomer.version,
              additionalActions,
            );
          }
        }
      }

      // Обновляем сессию с новыми данными пользователя
      setUser(updatedCustomer);
      setEditedUser({ ...updatedCustomer });
      onAddressModalOpenChange();
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err instanceof Error ? err.message : 'Ошибка сохранения адреса');
    } finally {
      setSaving(false);
    }
  };

  // Удаление адреса
  const handleDeleteAddress = async (addressId: string) => {
    if (!userProfileService || !user) return;

    try {
      setSaving(true);
      setError(null);

      const updatedCustomer = await userProfileService.removeAddress(
        user.version,
        addressId,
      );

      // Обновляем сессию с новыми данными пользователя
      setUser(updatedCustomer);
      setEditedUser({ ...updatedCustomer });
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err instanceof Error ? err.message : 'Ошибка удаления адреса');
    } finally {
      setSaving(false);
    }
  };

  // Изменение пароля
  const handlePasswordChange = async () => {
    if (!userProfileService || !user) return;

    // Валидация паролей
    const currentPasswordError = validatePassword(passwordData.currentPassword);
    const newPasswordError = validatePassword(passwordData.newPassword);

    if (currentPasswordError) {
      setError(`Текущий пароль: ${currentPasswordError}`);

      return;
    }

    if (newPasswordError) {
      setError(`Новый пароль: ${newPasswordError}`);

      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');

      return;
    }

    try {
      setSaving(true);
      setError(null);

      await userProfileService.changePassword(
        user.version,
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onPasswordModalOpenChange();

      // Показываем сообщение об успехе
      setError(null);
      console.log('Password changed successfully');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'Ошибка изменения пароля');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardBody className="text-center">
            <h2 className="mb-2 text-xl font-semibold">
              Пользователь не авторизован
            </h2>
            <p className="text-gray-600">
              Войдите в систему для просмотра профиля
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  const displayUser = editedUser || user;
  const userAddresses =
    user.addresses?.map((addr: any) => mapAddress(addr, user)) || [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Error display */}
      {error && (
        <Card className="mb-6 border-danger">
          <CardBody>
            <p className="text-danger">{error}</p>
            <Button
              className="mt-2"
              color="danger"
              size="sm"
              variant="light"
              onPress={() => setError(null)}
            >
              Закрыть
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            className="text-large"
            name={`${user.firstName} ${user.lastName}`}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <Button
          color={isEditing ? 'success' : 'primary'}
          isDisabled={saving}
          isLoading={saving}
          startContent={isEditing ? <Save size={18} /> : <Edit size={18} />}
          variant={isEditing ? 'solid' : 'bordered'}
          onPress={isEditing ? handleSaveProfile : handleEditToggle}
        >
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={20} />
              <h2 className="text-xl font-semibold">Личная информация</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              errorMessage={validationErrors.firstName}
              isInvalid={!!validationErrors.firstName}
              isReadOnly={!isEditing}
              label="Имя"
              value={
                isEditing ? displayUser.firstName || '' : user.firstName || ''
              }
              variant={isEditing ? 'bordered' : 'flat'}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            <Input
              errorMessage={validationErrors.lastName}
              isInvalid={!!validationErrors.lastName}
              isReadOnly={!isEditing}
              label="Фамилия"
              value={
                isEditing ? displayUser.lastName || '' : user.lastName || ''
              }
              variant={isEditing ? 'bordered' : 'flat'}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
            <Input
              errorMessage={validationErrors.email}
              isInvalid={!!validationErrors.email}
              isReadOnly={!isEditing}
              label="Email"
              startContent={<Mail size={18} />}
              type="email"
              value={isEditing ? displayUser.email : user.email}
              variant={isEditing ? 'bordered' : 'flat'}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <Input
              isReadOnly={!isEditing}
              label="Дата рождения"
              startContent={<Calendar size={18} />}
              type="date"
              value={
                isEditing
                  ? displayUser.dateOfBirth || ''
                  : user.dateOfBirth || ''
              }
              variant={isEditing ? 'bordered' : 'flat'}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />

            {isEditing && (
              <Button
                className="w-full"
                color="warning"
                startContent={<Lock size={18} />}
                variant="bordered"
                onPress={onPasswordModalOpen}
              >
                Изменить пароль
              </Button>
            )}
          </CardBody>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <h2 className="text-xl font-semibold">Адреса</h2>
              </div>
              {isEditing && (
                <Button
                  color="primary"
                  isDisabled={saving}
                  size="sm"
                  startContent={<Plus size={16} />}
                  onPress={handleAddAddress}
                >
                  Добавить
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {userAddresses.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  Адреса не добавлены
                </p>
              ) : (
                userAddresses.map((address: any) => (
                  <Card key={address.id} className="p-4" shadow="sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.streetNumber} {address.streetName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {countries.find((c) => c.key === address.country)
                            ?.label || address.country}
                        </p>
                        <div className="mt-2 flex gap-2">
                          {address.isDefault && (
                            <Chip color="primary" size="sm">
                              По умолчанию
                            </Chip>
                          )}
                          {address.isBilling && (
                            <Chip color="secondary" size="sm">
                              Для счетов
                            </Chip>
                          )}
                          {address.isShipping && (
                            <Chip color="success" size="sm">
                              Для доставки
                            </Chip>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            isDisabled={saving}
                            size="sm"
                            variant="light"
                            onPress={() => handleEditAddress(address)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            isIconOnly
                            color="danger"
                            isDisabled={saving}
                            size="sm"
                            variant="light"
                            onPress={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onAddressModalOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedAddress?.id
                  ? 'Редактировать адрес'
                  : 'Добавить новый адрес'}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Имя"
                    value={selectedAddress?.firstName || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, firstName: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Фамилия"
                    value={selectedAddress?.lastName || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, lastName: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Улица"
                    value={selectedAddress?.streetName || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, streetName: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Номер дома"
                    value={selectedAddress?.streetNumber || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, streetNumber: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Город"
                    value={selectedAddress?.city || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, city: e.target.value } : null,
                      )
                    }
                  />
                  <Input
                    label="Почтовый индекс"
                    value={selectedAddress?.postalCode || ''}
                    onChange={(e) =>
                      setSelectedAddress((prev) =>
                        prev ? { ...prev, postalCode: e.target.value } : null,
                      )
                    }
                  />
                  <Select
                    label="Страна"
                    selectedKeys={
                      selectedAddress?.country ? [selectedAddress.country] : []
                    }
                    onSelectionChange={(keys) => {
                      const country = Array.from(keys)[0] as string;

                      setSelectedAddress((prev) =>
                        prev ? { ...prev, country } : null,
                      );
                    }}
                  >
                    {countries.map((country: any) => (
                      <SelectItem key={country.key}>{country.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <Divider className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Адрес по умолчанию</span>
                    <Switch
                      isSelected={selectedAddress?.isDefault || false}
                      onValueChange={(value) =>
                        setSelectedAddress((prev) =>
                          prev ? { ...prev, isDefault: value } : null,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Адрес для счетов</span>
                    <Switch
                      isSelected={selectedAddress?.isBilling || false}
                      onValueChange={(value) =>
                        setSelectedAddress((prev) =>
                          prev ? { ...prev, isBilling: value } : null,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Адрес для доставки</span>
                    <Switch
                      isSelected={selectedAddress?.isShipping || false}
                      onValueChange={(value) =>
                        setSelectedAddress((prev) =>
                          prev ? { ...prev, isShipping: value } : null,
                        )
                      }
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button isDisabled={saving} variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isDisabled={saving}
                  isLoading={saving}
                  onPress={handleSaveAddress}
                >
                  Сохранить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onOpenChange={onPasswordModalOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Изменить пароль</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    endContent={
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                    label="Текущий пароль"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                  <Input
                    endContent={
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                    label="Новый пароль"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                  <Input
                    endContent={
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                    label="Подтвердите новый пароль"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button isDisabled={saving} variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="primary"
                  isDisabled={saving}
                  isLoading={saving}
                  onPress={handlePasswordChange}
                >
                  Изменить пароль
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
