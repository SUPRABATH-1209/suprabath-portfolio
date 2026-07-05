import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import type { Project } from '../types/portfolio';
import { getMediaObjectUrl } from '../utils/mediaStore';

interface ProjectMediaProps {
  project: Project;
  className?: string;
}

export default function ProjectMedia({ project, className = '' }: ProjectMediaProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [blobVideoUrl, setBlobVideoUrl] = useState('');
  const directVideoSource = useMemo(() => project.videoData || project.videoUrl || '', [project.videoData, project.videoUrl]);
  const videoSource = blobVideoUrl || directVideoSource;
  const hasVideo = Boolean(videoSource || project.videoBlobKey);

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    setBlobVideoUrl('');

    if (project.videoBlobKey) {
      getMediaObjectUrl(project.videoBlobKey)
        .then((url) => {
          objectUrl = url;
          if (active) setBlobVideoUrl(url);
        })
        .catch(() => {
          if (active) setBlobVideoUrl('');
        });
    }

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [project.videoBlobKey, project.id]);

  useEffect(() => {
    setShowVideo(false);
    if (!hasVideo) return;
    const timer = window.setTimeout(() => setShowVideo(true), 3000);
    return () => window.clearTimeout(timer);
  }, [hasVideo, project.id, videoSource]);

  return (
    <div className={`project-media relative overflow-hidden bg-black ${className}`}>
      <AnimatePresence mode="wait">
        {!showVideo || !videoSource ? (
          <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
            {project.imageData ? (
              <img src={project.imageData} alt={`${project.title} screenshot`} className="h-full w-full object-contain" />
            ) : (
              <div className="grid h-full min-h-64 place-items-center bg-gradient-to-br from-stone-100 via-white to-orange-50 text-center dark:from-zinc-900 dark:via-black dark:to-orange-950/20">
                <p className="px-6 font-black text-slate-500">Project screenshot not added</p>
              </div>
            )}
            {hasVideo && (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-black text-white backdrop-blur">
                <PlayCircle size={17} /> Video starts after 3s
              </div>
            )}
          </motion.div>
        ) : (
          <motion.video
            key="video"
            src={videoSource}
            poster={project.imageData || undefined}
            autoPlay
            muted
            loop
            playsInline
            controls
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full object-contain"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
