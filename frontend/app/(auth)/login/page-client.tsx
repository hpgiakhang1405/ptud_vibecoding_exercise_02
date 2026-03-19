"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { BookIcon, LockIcon, ReceiptIcon, UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/form";
import { getApiErrorMessage, login } from "@/lib/api";
import { showToast } from "@/lib/toast";

export function LoginPageClient() {
  const router = useRouter();
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({
        tai_khoan: taiKhoan,
        mat_khau: matKhau,
      });
      router.push("/doc-gia");
      router.refresh();
    } catch (caughtError) {
      const message = getApiErrorMessage(caughtError, "Đăng nhập thất bại");
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[var(--gray-50)] md:grid-cols-[0.82fr_1fr] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[var(--primary)] px-8 py-10 text-white md:flex md:flex-col md:justify-between lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 backdrop-blur">
            <BookIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-blue-100/80">University Library</p>
            <h1 className="text-xl font-semibold">Thư viện ĐH</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-100/80">
            Refined Minimal Workspace
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
            Một không gian quản trị thư viện rõ ràng, đáng tin cậy và dễ dùng.
          </h2>
          <p className="mt-5 max-w-lg text-base text-blue-50/88">
            Quản lý độc giả, kho sách, mượn trả và báo cáo trong cùng một giao diện thống nhất,
            đủ tinh gọn để tập trung vào nghiệp vụ và đủ chỉn chu cho môi trường đại học.
          </p>
        </div>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={<ReceiptIcon className="h-5 w-5" />}
            title="Báo cáo minh bạch"
            description="Theo dõi luồng mượn trả và tình trạng kho theo thời gian thực."
          />
          <FeatureCard
            icon={<BookIcon className="h-5 w-5" />}
            title="Nghiệp vụ tập trung"
            description="Từ chuyên ngành tới bản sao sách đều được vận hành nhất quán."
          />
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 md:min-h-0">
        <div className="w-full max-w-md">
          <div className="mb-6 md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                <BookIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--gray-400)]">
                  University Library
                </p>
                <h1 className="text-lg font-semibold text-[var(--gray-900)]">Thư viện ĐH</h1>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 shadow-[var(--shadow-md)] sm:p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--gray-400)]">
                Đăng nhập hệ thống
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--gray-900)]">
                Chào mừng trở lại
              </h2>
              <p className="mt-2 text-sm text-[var(--gray-600)]">
                Sử dụng tài khoản được cấp để truy cập các chức năng quản lý thư viện.
              </p>
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <Field label="Tài khoản">
                <TextInput
                  leftIcon={<UserIcon className="h-4 w-4" />}
                  placeholder="Nhập tài khoản"
                  value={taiKhoan}
                  onChange={(event) => setTaiKhoan(event.target.value)}
                />
              </Field>

              <Field label="Mật khẩu">
                <TextInput
                  type="password"
                  leftIcon={<LockIcon className="h-4 w-4" />}
                  placeholder="Nhập mật khẩu"
                  value={matKhau}
                  onChange={(event) => setMatKhau(event.target.value)}
                />
              </Field>

              {error ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--red)]/15 bg-[var(--red-light)] px-4 py-3 text-sm text-[var(--red)]">
                  {error}
                </div>
              ) : null}

              <Button type="submit" loading={loading} className="w-full justify-center">
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-white/18 bg-white/10 p-5 backdrop-blur-sm">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/14">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-blue-50/82">{description}</p>
    </div>
  );
}
