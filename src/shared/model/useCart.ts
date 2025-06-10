// import { useEffect, useState } from 'react';
// import { Cart } from '@commercetools/platform-sdk';

// import { clearCartId, getCartId, setCartId } from '../utils/anonymousId';
// import {
//   createAnonymousCart,
//   getActiveCustomerCart,
//   getCartById,
// } from '../api/cart';

// import { useAuth } from './AuthContext';

// import { ProductsSimpleNew } from '@/components/Catalog/module/useProductSearch';
// import { createAuthClient } from '@/commercetools/authUser';
// import { apiAnonRoot } from '@/commercetools/anonUser';
// import { tokenCache } from '@/commercetools/buildClient';

// interface ICart {
//   cart: Cart;
//   productList: ProductsSimpleNew[] | [];
// }

// const useCart = () => {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         if (user) {
//           clearCartId();

//           const customerCart = await getActiveCustomerCart(user.id);

//           if (customerCart) {
//             setCart(customerCart.results[0]);
//             setCartId(customerCart.results[0].id);
//           }
//         } else {
//           // Анонимный пользователь
//           const existingId = getCartId();

//           if (existingId) {
//             try {
//               const anonCart = await getCartById(existingId);

//               console.log('Я зашел в аноним');
//               setCart(anonCart);
//             } catch (e) {
//               // Если корзина не найдена — создаём новую
//               const newCart = await createAnonymousCart();

//               setCart(newCart);
//               setCartId(newCart.id);
//             }
//           } else {
//             const newCart = await createAnonymousCart();

//             setCart(newCart);
//             setCartId(newCart.id);
//           }
//         }
//       } catch (err) {
//         console.error('Ошибка загрузки корзины:', err);
//       }
//     };

//     loadCart();
//   }, [user]);

//   const addItem = async (productId: string, variantId: number) => {
//     const cartId = getCartId();

//     if (!cartId) throw new Error('Cart ID not found');

//     const cart = await apiAnonRoot
//       .carts()
//       .withId({ ID: cartId })
//       .get()
//       .execute();

//     const updatedCart = await apiAnonRoot
//       .carts()
//       .withId({ ID: cartId })
//       .post({
//         body: {
//           version: cart.body.version,
//           actions: [
//             {
//               action: 'addLineItem',
//               productId,
//               variantId,
//               quantity: 1,
//             },
//           ],
//         },
//       })
//       .execute();

//     setCart(updatedCart.body);
//   };

//   const removeItem = async (lineItemId: string) => {
//     if (!cart) {
//       console.log('Cannot remove item: apiRoot or cart not available');

//       return;
//     }

//     try {
//       const endpoint = user?.id
//         ? createAuthClient(tokenCache.get().token)
//             .me()
//             .carts()
//             .withId({ ID: cart.id })
//         : apiAnonRoot.carts().withId({ ID: cart.id });

//       const res = await endpoint
//         .post({
//           body: {
//             version: cart.version,
//             actions: [{ action: 'removeLineItem', lineItemId }],
//           },
//         })
//         .execute();

//       setCart(res.body);
//       console.log('Item removed successfully');
//     } catch (error) {
//       console.error('Failed to remove item:', error);
//     }
//   };

//   return {
//     cart,
//     loading: isLoading,
//     addItem,
//     setCart,
//     removeItem,
//   };
// };

// export default useCart;
