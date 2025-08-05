'use client';
import { PostList } from '@/types';
import { FeedCard } from './FeedCard';
import Image from 'next/image';

//          interface: 유저 피드 탭 컴포넌트 Properties          //
interface Props {
  posts: PostList[];
}

//          component: 유저 피드 탭 컴포넌트          //
export function UserFeedTab({ posts }: Props) {
  //          render: 유저 피드 탭 컴포넌트 렌더링(게시물 x)          //
  if (!posts || posts.length === 0) {
    return (
      <div className="mt-8 flex w-full flex-col items-center text-[#4a4a4a]">
        {/* <Image
          src={'/images/character/character-write.webp'}
          alt="테스트입니다"
          width={300}
          height={300}
          className="aspect-square w-1/2 object-contain"
        /> */}
        <p>등록한 피드가 없어요</p>
      </div>
    );
  }

  //          render: 유저 피드 탭 컴포넌트 렌더링(게시물 o)          //
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {posts.map((post, idx) => (
        <FeedCard
          key={idx}
          images={post.image}
          href={`/${post.type}/${post._id}`}
          alt={post.title}
          onClick={() => console.log(`${post.title} 클릭됨`)}
        />
      ))}
    </div>
  );
}
