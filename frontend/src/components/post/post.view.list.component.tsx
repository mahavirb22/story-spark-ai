import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../models/post";
import BookmarkButton from "../BookmarkButton";
import SSProfile from "../ui-component/ss-profile/ss-profile";

interface IExploreViewListComponentProps {
  posts: Post[];
  isLoading: boolean;
}

const ExploreViewListComponent: React.FC<IExploreViewListComponentProps> = ({
  posts,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (storyId: string) => {
    setImageErrors((prev) => ({ ...prev, [storyId]: true }));
  };

  const formatDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getStoryPreview = (content: string) => {
    if (!content) return "No preview available for this story yet.";
    const normalizedContent = content.replace(/\s+/g, " ").trim();
    return normalizedContent.length > 180
      ? `${normalizedContent.slice(0, 180)}...`
      : normalizedContent;
  };

  const openStory = (storyId: string) => {
    navigate(`/post/${storyId}`);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    storyId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStory(storyId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#f8fafc]/90 border border-slate-200/60 shadow-lg rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] dark:bg-slate-900/40 dark:border-white/5 dark:shadow-2xl"
          >
            <div className="relative aspect-video bg-slate-200/80 dark:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#03050C] opacity-60"></div>
              <div className="absolute top-6 left-6 h-7 w-20 bg-slate-300/50 rounded-full border border-slate-300/30 dark:bg-blue-500/10 dark:border-blue-500/10" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="h-6 bg-slate-300/60 rounded-lg w-3/4 mb-4 dark:bg-slate-800/60" />
              <div className="space-y-3 mb-8 flex-1">
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-full dark:bg-slate-800/40" />
                <div className="h-3.5 bg-slate-200/70 rounded-lg w-5/6 dark:bg-slate-800/40" />
              </div>
              <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-auto flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-300/50 dark:bg-slate-800/60" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-300/60 rounded-md w-1/3 dark:bg-slate-800/60" />
                  <div className="h-2 bg-slate-200/50 rounded-md w-1/4 dark:bg-slate-800/30" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.length > 0 ? (
          posts.map((story) => {
            const publishedDate = formatDate(story.publishedAt || story.createdAt);
            const readingTime = calculateReadingTime(story.content);
            const preview = getStoryPreview(story.content);

            return (
              <div
                key={story._id}
                role="button"
                tabIndex={0}
                onClick={() => openStory(story._id)}
                onKeyDown={(event) => handleCardKeyDown(event, story._id)}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-indigo-300/70 hover:bg-white/95 hover:shadow-[0_28px_80px_rgba(79,70,229,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-slate-950/55 dark:text-white dark:shadow-[0_18px_60px_rgba(0,0,0,0.32)] dark:hover:border-indigo-400/40 dark:hover:bg-slate-900/75"
              >
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative m-3 overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
                  {!imageErrors[story._id] && story.imageURL ? (
                    <img
                      src={story.imageURL}
                      alt={`Cover image for ${story.title}`}
                      onError={() => handleImageError(story._id)}
                      className="h-52 w-full object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:saturate-125"
                    />
                  ) : (
                    <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500/20 via-sky-500/20 to-fuchsia-500/20">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.15),rgba(79,70,229,0.2))] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(79,70,229,0.28))]" />
                      <i className="fas fa-book-open relative z-10 text-4xl text-indigo-500/80 dark:text-indigo-300/80" />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                  <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
                    <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                      {story.tag || "Story"}
                    </span>
                    {story.language && (
                      <span className="rounded-full border border-white/30 bg-slate-950/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                        {story.language}
                      </span>
                    )}
                  </div>

                  <div
                    className="absolute right-4 top-4 z-10"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <BookmarkButton
                      storyId={story._id}
                      className="!rounded-full border border-white/25 bg-white/20 p-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/35 dark:bg-black/25"
                    />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      {readingTime} min read
                    </span>
                    <span className="truncate text-xs font-medium text-white/80">
                      {publishedDate || "Recently published"}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-3">
                  <div className="mb-4">
                    <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                      {story.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {preview}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-slate-200/80 pt-4 dark:border-white/10">
                    <div className="mb-4 flex items-start gap-3">
                      <SSProfile name={story.author?.name || "Unknown"} size="h-9 w-9" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {story.author?.name || "Unknown"}
                        </span>
                        {story.author?.profile?.bio ? (
                          <span className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                            {story.author.profile.bio}
                          </span>
                        ) : (
                          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                            Story creator
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-red-500 dark:bg-red-500/10 dark:text-red-300">
                          <i className="fas fa-heart text-[11px]" /> {story.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-blue-500 dark:bg-blue-500/10 dark:text-blue-300">
                          <i className="fas fa-comment text-[11px]" /> {story.commentsCount || 0}
                        </span>
                        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300 sm:flex">
                          <i className="fas fa-eye text-[11px]" /> {story.viewsCount || 0}
                        </span>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-indigo-300">
                        Read story
                        <i className="fas fa-arrow-right text-[11px]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800">
               <i className="fas fa-book-open text-4xl text-slate-300 dark:text-slate-600"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No posts available</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm">
               Check back later for new stories, or try adjusting your search filters.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreViewListComponent;
