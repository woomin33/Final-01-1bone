'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CardItemCardProps {
  id: number; // 장바구니 아이템 식별 고유 번호 부여
  productImg: string;
  name: string;
  price: number;
  quantity: number;
  isChecked?: boolean;
  onQuantityChange?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
  onCheck?: (id: number, checked: boolean) => void;
}

export function CartItemCard({
  id,
  productImg,
  name,
  price,
  isChecked = false,
  onQuantityChange,
  onRemove,
  onCheck,
}: CardItemCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleCheckedChange = () => {
    onCheck?.(id, !isChecked);
  };

  const handleUp = () => {
    if (quantity < 99) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleDown = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  return (
    <>
      <div className="relative mx-auto h-[6.5rem] w-[21.875rem]">
        {/* 체크박스 */}
        <div className="mt-1" onClick={handleCheckedChange}>
          <button
            className="cursor-pointer"
            onClick={handleCheckedChange}
            aria-label={isChecked ? '상품 선택 해제' : '상품 선택'}
          >
            {isChecked ? (
              <Image
                src="/check-on.svg"
                alt="check icon"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/check-off.svg"
                alt="uncheck icon"
                width={20}
                height={20}
              />
            )}
          </button>
        </div>

        {/* 상품 이미지 */}
        <div className="relative bottom-8 ml-8">
          <Image
            src={productImg}
            alt={name}
            className="rounded-xl border-2"
            width={80}
            height={80}
          />
        </div>

        {/* 상품 정보 */}
        <div className="absolute top-0 left-34">
          <p className="text-lg leading-6 font-semibold">
            {name.length > 10 ? `${name.slice(0, 10)}...` : name}
          </p>
          <p>{price.toLocaleString()}원</p>
        </div>

        {/* 수량 변경 */}
        <div className="absolute top-14 left-34">
          <button
            className="relative bottom-1 cursor-pointer"
            onClick={handleDown}
          >
            <div className="flex size-7 items-center justify-center rounded-full border border-[#CECECE]">
              <Minus size={20} />
            </div>
          </button>
          <span className="relative bottom-2 px-6">{quantity}</span>
          <button
            className="relative bottom-1 cursor-pointer"
            onClick={handleUp}
          >
            <div className="flex size-7 items-center justify-center rounded-full border border-[#CECECE]">
              <Plus size={20} />
            </div>
          </button>
        </div>

        {/* 삭제 아이콘 */}
        <div className="absolute top-2 right-0">
          <button className="cursor-pointer" onClick={handleRemove}>
            <X size={18} />
          </button>
        </div>
      </div>
      <hr className="mx-7 mb-7" />
    </>
  );
}
export default CartItemCard;
