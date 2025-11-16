import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, Loader2, FileText, Check } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );

      if (result.success) {
        navigate('/dashboard');
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length >= 6 && password.length < 10) return 'medium';
    return 'strong';
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glow">
            <CardHeader className="text-center">
              {/* Logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-light rounded-xl flex items-center justify-center mx-auto mb-4 glow">
                <FileText className="w-6 h-6 text-[#0f0f0f]" />
              </div>

              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Start taking notes in seconds
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* API Error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                  >
                    {apiError}
                  </motion.div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                  {/* Password Strength */}
                  {strength && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength === 'weak'
                              ? 'bg-destructive'
                              : strength === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-brand'
                          }`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength === 'medium'
                              ? 'bg-yellow-500'
                              : strength === 'strong'
                              ? 'bg-brand'
                              : 'bg-secondary'
                          }`}
                        />
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength === 'strong' ? 'bg-brand' : 'bg-secondary'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength:{' '}
                        <span
                          className={
                            strength === 'weak'
                              ? 'text-destructive'
                              : strength === 'medium'
                              ? 'text-yellow-500'
                              : 'text-brand'
                          }
                        >
                          {strength}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <p className="text-xs text-brand flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Passwords match
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand hover:text-brand-light font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Footer Text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-brand hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
