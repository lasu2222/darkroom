import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema;

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const { login, register } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onLogin(values: LoginValues) {
    try {
      await login(values);
    } catch (error) {
      toast({
        title: "错误 Error",
        description: "用户名或密码无效 Invalid username or password",
        variant: "destructive",
      });
    }
  }

  async function onRegister(values: RegisterValues) {
    try {
      await register(values);
      toast({
        title: "成功 Success",
        description: "注册成功，已自动登录 Registration successful, you are now logged in",
      });
    } catch (error) {
      toast({
        title: "错误 Error",
        description: "注册失败，用户名可能已存在 Registration failed, username may already exist",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto max-w-[400px] pt-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to Xinlong Darkroom</h1>
        <h2 className="text-2xl font-bold mb-4">欢迎使用新龙暗房</h2>
        <p className="text-muted-foreground">请登录或注册以继续 / Please sign in or register to continue</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">登录 Sign In</h3>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名 Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码 Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                登录 Sign In
              </Button>
            </form>
          </Form>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或 Or
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">注册 Register</h3>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名 Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码 Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                注册 Register
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}