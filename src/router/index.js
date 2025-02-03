import { createRouter, createMemoryHistory } from 'vue-router'
import Addcategory from '../views/Category/Addcategory.vue'
import Category from '../views/Category/Category.vue'
import Signin from '../views/Register/Signin.vue'
import Signup from '../views/Register/Signup.vue'
import Homepage from '../views/Homepage.vue'
import Product from '../views/Product/Product.vue'
import Addproduct from '../views/Product/Addproduct.vue'
import Editcategory from '../views/Category/Editcategory.vue'
import Editproduct from '../views/Product/Editproduct.vue'
import Showdetails from '../views/Product/Showdetails.vue'
import Allcategory from '../views/Category/Allcategory.vue'
import Allproduct from '../views/Product/Allproduct.vue'
import Listproduct from '../views/Category/Listproduct.vue'
import ShoppingCart from '../views/Cart/ShoppingCart.vue'
import Wishlist from '../views/Wishlist/Wishlist.vue'
import Success from '../views/Payment Status/Success.vue'
import Cancel from '../views/Payment Status/Cancel.vue'
import Profile from '../views/Profile/Profile.vue'
import Manage_admin from '../views/Manage/Manage_admin.vue'
import Manage_order from '../views/Manage/Manage_order.vue'
import Add_admin from '../views/Manage/Add_admin.vue'
import ForgotPassword from '@/views/Forgot Password/ForgotPassword.vue'
import ResetPassword from '@/views/Forgot Password/ResetPassword.vue'

const routes = [
  //Homepage
  {
    path: '/',
    name: 'homepage',
    component: Homepage
  },
  //Sign In
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  //Sign Up
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  //ADMIN Show Product
  {
    path: '/admin/product',
    name: 'admin_product',
    component: Product
  },
  //ADMIN ADD Product
  {
    path: '/admin/product/add',
    name: 'admin_addproduct',
    component: Addproduct
  },
  //ADMIN Edit Product
  {
    path: '/admin/product/edit/:id',
    name: 'admin_editproduct',
    component: Editproduct
  },
  //ADMIN Show Category
  {
    path: '/admin/category',
    name: 'admin_category',
    component: Category
  },
  //ADMIN ADD Category
  {
    path: '/admin/category/add',
    name: 'admin_addcategory',
    component: Addcategory
  },
  //ADMIN Edit Category
  {
    path: '/admin/category/edit/:id',
    name: 'admin_editcategory',
    component: Editcategory
  },
  //Product Details
  {
    path: '/product/:id',
    name: 'showdetails',
    component: Showdetails
  },
  //Show All Product
  {
    path: '/product',
    name: 'all_product',
    component: Allproduct
  },
  //Show All Category
  {
    path: '/category',
    name: 'all_category',
    component: Allcategory
  },
  //Show Product In Each Category
  {
    path: '/category/:id',
    name: 'list_product',
    component: Listproduct
  },
  //Shopping cart
  {
    path: '/cart',
    name: 'shopping_cart',
    component: ShoppingCart
  },
  //Wishlist
  {
    path: '/wishlist',
    name: 'wishlist',
    component: Wishlist
  },
  {
    path: '/success/:order_id',
    name: 'success',
    component: Success
  },
  {
    path: '/cancel/:order_id',
    name: 'cancel',
    component: Cancel
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: '/manage/admin',
    name: 'manage_admin',
    component: Manage_admin
  },
  {
    path: '/manage/order',
    name: 'manage_order',
    component: Manage_order
  },
  {
    path: '/manage/add/admin',
    name: 'add_admin',
    component: Add_admin
  },
  {
    path: '/forgot-password',
    name: 'forgot_password',
    component: ForgotPassword
  },
  {
    path: '/reset-password/:user_id/:reset_token',
    name: 'reset_password',
    component: ResetPassword
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
