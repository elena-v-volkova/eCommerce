import { apiAnonRoot } from '@/commercetools/anonUser';

export async function logProductById(productKey: string) {
  try {
    const { body: product } = await apiAnonRoot
      .productProjections()
      .withKey({ key: productKey })
      .get({ queryArgs: { staged: false } })
      .execute();

    // console.dir(product, { depth: null, colors: true });
  } catch (error) {
    console.error(`Не удалось получить товар ${productKey}:`, error);
  }
}
