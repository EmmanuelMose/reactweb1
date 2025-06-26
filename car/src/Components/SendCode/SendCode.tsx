import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const SendCodeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username }),
      });

      const result = await response.json();

      if (!response.ok || !result.exists) {
        alert('Username not found. Please try again.');
        return;
      }

      
      localStorage.setItem('username', data.username);

      const sendCodeResponse = await fetch('http://localhost:3001/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.username }),
      });

      const sendResult = await sendCodeResponse.json();

      if (sendCodeResponse.ok) {
        alert(`Verification code sent to ${data.username}`);
        navigate('/verify');
      } else {
        alert(sendResult.error || 'Failed to send verification code.');
      }

    } catch (error) {
      console.error('Error during code submission:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username.message as string}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendCodeForm;
