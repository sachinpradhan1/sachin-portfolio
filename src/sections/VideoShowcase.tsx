import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ExternalLink, Plus, Trash2, Edit2, Lock, Unlock, Upload, Link, Cloud } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CLOUDINARY_CONFIG, getCloudinaryThumbnailUrl } from '@/lib/cloudinary';

gsap.registerPlugin(ScrollTrigger);

interface Video {
  id: string;
  title: string;
  platform: 'youtube' | 'instagram' | 'cloudinary';
  embedUrl: string;
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
}

// Admin password - change this to your own secret password
const ADMIN_PASSWORD = '@Sachin889900';

// Default videos data - Cloudinary hosted videos (visible on all devices)
const defaultVideos: Video[] = [
  {
    id: '1',
    title: 'Sample 1',
    platform: 'cloudinary',
    embedUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/v1770050881/mc4kfmg3irefn2ujkl2i.mp4',
    cloudinaryPublicId: 'mc4kfmg3irefn2ujkl2i',
    thumbnailUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/so_0,w_800,h_450,c_fill/mc4kfmg3irefn2ujkl2i.jpg',
  },
  {
    id: '2',
    title: 'Sample 2',
    platform: 'cloudinary',
    embedUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/v1770051225/onhppuqoownikerpffpm.mp4',
    cloudinaryPublicId: 'onhppuqoownikerpffpm',
    thumbnailUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/so_0,w_800,h_450,c_fill/onhppuqoownikerpffpm.jpg',
  },
  {
    id: '3',
    title: 'Sample 3',
    platform: 'cloudinary',
    embedUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/v1770266571/hz0alaayxd5rn2qj13la.mp4',
    cloudinaryPublicId: 'hz0alaayxd5rn2qj13la',
    thumbnailUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/so_0,w_800,h_450,c_fill/hz0alaayxd5rn2qj13la.jpg',
  },
  {
    id: '4',
    title: 'Sample 4',
    platform: 'cloudinary',
    embedUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/v1770390945/VID_20260206_043417_175_bsl_lgxza8.mp4',
    cloudinaryPublicId: 'VID_20260206_043417_175_bsl_lgxza8',
    thumbnailUrl: 'https://res.cloudinary.com/diaj4r0ie/video/upload/so_0,w_800,h_450,c_fill/VID_20260206_043417_175_bsl_lgxza8.jpg',
  },
];

// Note: Cloudinary widget type is declared in About.tsx

const VideoShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Always use the default Cloudinary videos - no localStorage loading
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [uploadType, setUploadType] = useState<'link' | 'cloudinary'>('cloudinary');
  const [isUploading, setIsUploading] = useState(false);

  // Load Cloudinary script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 60, rotateX: 15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [videos]);

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowPasswordDialog(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
  };

  const getEmbedUrl = (url: string, platform: string): string => {
    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (platform === 'instagram') {
      const match = url.match(/instagram\.com\/reel\/([^\/\s]+)/);
      return match ? `https://www.instagram.com/reel/${match[1]}/embed` : url;
    }
    return url;
  };

  const detectPlatform = (url: string): 'youtube' | 'instagram' | 'cloudinary' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    return 'cloudinary';
  };

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is still loading. Please try again in a moment.');
      return;
    }

    setIsUploading(true);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'video',
        maxFileSize: 100000000, // 100MB
        clientAllowedFormats: ['mp4', 'webm', 'mov', 'avi', 'mkv'],
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setIsUploading(false);
          return;
        }

        if (result.event === 'success') {
          const newVideo: Video = {
            id: Date.now().toString(),
            title: newVideoTitle || 'Untitled Video',
            platform: 'cloudinary',
            embedUrl: result.info.secure_url,
            cloudinaryPublicId: result.info.public_id,
            thumbnailUrl: getCloudinaryThumbnailUrl(result.info.public_id),
          };

          setVideos([...videos, newVideo]);
          setNewVideoTitle('');
          setIsEditDialogOpen(false);
          setIsUploading(false);
        }
      }
    );

    widget.open();
  };

  const handleAddVideoFromLink = () => {
    if (!newVideoUrl) return;

    const platform = detectPlatform(newVideoUrl);
    const embedUrl = getEmbedUrl(newVideoUrl, platform);

    const newVideo: Video = {
      id: Date.now().toString(),
      title: newVideoTitle || 'Untitled Video',
      platform,
      embedUrl,
      thumbnailUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop`,
    };

    setVideos([...videos, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleUpdateVideo = () => {
    if (!editingVideo) return;

    const platform = detectPlatform(editingVideo.embedUrl);
    const embedUrl = editingVideo.cloudinaryPublicId ? editingVideo.embedUrl : getEmbedUrl(editingVideo.embedUrl, platform);

    setVideos(videos.map(v =>
      v.id === editingVideo.id
        ? { ...editingVideo, platform, embedUrl }
        : v
    ));
    setEditingVideo(null);
  };

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="relative py-24 bg-black overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="section-label mb-4 block">PORTFOLIO</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-['Montserrat']">
            My <span className="text-red-600">Videos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Watch my latest content collaborations and speaking engagements
          </p>

          {/* Admin Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {!isAdminMode ? (
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                  >
                    <Lock size={14} className="mr-2" />
                    Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Admin Access</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Enter Password</label>
                      <Input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        placeholder="Enter admin password"
                        className="bg-black border-gray-700 text-white"
                      />
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                      )}
                    </div>
                    <Button
                      onClick={handlePasswordSubmit}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Unlock
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                {/* Add Video Button - Only in Admin Mode */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Plus size={18} className="mr-2" />
                      Add New Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1A1A1A] border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Video</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {/* Upload Type Toggle */}
                      <div className="flex gap-2">
                        <Button
                          variant={uploadType === 'cloudinary' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setUploadType('cloudinary')}
                          className={uploadType === 'cloudinary' ? 'bg-red-600' : 'border-gray-600'}
                        >
                          <Cloud size={14} className="mr-2" />
                          Upload Video
                        </Button>
                        <Button
                          variant={uploadType === 'link' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setUploadType('link')}
                          className={uploadType === 'link' ? 'bg-red-600' : 'border-gray-600'}
                        >
                          <Link size={14} className="mr-2" />
                          Paste Link
                        </Button>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Video Title</label>
                        <Input
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          placeholder="Enter video title"
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>

                      {uploadType === 'cloudinary' ? (
                        <div>
                          <Button
                            onClick={openCloudinaryWidget}
                            disabled={isUploading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Upload size={16} className="mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
                          </Button>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Supports: MP4, WebM, MOV, AVI (up to 100MB)
                          </p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Video URL (YouTube/Instagram)</label>
                            <Input
                              value={newVideoUrl}
                              onChange={(e) => setNewVideoUrl(e.target.value)}
                              placeholder="Paste video link here"
                              className="bg-black border-gray-700 text-white"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Supports: YouTube, Instagram Reels
                            </p>
                          </div>
                          <Button
                            onClick={handleAddVideoFromLink}
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={!newVideoUrl}
                          >
                            Add Video
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                >
                  <Unlock size={14} className="mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Video Grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 gap-8 perspective-1000"
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/20 preserve-3d"
            >
              {/* Video Thumbnail / Player */}
              <div className="relative aspect-video overflow-hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative cursor-pointer">
                      {/* Always use thumbnail image for preview */}
                      <img
                        src={video.thumbnailUrl || (video.platform === 'cloudinary'
                          ? video.embedUrl.replace('/video/upload/', '/video/upload/so_0,w_800,h_450,c_fill/').replace('.mp4', '.jpg')
                          : video.embedUrl)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-black border-gray-800 p-0">
                    <div className="aspect-video">
                      {video.platform === 'cloudinary' ? (
                        <video
                          src={video.embedUrl}
                          className="w-full h-full"
                          controls
                          autoPlay
                        />
                      ) : (
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit/Delete Actions - Only in Admin Mode */}
                {isAdminMode && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1A1A1A] border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Video</DialogTitle>
                        </DialogHeader>
                        {editingVideo && (
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">Video Title</label>
                              <Input
                                value={editingVideo.title}
                                onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                                className="bg-black border-gray-700 text-white"
                              />
                            </div>
                            {!editingVideo.cloudinaryPublicId && (
                              <div>
                                <label className="text-sm text-gray-400 mb-2 block">Video URL</label>
                                <Input
                                  value={editingVideo.embedUrl}
                                  onChange={(e) => setEditingVideo({ ...editingVideo, embedUrl: e.target.value })}
                                  className="bg-black border-gray-700 text-white"
                                />
                              </div>
                            )}
                            <Button
                              onClick={handleUpdateVideo}
                              className="w-full bg-red-600 hover:bg-red-700"
                            >
                              Update Video
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Platform Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/70 rounded-full text-xs font-medium text-white capitalize">
                    {video.platform === 'cloudinary' ? 'video' : video.platform}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-500 transition-colors">
                  {video.title}
                </h3>
                {video.platform !== 'cloudinary' && (
                  <button
                    onClick={() => window.open(video.embedUrl, '_blank')}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Watch on {video.platform}</span>
                  </button>
                )}
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-xl border-2 border-red-600/0 group-hover:border-red-600/50 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Helper Text - Only in Admin Mode */}
        {isAdminMode && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Admin Mode Active: Upload videos to Cloudinary or paste YouTube/Instagram links.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;
