import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor.interceptor';
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
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { ProductCardComponent } from './components/product-card/product-card';
import { ReviewCardComponent } from './components/review-card/review-card';
import { ReviewsSheetComponent } from './components/reviews-sheet/reviews-sheet';

@NgModule({
  declarations: [
    App,
    Home,
    Login,
    Register,
    Profile,
    Products,
    Supermarkets,
    SupermarketDetail,
    PriceComparison,
    Cart,
    Checkout,
    Orders,
    OrderDetail,
    Dashboard,
    CheckoutSuccess,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ReviewCardComponent,
    ReviewsSheetComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
