import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login-page";
import FilmsPage from "@/pages/films-page";
import ChemicalsPage from "@/pages/chemicals-page";
import DevelopmentPage from "@/pages/development-page";
import ProfilePage from "@/pages/profile-page";
import PushPullPage from "@/pages/push-pull-page";
import { Layout } from "./components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={LoginPage} />
      <Route path="/films" component={FilmsPage} />
      <Route path="/chemicals" component={ChemicalsPage} />
      <Route path="/development" component={DevelopmentPage} />
      <Route path="/about" component={ProfilePage} />
      <Route path="/" component={PushPullPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;