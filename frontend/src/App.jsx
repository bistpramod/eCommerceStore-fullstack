import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import ProductList from './admin/ProductList';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Layout from '../layout/Layout';
import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/product/:id',
        element: <ProductDetails />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/admin/products',
        element: <ProductList />,
      },
      {
        path: '/admin/products/add',
        element: <AddProduct />
      },
      {
        path: '/admin/products/edit/:id',
        element: <EditProduct />
      },
      {
        path:'/cart',
        element: <Cart/>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]

  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}