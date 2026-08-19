import React, { useEffect, useState } from 'react';
import { Post } from '../types/database';
import { getPublishedPosts } from '../services/content';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';

interface PostsViewProps {
  onNavigate: (path: string) => void;
}

export const PostsView: React.FC<PostsViewProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E8E6E1] pb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A9A5B] block mb-2">
          Ze života na statku
        </span>
        <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#2D2D2A]">
          Aktuality z hospodářství
        </h1>
        <p className="text-sm text-[#6D6D66] mt-2 max-w-2xl">
          Přečtěte si, co se právě děje na záhonech, jak prospívají včely a kdy plánujeme další sklizně.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-[#F7F5F0] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E6E1] p-8 text-[#8A8A80]">
          Zatím nebyly publikovány žádné aktuality.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/aktuality/${post.slug}`)}
              className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {post.cover_image && (
                  <div className="aspect-16/10 bg-[#F7F5F0] overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8A80] mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.published_at).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  )}
                  <h2 className="font-serif italic text-xl font-bold text-[#2D2D2A] mb-3 leading-snug">
                    {post.title}
                  </h2>
                  {post.perex && (
                    <p className="text-xs text-[#6D6D66] line-clamp-3 leading-relaxed">
                      {post.perex}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E8E6E1] flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#5A5A40]">
                  <span>Přečíst článek</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
