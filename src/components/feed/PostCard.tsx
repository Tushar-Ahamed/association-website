import React, { useState } from 'react';
import { ThumbsUp, Heart, Award, Sparkles, MessageCircle, Pin, Share2, Send } from 'lucide-react';
import { Post, ReactionType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UPAZILA_INFO } from '../../data/mockData';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user, toggleReaction, addComment } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const author = post.author;
  const reactions = post.reactions || [];
  const comments = post.comments || [];

  const userReaction = reactions.find((r) => r.user_id === user?.id)?.reaction;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const reactionIcons: Record<ReactionType, { emoji: string; label: string; icon: any; color: string }> = {
    like: { emoji: '👍', label: 'লাইক', icon: ThumbsUp, color: 'text-blue-400' },
    love: { emoji: '❤️', label: 'লাভ', icon: Heart, color: 'text-rose-400' },
    congrats: { emoji: '🎉', label: 'অভিনন্দন', icon: Sparkles, color: 'text-amber-400' },
    support: { emoji: '🤝', label: 'পাশে আছি', icon: Award, color: 'text-emerald-400' },
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-xl space-y-4 font-bengali">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={author?.full_name_bn}
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">{author?.full_name_bn}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                author?.role === 'super_admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}>
                {author?.role === 'super_admin' ? 'সেন্ট্রাল এডমিন' : (author?.role === 'teacher' ? 'শিক্ষক' : (author?.role === 'upazila_admin' ? 'উপজেলা এডমিন' : 'সদস্য'))}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {author?.department} • {UPAZILA_INFO[author?.upazila || 'jhenaidah_sadar'].name_bn} • {new Date(post.created_at).toLocaleDateString('bn-BD')}
            </p>
          </div>
        </div>

        {post.is_pinned && (
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full flex items-center gap-1">
            <Pin className="w-3 h-3 fill-amber-400" /> পিনকৃত পোস্ট
          </span>
        )}
      </div>

      {/* Post Text Content */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Images Grid */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 rounded-2xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {post.images.map((img, idx) => (
            <div key={idx} className="relative max-h-80 overflow-hidden rounded-xl border border-slate-800">
              <img src={img} alt={`Post img ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Reactions Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1 font-medium">
          <span>{reactions.length} টি রিয়েকশন</span>
          {reactions.length > 0 && (
            <div className="flex -space-x-1 ml-1">
              <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-700 text-[10px] flex items-center justify-center">👍</span>
              <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700 text-[10px] flex items-center justify-center">❤️</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-emerald-400 transition-colors font-medium"
        >
          {comments.length} টি মন্তব্য
        </button>
      </div>

      {/* Reaction Buttons */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-800/80 text-xs">
        {(Object.keys(reactionIcons) as ReactionType[]).map((rKey) => {
          const rInfo = reactionIcons[rKey];
          const isSelected = userReaction === rKey;
          return (
            <button
              key={rKey}
              onClick={() => toggleReaction(post.id, rKey)}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
                isSelected
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'hover:bg-slate-800/80 text-slate-400'
              }`}
            >
              <span>{rInfo.emoji}</span>
              <span className="hidden sm:inline text-[11px]">{rInfo.label}</span>
            </button>
          );
        })}
      </div>

      {/* Comments Thread */}
      {showComments && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          {/* Add comment input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="আপনার মতামত লিখুন..."
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Existing comments list */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{c.author?.full_name_bn || 'সদস্য'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {new Date(c.created_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
