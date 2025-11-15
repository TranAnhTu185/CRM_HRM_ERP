"use client";

import React, { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";


const domain = process.env.WORKSPACE_DOMAIN;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    function validate() {
        setError("");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return "Vui lòng nhập email.";
        if (!emailRegex.test(email)) return "Email không hợp lệ.";
        if (!password) return "Vui lòng nhập mật khẩu.";
        if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
        return "";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setError(v);
            notifications.show({
                color: "red",
                title: "Thiếu thông tin",
                message: "Vui lòng nhập email và mật khẩu",
            });
            return;
        }
        const body = {
            email: email,
            password: password
        }
        try {
            const res = await fetch("https://dadujsc.online/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": "t=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXV0djE5OTNAZ21haWwuY29tIiwidXNlcl9pZCI6IldOT1dsMjJSbW4yTlRQWTE3ZHNlIiwiZGlzcGxheV9uYW1lIjoiZGF1dHYxOTkzQGdtYWlsLmNvbSIsImF2YXRhciI6Imh0dHBzOi8va2llbXRyYXBoYXRuZ3VvaS5jb20udm4vaW1hZ2VzL2F2YXRhci5qcGciLCJ0aXRsZSI6IiIsImlhdCI6MTc2MTQ4NzYyNiwiZXhwIjoxNzc3MDM5NjI2fQ.Z47oj6CiLSm0c4Yq6IrHblQ0sgnDGN2w716C05VTPnI"
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Sai thông tin đăng nhập");
            }
            const token = data?.token || null;

            if (token) {
                document.cookie = `t=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // lưu 7 ngày
                localStorage.setItem("token", JSON.stringify(token));
            }
            // const resdoamin = await fetch("https://dadujsc.online/api/auth/create-workplace-token", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Cookie": "t=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYXV0djE5OTNAZ21haWwuY29tIiwidXNlcl9pZCI6IldOT1dsMjJSbW4yTlRQWTE3ZHNlIiwiZGlzcGxheV9uYW1lIjoiZGF1dHYxOTkzQGdtYWlsLmNvbSIsImF2YXRhciI6Imh0dHBzOi8va2llbXRyYXBoYXRuZ3VvaS5jb20udm4vaW1hZ2VzL2F2YXRhci5qcGciLCJ0aXRsZSI6IiIsImlhdCI6MTc2MTQ4NzYyNiwiZXhwIjoxNzc3MDM5NjI2fQ.Z47oj6CiLSm0c4Yq6IrHblQ0sgnDGN2w716C05VTPnI"
            //     },
            //     body: JSON.stringify({
            //         "continue": "http://localhost:3000"
            //     }),
            // });

            // const datadomain = await resdoamin.json();    

            // if (!resdoamin.ok) {
            //     throw new Error(data?.message || "Lỗi");
            // }

            notifications.show({
                color: "green",
                title: "Đăng nhập thành công",
                message: "Chào mừng bạn trở lại!",
            });

            router.push("/");
        } catch (error: any) {
            notifications.show({
                color: "red",
                title: "Đăng nhập thất bại",
                message: error.message,
            });
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold">Đăng nhập</h1>
                    <p className="text-sm text-gray-500 mt-1">Đăng nhập vào hệ thống của bạn</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm text-gray-600">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                                placeholder="you@example.com"
                                aria-label="Email"
                                required
                            />
                        </label>

                        <label className="block relative">
                            <span className="text-sm text-gray-600">Mật khẩu</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                placeholder="Mật khẩu của bạn"
                                aria-label="Mật khẩu"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="absolute right-2 top-[38px] text-sm text-gray-500 px-2 py-1 rounded"
                                aria-pressed={showPassword}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? "Ẩn" : "Hiện"}
                            </button>
                        </label>

                        <div className="flex items-center justify-between text-sm">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>Ghi nhớ tôi</span>
                            </label>

                            <button type="button" className="text-sky-600 hover:underline text-sm" onClick={() => alert('Chức năng "Quên mật khẩu" (mô phỏng).')}>Quên mật khẩu?</button>
                        </div>

                        {error && <div className="text-sm text-red-600">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 rounded-lg bg-sky-600 cursor-pointer text-white font-medium disabled:opacity-60"
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center gap-3">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <div className="text-xs text-gray-400">Hoặc tiếp tục với</div>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => alert('Đăng nhập với Google (mô phỏng)')} className="py-2 rounded-lg border cursor-pointer">Google</button>
                                <button type="button" onClick={() => alert('Đăng nhập với GitHub (mô phỏng)')} className="py-2 rounded-lg border cursor-pointer">GitHub</button>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-3">Chưa có tài khoản? <button type="button" onClick={() => alert('Mở form đăng ký (mô phỏng)')} className="text-sky-600 hover:underline">Đăng ký</button></p>
                    </div>
                </form>

                <footer className="text-xs text-gray-400 text-center mt-4">Bản demo — thay đổi chức năng auth để kết nối backend thực tế.</footer>
            </div>
        </div>
    );
}
