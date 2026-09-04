import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardGuard } from './guards/auth-guard.guard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Products } from './pages/products/products';
import { Supermarkets } from './pages/supermarkets/supermarkets';
import { SupermarketDetail } from './pages/supermarket-detail/supermarket-detail';
import { PriceComparison } from './pages/price-comparison/price-comparison';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Orders } from './pages/orders/orders';
import { OrderDetail } from './pages/order-detail/order-detail';
import { Dashboard } from './pages/dashboard/dashboard';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';

const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'products',
    component: Products,
  },
  {
    path: 'supermarkets',
    component: Supermarkets,
  },
  {
    path: 'supermarkets/:id',
    component: SupermarketDetail,
  },
  {
    path: 'compare',
    component: PriceComparison,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccess,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'orders',
    component: Orders,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'orders/:id',
    component: OrderDetail,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuardGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
