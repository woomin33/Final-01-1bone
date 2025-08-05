'use server';

import { Product, ProductListRes } from '@/types';
import { OrderInfoRes } from '@/types/orders';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

// 상품 구매
export async function OrderFetch(
  product: Product,
  quantity: number,
): Promise<ProductListRes> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
    },
    body: JSON.stringify({
      productId: product._id,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error('주문에 실패했습니다.');
  }

  return res.json();
}

// 상품 구매 목록 조회
export async function OrderListFetch(
  accessToken: string,
): Promise<OrderInfoRes> {
  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('주문 목록 조회에 실패했습니다.');
  }

  return res.json();
}
