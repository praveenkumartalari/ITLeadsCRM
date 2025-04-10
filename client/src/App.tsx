import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth.tsx";

import Layout from "./components/layout/layout";
import Dashboard from "./pages/dashboard";
import LeadsPage from "./pages/leads/index";
import LeadForm from "./pages/leads/lead-form";
import ClientsPage from "./pages/clients/index";
import ClientForm from "./pages/clients/client-form";
import ActivitiesPage from "./pages/activities/index";
import ActivityForm from "./pages/activities/activity-form";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          
          <Route path="/">
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
          
          <Route path="/leads">
            <Layout>
              <LeadsPage />
            </Layout>
          </Route>
          
          <Route path="/leads/new">
            <Layout>
              <LeadForm />
            </Layout>
          </Route>
          
          <Route path="/leads/:id">
            {(params) => (
              <Layout>
                <LeadForm id={parseInt(params.id)} />
              </Layout>
            )}
          </Route>
          
          <Route path="/clients">
            <Layout>
              <ClientsPage />
            </Layout>
          </Route>
          
          <Route path="/clients/new">
            <Layout>
              <ClientForm />
            </Layout>
          </Route>
          
          <Route path="/clients/:id">
            {(params) => (
              <Layout>
                <ClientForm id={parseInt(params.id)} />
              </Layout>
            )}
          </Route>
          
          <Route path="/activities">
            <Layout>
              <ActivitiesPage />
            </Layout>
          </Route>
          
          <Route path="/activities/new">
            <Layout>
              <ActivityForm />
            </Layout>
          </Route>
          
          <Route path="/activities/:id">
            {(params) => (
              <Layout>
                <ActivityForm id={parseInt(params.id)} />
              </Layout>
            )}
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
