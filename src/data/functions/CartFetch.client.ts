//        장바구니 관련 API 요청 처리 유틸리티        //
'use client';

import { Product, ProductListRes } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { CartItem } from '@/types/cart';
import {
  AddToCartRes,
  CartListRes,
  CartQuantityUpdateRes,
  DeleteCartsRes,
} from '@/types/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const accessToken = useAuthStore.getState().accessToken;

// 장바구니에 상품 추가
export async function fetchAddToCart({
  product_id,
  quantity,
  size,
  color,
}: {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}) {
  try {
    // 요청 데이터 로그
    console.log('API 요청 데이터:', {
      product_id,
      quantity,
      size,
      color,
    });

    const res = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        product_id,
        quantity,
        ...(size && { size }),
        ...(color && { color }),
      }),
    });

    if (!res.ok) {
      console.error('API 요청 실패:', {
        status: res.status,
        statusText: res.statusText,
        url: res.url,
      });
      throw new Error(`장바구니 추가 실패: ${res.statusText}`);
    }

    // 응답 데이터 로그
    const data = await res.json();
    console.log('API 응답 데이터:', data);

    return data;
  } catch (error) {
    console.error('장바구니 추가 중 오류 발생:', error);
    throw error;
  }
}

//        장바구니 목록 조회(로그인)        //
export async function fetchCartList(
  page: number = 1,
  limit: number = 10,
): Promise<CartListRes> {
  // 디버깅 코드 추가
  console.log('환경 변수 확인:');
  console.log('NEXT_PUBLIC_API_URL:', API_URL);
  console.log('NEXT_PUBLIC_ACCESS_TOKEN:', accessToken);

  if (!API_URL || !accessToken) {
    throw new Error('환경 변수가 올바르게 설정되지 않았습니다.');
  }
  const res = await fetch(`${API_URL}/carts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('API 요청 실패:', res.status, res.statusText);
    throw new Error('장바구니 불러오기 실패');
  }

  const data = await res.json();

  // 데이터 검증
  if (!data.ok || !Array.isArray(data.item)) {
    console.error('서버 응답 데이터가 올바르지 않습니다:', data);
    throw new Error('서버 응답 데이터 오류');
  }

  const validatedItems = data.item.map((item: CartItem) => ({
    ...item,
    price: item.price || 0,
    quantity: item.quantity || 1,
  }));

  return { ...data, item: validatedItems };
}

//        장바구니 상품 한 건 삭제        //
export async function deleteCartItem(id: number): Promise<DeleteCartsRes> {
  const res = await fetch(`${API_URL}/carts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  const responseData = await res.json();
  console.log('서버 응답 데이터:', responseData);

  if (!res.ok) {
    console.error('삭제 실패:', res.status, res.statusText);
    throw new Error('삭제 실패');
  }
  return responseData;
}

//        장바구니 여러건 삭제        //
export async function fetchDeleteAllCarts(
  cartIds: number[],
): Promise<DeleteCartsRes> {
  console.log('장바구니 삭제 요청 ID들:', cartIds);
  const res = await fetch(`${API_URL}/carts`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ carts: cartIds }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to delete cart items');
  }

  const data: DeleteCartsRes = await res.json();
  return data;
}

//        장바구니 상품 수량 수정        //
export async function fetchUpdateCartItemQuantity(
  id: number,
  quantity: number,
): Promise<CartQuantityUpdateRes> {
  try {
    // 요청 데이터 로그
    console.log('장바구니 수량 수정 요청 데이터:', { id, quantity });
    console.log('API 요청 URL:', `${API_URL}/carts/${id}`);

    const res = await fetch(`${API_URL}/carts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ quantity }),
      cache: 'no-store',
    });

    // 응답 상태 로그
    console.log('API 응답 상태:', res.status, res.statusText);

    if (!res.ok) {
      console.error('API 요청 실패:', {
        status: res.status,
        statusText: res.statusText,
        url: res.url,
      });
      throw new Error(`수량 수정 실패: ${res.statusText}`);
    }

    // 응답 데이터 로그
    const data: CartQuantityUpdateRes = await res.json();
    console.log('장바구니 수량 수정 응답 데이터:', data);

    return data;
  } catch (error) {
    console.error('장바구니 수량 수정 중 오류 발생:', error);
    throw error;
  }
}
