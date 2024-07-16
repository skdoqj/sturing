'use client';
import {
  fetchBookmark,
  postBookmark,
  updateBookmark,
} from '@/utils/study-detail/bookmarkUtils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
type TBookmarkBtnNavigationBarProps = {
  text: string;
  link: string;
  studyId: string;
  userId: string;
};

export default async function BookmarkBtnNavigationBar(
  props: TBookmarkBtnNavigationBarProps,
) {
  const { text, link, studyId, userId } = props;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const onClickBookmark = () => {
    fetchBookmark(userId, studyId).then((bookmark) => {
      if (!bookmark) {
        postBookmark(userId, studyId).then((data) => {
          setIsBookmarked(!isBookmarked);
        });
      } else {
        updateBookmark(userId, studyId).then((data) => {
          setIsBookmarked(!isBookmarked);
        });
      }
    });
  };
  useEffect(() => {
    fetchBookmark(userId, studyId).then((bookmark) => {
      if (!bookmark) {
        setIsBookmarked(false);
      } else {
        setIsBookmarked(bookmark.checked);
      }
    });
  }, [isBookmarked]);

  return (
    <div className="w-full mb-[1.6rem] px-[1.6rem] my-[4.6rem] flex flex-row items-center justify-between">
      <div className="m-[1.2rem] text-main-600" onClick={onClickBookmark}>
        {isBookmarked ? <FaBookmark size={17} /> : <FaRegBookmark size={17} />}
      </div>
      <button className="w-full ml-[2rem] h-[5rem] rounded-[0.5rem] bg-main-600 font-semibold text-white select-none">
        <Link href={link}>{text}</Link>
      </button>
    </div>
  );
}
