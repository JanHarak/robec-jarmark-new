import React, { useEffect, useState } from 'react';
import { Post } from '../types/database';
import { getPostBySlug } from '../services/content';
import { ChevronLeft, Calendar, ArrowLeft } from 'lucide-react';

interface PostDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPostBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-[#E8E6E1] rounded" />
          <div className="h-10 bg-[#E8E6E1] rounded w-3/4" />
          <div className="h-80 bg-[#F7F5F0] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
          Článek nebyl nalezen
        </h2>
        <button
          onClick={() => onNavigate('/aktuality')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5A5A40] text-white text-[11px] font-bold uppercase tracking-widest rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Zpět na přehled aktualit</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 sm:py-14 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/aktuality')}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8A8A80] hover:text-[#2D2D2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Všechny aktuality</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        {post.published_at && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(post.published_at).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        )}

        <h1 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#2D2D2A] leading-tight">
          {post.title}
        </h1>

        {post.perex && (
          <p className="text-base sm:text-lg text-[#6D6D66] font-normal leading-relaxed italic border-l-2 border-[#5A5A40] pl-4 py-1">
            {post.perex}
          </p>
        )}
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="aspect-16/9 w-full rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#E8E6E1] shadow-xs">
          <img
            src={post.cover_image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 sm:p-12 shadow-xs">
        <div className="prose prose-stone max-w-none text-[#2D2D2A] text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-6">
          {post.content}
        </div>
      </div>
    </div>
  );
};
