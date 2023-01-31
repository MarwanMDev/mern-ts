import { useForm } from 'react-hook-form';
import { User } from '../../models/user';
import { signUp, SignUpCredentials } from '../../network/auth_api';

interface SignUpModalProps {
  show: string;
  onDismiss: () => void;
  onSignUpSuccess: (user: User) => void;
}
const SignUpModal = ({
  show,
  onDismiss,
  onSignUpSuccess,
}: SignUpModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const nUser = await signUp(credentials);
      onSignUpSuccess(nUser);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className={`modal modal-${show}`}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-center mb-10">
            Sign Up
          </h3>
          <p className="py-4">
            <form onSubmit={handleSubmit(onSubmit)} id="signupForm">
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
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input input-bordered w-full min-w-full"
                  {...register('email', { required: true })}
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
              form="signupForm"
              className="btn btn-primary w-full mt-10"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;
