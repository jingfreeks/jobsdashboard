import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "@/assets/react.svg";
import { Eye, EyeOff } from "lucide-react";
import {useDispatch} from 'react-redux';
import { useLoginMutation } from "@/features/loginApiSlice";
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setCredentials } from "@/features/auth";
import type { AppDispatch } from "@/config/store";

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (formData: LoginFormData) => {
    try {
      console.log(formData);
     const result  =  await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();
      if (result && typeof result === "object") {
        dispatch(setCredentials({ ...(result as object), user: formData.username }));
      }
    navigate("/dashboard");
    } catch {
      // Error is handled by RTK Query's error state
    }
  };

  // Helper type guard
  function isFetchBaseQueryError(
    error: unknown
  ): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
  }

  let loginErrorMessage: string | null = null;
  if (error) {
    if (isFetchBaseQueryError(error)) {
      const msg = (error.data as { error?: { message?: string } })?.error?.message;
      loginErrorMessage = msg ? String(msg) : "Invalid credentials";
    } else {
      loginErrorMessage = "Invalid credentials";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 h-20 mb-6" />
        <h1 className="text-2xl font-bold mb-6 text-center">Log in to Your Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-600"
            />
            {errors.username && <span className="text-red-500 text-xs">{errors.username.message as string}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base bg-gray-50 focus:outline-none focus:border-blue-600 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
          </div>
          {loginErrorMessage && (
            <div className="text-red-500 text-sm mb-2 text-center">
              {loginErrorMessage}
            </div>
          )}
          <button type="submit" className="w-full py-3 bg-[#0856d1] text-white rounded-lg font-semibold hover:bg-blue-700 transition" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="w-full flex flex-col items-center mt-4 gap-1">
          <a href="#" className="text-xs text-gray-500 hover:underline">Forgot password?</a>
          <span className="text-sm text-gray-700">Don't have an account? <Link to="/register" className="text-[#0856d1] hover:underline font-medium">Sign up</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;