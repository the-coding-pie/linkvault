"use client";

import { LinkObj, LinkWithCategoryAndSubObj } from "@/types/interfaces";
import { formatDistanceToNowStrict } from "date-fns";
import { User } from "lucia";
import { ArrowBigUp, ExternalLinkIcon, LoaderIcon } from "lucide-react";
import Link from "next/link";
import LoginModal from "../modals/LoginModal/LoginModal";
import EmailVerifyModal from "../modals/EmailVerifyModal/EmailVerifyModal";
import { useCallback, useTransition } from "react";
import vote from "@/actions/links/vote";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Props {
  link: LinkObj | LinkWithCategoryAndSubObj;
  revalidatePathKeys?: string[];
  revalidateTagKey?: string;
  user?: User | null;
  category?: { id: number; name: string };
  subCategory?: { id: number; name: string };
}

const LinkCard = ({
  link,
  user,
  revalidatePathKeys,
  revalidateTagKey,
  category,
  subCategory,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleVote = useCallback(() => {
    startTransition(async () => {
      const res = await vote({
        linkId: link.id,
        revalidatePathKeys,
        revalidateTagKey,
      });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }, [link, revalidatePathKeys, revalidateTagKey]);

  return (
    <div className="link-card bg-white shadow-sm flex gap-4 border px-4 py-4 rounded-md">
      <div className="left flex flex-col items-center">
        {user ? (
          user.emailVerified ? (
            isPending ? (
              <div className="w-7 h-7 min-w-7">
                <LoaderIcon className="w-5 h-5 min-w-7 animate-spin" />
              </div>
            ) : (
              <button
                className="remove-vote-button bg-none border-none outline-none"
                onClick={handleVote}
                disabled={isPending}
              >
                <ArrowBigUp
                  className={cn(
                    "w-7 h-7 min-w-7 stroke-[1px]",
                    link.votes.includes(user.id) &&
                      "text-emerald-500 fill-emerald-500"
                  )}
                />
              </button>
            )
          ) : (
            <EmailVerifyModal user={user}>
              <ArrowBigUp className="w-7 h-7 min-w-7 stroke-[1px]" />
            </EmailVerifyModal>
          )
        ) : (
          <LoginModal>
            <ArrowBigUp className="w-7 h-7 min-w-7 stroke-[1px]" />
          </LoginModal>
        )}
        <div className="vote-count text-sm">{link.votes.length}</div>
      </div>
      <div className="right">
        <div className="extras text-gray-600 text-xs flex items-center gap-2 mb-1 flex-wrap">
          <div className="posted-by font-medium text-gray-900">
            u/{link.postedBy.username}
          </div>
          .
          <time>
            {formatDistanceToNowStrict(link.createdAt, {
              addSuffix: true,
            })}
          </time>
        </div>
        <h2 className="text-lg font-bold mb-1 text-gray-800">
          <Link href={link.url} target="_blank">
            {link.title}
            <ExternalLinkIcon className="inline-block ml-2 w-4 h-4 min-w-4" />
          </Link>
        </h2>

        {link.description && (
          <p className="text-sm text-gray-600">{link.description}</p>
        )}

        {category && subCategory && (
          <div className="cats-and-subs text-xs flex items-center gap-2 mt-6 flex-wrap">
            <Link
              href={`/categories/${category.id}`}
              className="bg-green-100 text-green-600 px-1 py-0.5 rounded-md"
            >
              {category.name}
            </Link>
            &gt;
            <Link
              href={`/links/${subCategory.id}`}
              className="bg-green-100 text-green-600 px-1 py-0.5 rounded-md"
            >
              {subCategory.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
