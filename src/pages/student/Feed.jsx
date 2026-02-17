import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import {
    MessageSquare,
    Heart,
    Share2,
    MoreHorizontal,
    Send,
    Image as ImageIcon,
    Trash2,
    MessageCircle,
    User,
    HelpCircle,
    Globe,
    Clock,
    Camera,
    X,
    Check,
    Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';

const REACTION_TYPES = [
    { type: 'like', emoji: '👍', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', color: 'text-red-500' },
    { type: 'haha', emoji: '😂', color: 'text-yellow-500' },
    { type: 'wow', emoji: '😮', color: 'text-yellow-500' },
    { type: 'sad', emoji: '😢', color: 'text-blue-400' },
    { type: 'angry', emoji: '😡', color: 'text-orange-600' }
];

export function Feed() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({ content: '', type: 'post', image: '', sharedPostId: null });
    const [sharingPost, setSharingPost] = useState(null); // The post object being shared
    const [commentingOn, setCommentingOn] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [copiedPostId, setCopiedPostId] = useState(null);

    const scrollRef = useRef(null);

    const getDateLocale = () => {
        if (language === 'FR') return fr;
        if (language === 'AR') return arSA;
        return enUS;
    };

    const fetchPosts = async () => {
        try {
            const response = await apiClient.get('/posts');
            setPosts(response.posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.content.trim() && !sharingPost) return;

        setIsPosting(true);
        try {
            const response = await apiClient.post('/posts', {
                ...newPost,
                sharedPostId: sharingPost?.id || null
            });
            setPosts([response.post, ...posts]);
            setNewPost({ content: '', type: 'post', image: '', sharedPostId: null });
            setSharingPost(null);
            // Scroll to top to see new post
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleReact = async (postId, type) => {
        try {
            const response = await apiClient.post(`/posts/${postId}/react`, { type });
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, reactions: response.reactions } : post
            ));
            setShowReactionPicker(null);
        } catch (error) {
            console.error('Failed to react to post:', error);
        }
    };

    const handleCommentReact = async (commentId, type) => {
        try {
            const response = await apiClient.post(`/posts/comments/${commentId}/react`, { type });
            setPosts(posts.map(post => ({
                ...post,
                comments: post.comments?.map(c => {
                    if (c.id === commentId) return { ...c, reactions: response.reactions };
                    if (c.replies) {
                        return {
                            ...c,
                            replies: c.replies.map(r => r.id === commentId ? { ...r, reactions: response.reactions } : r)
                        };
                    }
                    return c;
                })
            })));
        } catch (error) {
            console.error('Failed to react to comment:', error);
        }
    };

    const handleAddComment = async (postId, parentId = null) => {
        if (!newComment.trim()) return;

        try {
            const response = await apiClient.post(`/posts/${postId}/comments`, {
                content: newComment,
                parentId
            });

            setPosts(posts.map(post => {
                if (post.id === postId) {
                    if (parentId) {
                        return {
                            ...post,
                            comments: post.comments.map(c =>
                                c.id === parentId ? { ...c, replies: [...(c.replies || []), response.comment] } : c
                            )
                        };
                    } else {
                        return { ...post, comments: [...(post.comments || []), response.comment] };
                    }
                }
                return post;
            }));

            setNewComment('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;
        try {
            await apiClient.delete(`/posts/${postToDelete}`);
            setPosts(posts.filter(post => post.id !== postToDelete));
            setPostToDelete(null);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleShareClick = (post) => {
        setSharingPost(post);
        setNewPost({
            ...newPost,
            content: `@${post.author?.name} `
        });
        // Scroll to create post section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPost({ ...newPost, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const getUserReaction = (reactions) => {
        return reactions?.find(r => r.userId === user.id);
    };

    const ReactionIcons = ({ reactions }) => {
        if (!reactions || reactions.length === 0) return null;
        const counts = reactions.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="flex -space-x-1 items-center">
                {Object.keys(counts).slice(0, 3).map(type => (
                    <div key={type} className="h-5 w-5 rounded-full border border-white dark:border-slate-800 bg-white dark:bg-slate-700 flex items-center justify-center text-[10px] shadow-sm">
                        {REACTION_TYPES.find(r => r.type === type)?.emoji}
                    </div>
                ))}
            </div>
        );
    };

    const PostPreview = ({ post, isMini = false }) => {
        if (!post) return null;
        return (
            <div className={`rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 ${isMini ? 'scale-95 origin-top' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-200">
                        {post.author?.avatar && <img src={post.author.avatar} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{post.author?.name}</span>
                    <span className="text-[10px] text-slate-400">• {formatDistanceToNow(new Date(post.createdAt), { locale: getDateLocale() })}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{post.content}</p>
                {post.image && !isMini && (
                    <img src={post.image} alt="" className="mt-2 rounded-lg max-h-40 object-cover w-full" />
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12 relative">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.feed.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t.feed.subtitle}</p>
            </header>

            {/* Create Post Section */}
            <Card className="border-none shadow-premium bg-white dark:bg-slate-800 overflow-hidden ring-2 ring-transparent transition-all" style={sharingPost ? { ringColor: '#3b82f6', ringWidth: '2px' } : {}}>
                <CardContent className="p-6">
                    {sharingPost && (
                        <div className="mb-4 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl">
                            <span className="flex items-center gap-2 px-2"><Repeat className="h-4 w-4" /> Share Post</span>
                            <button onClick={() => { setSharingPost(null); setNewPost({ ...newPost, content: '' }) }} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-slate-700 shadow-md">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none outline-none text-lg"
                                placeholder={sharingPost ? "Say something about this..." : t.feed.placeholder}
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />

                            {sharingPost && <PostPreview post={sharingPost} isMini />}

                            {newPost.image && (
                                <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <img src={newPost.image} alt="Preview" className="w-full h-auto" />
                                    <button
                                        onClick={() => setNewPost({ ...newPost, image: '' })}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    {!sharingPost && (
                                        <>
                                            <label className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl cursor-pointer transition-all group">
                                                <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                            <button
                                                onClick={() => setNewPost({ ...newPost, type: newPost.type === 'post' ? 'question' : 'post' })}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${newPost.type === 'question'
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                                                    }`}
                                            >
                                                <HelpCircle className="h-4 w-4" />
                                                {t.feed.question}
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {sharingPost && (
                                        <button onClick={() => setSharingPost(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors">
                                            {t.feed.cancel}
                                        </button>
                                    )}
                                    <Button
                                        onClick={handleCreatePost}
                                        disabled={(!newPost.content.trim() && !sharingPost) || isPosting}
                                        className="px-6 rounded-xl shadow-lg shadow-blue-500/20"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        {sharingPost ? t.feed.share : t.feed.post}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-800 p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <Send className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 italic">{t.feed.noPosts}</p>
                    </Card>
                ) : (
                    <AnimatePresence>
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                id={`post-${post.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card className="border-none shadow-premium bg-white dark:bg-slate-800 overflow-hidden group/card relative">
                                    <CardContent className="p-0">
                                        {/* Post Header */}
                                        <div className="p-5 flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm ring-2 ring-slate-50 dark:ring-slate-800">
                                                    {post.author?.avatar ? (
                                                        <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                            {post.author?.name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-slate-900 dark:text-white hover:underline cursor-pointer">{post.author?.name}</h3>
                                                        {post.type === 'question' && (
                                                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase rounded-md tracking-wider">
                                                                Question
                                                            </span>
                                                        )}
                                                    </div>
                                                    {post.author?.jobTitle && (
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 -mt-0.5">{post.author.jobTitle}</p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: getDateLocale() })}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Public</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {(post.userId === user.id || user.role === 'admin') && (
                                                <button
                                                    onClick={() => setPostToDelete(post.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover/card:opacity-100"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Post Content */}
                                        <div className="px-6 pb-4">
                                            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                                {post.content}
                                            </p>
                                        </div>

                                        {/* Shared Post Content */}
                                        {post.sharedPost && (
                                            <div className="px-6 pb-6 pt-2">
                                                <PostPreview post={post.sharedPost} />
                                            </div>
                                        )}

                                        {/* Post Image */}
                                        {post.image && (
                                            <div className="border-y border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                                <img src={post.image} alt="Post content" className="max-w-full mx-auto" />
                                            </div>
                                        )}

                                        {/* Interactions Info */}
                                        <div className="px-6 py-3 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            <div className="flex items-center gap-2">
                                                {(post.reactions?.length || 0) > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <ReactionIcons reactions={post.reactions} />
                                                        <span className="hover:underline cursor-pointer">{post.reactions.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className="hover:text-blue-500 cursor-pointer transition-colors"
                                                onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                                            >
                                                {post.comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0} {t.feed.comments}
                                            </div>
                                        </div>

                                        {/* Interaction Buttons */}
                                        <div className="px-4 py-2 flex items-center gap-1 relative">
                                            <div className="flex-1 relative">
                                                <button
                                                    onMouseEnter={() => setShowReactionPicker(post.id)}
                                                    onClick={() => handleReact(post.id, 'like')}
                                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-semibold ${getUserReaction(post.reactions)
                                                            ? REACTION_TYPES.find(r => r.type === getUserReaction(post.reactions).type)?.color + ' bg-slate-50 dark:bg-slate-900'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                                                        }`}
                                                >
                                                    {getUserReaction(post.reactions) ? (
                                                        <span>{REACTION_TYPES.find(r => r.type === getUserReaction(post.reactions).type)?.emoji}</span>
                                                    ) : (
                                                        <Heart className="h-5 w-5" />
                                                    )}
                                                    {getUserReaction(post.reactions)
                                                        ? getUserReaction(post.reactions).type.charAt(0).toUpperCase() + getUserReaction(post.reactions).type.slice(1)
                                                        : t.feed.like}
                                                </button>

                                                <AnimatePresence>
                                                    {showReactionPicker === post.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                            onMouseLeave={() => setShowReactionPicker(null)}
                                                            className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-full flex gap-1 z-50"
                                                        >
                                                            {REACTION_TYPES.map(r => (
                                                                <button
                                                                    key={r.type}
                                                                    onClick={() => handleReact(post.id, r.type)}
                                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-transform hover:scale-125"
                                                                    title={r.type}
                                                                >
                                                                    <span className="text-xl">{r.emoji}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold"
                                            >
                                                <MessageSquare className="h-5 w-5" />
                                                {t.feed.comment}
                                            </button>

                                            <button
                                                onClick={() => handleShareClick(post)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold`}
                                            >
                                                <Share2 className="h-5 w-5" />
                                                {t.feed.share}
                                            </button>
                                        </div>

                                        {/* Comments Section */}
                                        <AnimatePresence>
                                            {commentingOn === post.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                                                >
                                                    <div className="px-6 py-6 space-y-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                                                {user?.name?.[0]}
                                                            </div>
                                                            <div className="flex-1 relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder={replyingTo ? `${t.feed.reply}...` : t.feed.writeComment}
                                                                    className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                                    value={newComment}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id, replyingTo?.commentId)}
                                                                    autoFocus={!!replyingTo}
                                                                />
                                                                {replyingTo && (
                                                                    <button onClick={() => setReplyingTo(null)} className="absolute right-10 top-1.5 p-1 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                                                                )}
                                                                <button onClick={() => handleAddComment(post.id, replyingTo?.commentId)} className="absolute right-2 top-1.5 p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"><Send className="h-4 w-4" /></button>
                                                            </div>
                                                        </div>

                                                        {/* Comment List */}
                                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                            {post.comments?.map((comment) => (
                                                                <div key={comment.id} className="space-y-3">
                                                                    <div className="flex gap-3">
                                                                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                                                                            {comment.author?.avatar ? <img src={comment.author.avatar} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-slate-400">{comment.author?.name?.[0]}</div>}
                                                                        </div>
                                                                        <div className="flex-1 space-y-1">
                                                                            <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-2.5 shadow-sm border border-slate-100/50 dark:border-slate-700/50 relative">
                                                                                <div className="flex items-center justify-between mb-0.5">
                                                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{comment.author?.name}</span>
                                                                                    <span className="text-[10px] text-slate-400 italic">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: getDateLocale() })}</span>
                                                                                </div>
                                                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{comment.content}</p>
                                                                                {comment.reactions?.length > 0 && <div className="absolute -bottom-2 -right-1 bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 rounded-full px-1.5 py-0.5 flex items-center gap-1"><ReactionIcons reactions={comment.reactions} /><span className="text-[10px] font-bold text-slate-500">{comment.reactions.length}</span></div>}
                                                                            </div>
                                                                            <div className="flex items-center gap-4 px-2 text-[11px] font-bold text-slate-500">
                                                                                <div className="relative group/react">
                                                                                    <button className={`hover:underline ${getUserReaction(comment.reactions) ? REACTION_TYPES.find(r => r.type === getUserReaction(comment.reactions).type)?.color : ''}`}>{getUserReaction(comment.reactions) ? REACTION_TYPES.find(r => r.type === getUserReaction(comment.reactions).type)?.emoji + ' ' + getUserReaction(comment.reactions).type : t.feed.like}</button>
                                                                                    <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 rounded-full flex gap-1 z-50 opacity-0 pointer-events-none group-hover/react:opacity-100 group-hover/react:pointer-events-auto transition-all scale-75 group-hover/react:scale-100">{REACTION_TYPES.map(r => (<button key={r.type} onClick={() => handleCommentReact(comment.id, r.type)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><span>{r.emoji}</span></button>))}</div>
                                                                                </div>
                                                                                <button onClick={() => { setReplyingTo({ postId: post.id, commentId: comment.id }); setNewComment(`@${comment.author?.name?.split(' ')[0]} `); }} className="hover:underline">{t.feed.reply}</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-11 space-y-3">
                                                                        {comment.replies?.map((reply) => (
                                                                            <div key={reply.id} className="flex gap-3">
                                                                                <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">{reply.author?.avatar ? <img src={reply.author.avatar} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[8px] font-bold text-slate-400">{reply.author?.name?.[0]}</div>}</div>
                                                                                <div className="flex-1 space-y-1">
                                                                                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-sm border border-slate-100/50 dark:border-slate-700/50 relative"><div className="flex items-center justify-between mb-0.5"><span className="text-[11px] font-bold text-slate-900 dark:text-white">{reply.author?.name}</span><span className="text-[9px] text-slate-400 italic">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: getDateLocale() })}</span></div><p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{reply.content}</p>{reply.reactions?.length > 0 && <div className="absolute -bottom-2 -right-1 bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 rounded-full px-1 py-0.5 flex items-center gap-1 scale-90"><ReactionIcons reactions={reply.reactions} /><span className="text-[8px] font-bold text-slate-500">{reply.reactions.length}</span></div>}</div>
                                                                                    <div className="flex items-center gap-3 px-2 text-[10px] font-bold text-slate-500"><div className="relative group/reply-react"><button className={`hover:underline ${getUserReaction(reply.reactions) ? REACTION_TYPES.find(r => r.type === getUserReaction(reply.reactions).type)?.color : ''}`}>{getUserReaction(reply.reactions) ? REACTION_TYPES.find(r => r.type === getUserReaction(reply.reactions).type)?.emoji : t.feed.like}</button><div className="absolute bottom-full left-0 mb-1 p-0.5 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 rounded-full flex gap-0.5 z-50 opacity-0 pointer-events-none group-hover/reply-react:opacity-100 group-hover/reply-react:pointer-events-auto transition-all scale-75 group-hover/reply-react:scale-100">{REACTION_TYPES.map(r => (<button key={r.type} onClick={() => handleCommentReact(reply.id, r.type)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><span className="text-sm">{r.emoji}</span></button>))}</div></div></div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Custom Confirm Delete Modal */}
            <AnimatePresence>
                {postToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPostToDelete(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-sm relative z-10">
                            <div className="h-14 w-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto"><Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" /></div>
                            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">{t.feed.confirmDeleteTitle}</h3>
                            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{t.feed.confirmDeleteMessage}</p>
                            <div className="flex gap-3"><button onClick={() => setPostToDelete(null)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">{t.feed.cancel}</button><button onClick={handleDeletePost} className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">{t.feed.delete}</button></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
