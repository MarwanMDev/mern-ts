import { useForm } from 'react-hook-form';
import { User } from '../../models/user';
import { login, LogInCredentials } from '../../network/auth_api';

interface LoginModalProps {
  show: string;
  onDismiss: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginModal = ({
  show,
  onDismiss,
  onLoginSuccess,
}: LoginModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LogInCredentials>();

  async function onSubmit(credentials: LogInCredentials) {
    try {
      const user = await login(credentials);
      onLoginSuccess(user);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div className={`modal modal-${show}`}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-center mb-10">
            Login
          </h3>
          <p className="py-4">
            <form onSubmit={handleSubmit(onSubmit)} id="loginForm">
              <div className="form-control w-full min-w-full">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full min-w-full"
                  {...register('username', { required: true })}
                />
              </div>
              <div className="form-control w-full min-w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full min-w-full"
                  {...register('password', { required: true })}
                />
              </div>
            </form>
          </p>
          <div className="modal-action">
            <button
              type="submit"
              form="loginForm"
              className="btn btn-primary w-full mt-10"
              disabled={isSubmitting}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
