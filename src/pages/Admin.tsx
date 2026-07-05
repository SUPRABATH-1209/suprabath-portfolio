import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChart3,
  Download,
  FileUp,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { usePortfolioStore } from "../hooks/usePortfolioStore";
import type { Certificate, Project, Skill } from "../types/portfolio";
import {
  createId,
  downloadTextFile,
  fileToDataUrl,
} from "../utils/fileHelpers";
import { bytesToMb, deleteMediaFile, saveMediaFile } from "../utils/mediaStore";

const ADMIN_PASSWORD = "suprabath1209";
const IMAGE_LIMIT_MB = 4;
const VIDEO_LIMIT_MB = 650;

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

type SkillForm = z.infer<typeof skillSchema>;

const projectSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(10),
  category: z.string().min(1),
  githubUrl: z.string().url().or(z.literal("")).optional(),
  demoUrl: z.string().url().or(z.literal("")).optional(),
  techStack: z.string().min(1),
  videoUrl: z.string().url().or(z.literal("")).optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

const certificateSchema = z.object({
  title: z.string().min(2),
  issuer: z.string().min(2),
  issueDate: z.string().optional(),
  category: z.string().min(1),
  credentialId: z.string().optional(),
  certificateLink: z.string().url().or(z.literal("")).optional(),
});

type CertificateForm = z.infer<typeof certificateSchema>;

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const loginWithPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Wrong password");
    }
  };

  if (!loggedIn) {
    return (
      <div className="grid min-h-[70vh] place-items-center py-10">
        <div className="clean-card w-full max-w-md p-7 sm:p-8">
          <div className="mb-5 inline-flex rounded-3xl bg-orange-50 p-4 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-black">Admin login</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Only you use this page for edits. Public visitors see the normal
            portfolio only.
          </p>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              loginWithPassword();
            }}
          >
            <label className="grid gap-2">
              <span className="form-label">Password</span>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {loginError && (
              <p className="font-bold text-red-500">{loginError}</p>
            )}
            <button className="btn-primary" type="submit">
              Login with password
            </button>
          </form>
          <p className="mt-5 text-xs leading-6 text-[var(--muted)]">
            For safety, Admin asks for the password again whenever you open this page in a new session.
            Real Firebase Auth can be connected at the final deployment stage.
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setLoggedIn(false)} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const store = usePortfolioStore();
  const { content, setContent, resetContent } = store;
  const [tab, setTab] = useState<
    | "profile"
    | "skills"
    | "projects"
    | "certificates"
    | "resume"
    | "analytics"
    | "data"
  >("profile");
  const tabs = [
    ["profile", "Profile"],
    ["skills", "Skills"],
    ["projects", "Projects"],
    ["certificates", "Certificates"],
    ["resume", "Resume"],
    ["analytics", "Analytics setup"],
    ["data", "Import / Export"],
  ] as const;

  return (
    <div className="py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <SectionHeader
          eyebrow="Admin"
          title="Edit your portfolio."
          description="Public visitors see only the normal portfolio. You can add/remove content from here."
        />
        <button
          onClick={onLogout}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={tab === id ? "btn-primary py-3" : "btn-secondary py-3"}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "profile" && <ProfileAdmin />}
      {tab === "skills" && <SkillsAdmin />}
      {tab === "projects" && <ProjectsAdmin />}
      {tab === "certificates" && <CertificatesAdmin />}
      {tab === "resume" && <ResumeAdmin />}
      {tab === "analytics" && <AnalyticsAdmin />}
      {tab === "data" && (
        <DataAdmin
          content={content}
          setContent={setContent}
          resetContent={resetContent}
        />
      )}
    </div>
  );
}

function ProfileAdmin() {
  const { content, updateProfile } = usePortfolioStore();
  const [profile, setProfile] = useState(content.profile);
  const [message, setMessage] = useState("");

  async function handleImage(file?: File) {
    if (!file) return;
    if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
      setMessage(
        `Image is too large for free local mode. Keep profile image under ${IMAGE_LIMIT_MB}MB or use Firebase Storage later.`,
      );
      return;
    }
    const data = await fileToDataUrl(file);
    setProfile({ ...profile, photoData: data });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="clean-card p-6">
        <img
          src={profile.photoData || "/profile-placeholder.svg"}
          alt="Profile preview"
          className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
        />
        <label className="btn-secondary mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2">
          <ImageIcon size={18} /> Upload profile photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleImage(event.target.files?.[0])}
          />
        </label>
      </div>
      <div className="clean-card p-6 md:p-8">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="form-label">Name</span>
            <input
              className="form-input"
              value={profile.name}
              onChange={(event) =>
                setProfile({ ...profile, name: event.target.value })
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Headline</span>
            <input
              className="form-input"
              value={profile.headline}
              onChange={(event) =>
                setProfile({ ...profile, headline: event.target.value })
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Location</span>
            <input
              className="form-input"
              value={profile.location}
              onChange={(event) =>
                setProfile({ ...profile, location: event.target.value })
              }
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="form-label">Email</span>
              <input
                className="form-input"
                value={profile.email}
                onChange={(event) =>
                  setProfile({ ...profile, email: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2">
              <span className="form-label">Phone optional</span>
              <input
                className="form-input"
                value={profile.phone}
                onChange={(event) =>
                  setProfile({ ...profile, phone: event.target.value })
                }
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="form-label">GitHub</span>
            <input
              className="form-input"
              value={profile.github}
              onChange={(event) =>
                setProfile({ ...profile, github: event.target.value })
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">LinkedIn</span>
            <input
              className="form-input"
              value={profile.linkedin}
              onChange={(event) =>
                setProfile({ ...profile, linkedin: event.target.value })
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">About</span>
            <textarea
              className="form-input min-h-28"
              value={profile.about}
              onChange={(event) =>
                setProfile({ ...profile, about: event.target.value })
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Career objective</span>
            <textarea
              className="form-input min-h-28"
              value={profile.objective}
              onChange={(event) =>
                setProfile({ ...profile, objective: event.target.value })
              }
            />
          </label>
          <button
            className="btn-primary inline-flex items-center justify-center gap-2"
            onClick={() => {
              updateProfile(profile);
              setMessage("Profile saved.");
            }}
          >
            <Save size={18} /> Save profile
          </button>
          {message && (
            <p className="font-bold text-amber-700 dark:text-amber-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsAdmin() {
  const { content, addSkill, removeSkill } = usePortfolioStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: { level: "Intermediate" },
  });
  const onSubmit = (data: SkillForm) => {
    addSkill({ id: createId("skill"), ...data });
    reset({ name: "", category: "", level: "Intermediate" });
  };
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="clean-card p-6">
        <h2 className="text-2xl font-black">Add skill</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="form-label">Skill name</span>
            <input className="form-input" {...register("name")} />
            {errors.name && (
              <span className="text-sm text-red-500">Required</span>
            )}
          </label>
          <label className="grid gap-2">
            <span className="form-label">Category</span>
            <input className="form-input" {...register("category")} />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Level</span>
            <select className="form-input" {...register("level")}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <button className="btn-primary inline-flex items-center justify-center gap-2">
            <Plus size={18} /> Add skill
          </button>
        </div>
      </form>
      <div className="clean-card p-6">
        <h2 className="text-2xl font-black">Current skills</h2>
        <div className="mt-5 grid gap-3">
          {content.skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div>
                <p className="font-black">{skill.name}</p>
                <p className="text-sm text-slate-500">
                  {skill.category} · {skill.level}
                </p>
              </div>
              <button
                onClick={() => removeSkill(skill.id)}
                className="rounded-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                aria-label={`Remove ${skill.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsAdmin() {
  const { content, addProject, removeProject } = usePortfolioStore();
  const [imageData, setImageData] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [videoBlobKey, setVideoBlobKey] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoSizeMb, setVideoSizeMb] = useState<number | undefined>();
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({ resolver: zodResolver(projectSchema) });

  async function handleProjectImage(file?: File) {
    if (!file) return;
    if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
      setNotice(
        `Screenshot is too large for local mode. Compress under ${IMAGE_LIMIT_MB}MB or use Firebase Storage later.`,
      );
      return;
    }
    setImageData(await fileToDataUrl(file));
  }

  async function handleVideoFile(file?: File) {
    if (!file) return;
    setVideoFileName(file.name);
    const sizeMb = bytesToMb(file.size);
    setVideoSizeMb(sizeMb);
    if (file.size > VIDEO_LIMIT_MB * 1024 * 1024) {
      setVideoBlobKey("");
      setVideoPreviewUrl("");
      setNotice(
        `Video is ${sizeMb}MB. Free local browser mode supports up to about ${VIDEO_LIMIT_MB}MB depending on the browser. For bigger files, use Firebase Storage later.`,
      );
      return;
    }
    try {
      const stored = await saveMediaFile("project-video", file);
      setVideoBlobKey(stored.key);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setNotice(
        `Video saved locally in browser storage (${sizeMb}MB). Screenshot shows first; video starts automatically after 3 seconds.`,
      );
    } catch {
      setVideoBlobKey("");
      setVideoPreviewUrl("");
      setNotice(
        "Browser refused this video because local device storage/quota is full. Use a video URL now or connect Firebase Storage later.",
      );
    }
  }

  const onSubmit = (data: ProjectForm) => {
    const project: Project = {
      id: createId("project"),
      title: data.title,
      summary: data.summary,
      category: data.category,
      githubUrl: data.githubUrl || "",
      demoUrl: data.demoUrl || "",
      techStack: data.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      imageData,
      videoUrl: data.videoUrl || "",
      videoBlobKey,
      videoFileName,
      videoSizeMb,
      createdAt: new Date().toISOString(),
    };
    addProject(project);
    reset({
      title: "",
      summary: "",
      category: "",
      githubUrl: "",
      demoUrl: "",
      techStack: "",
      videoUrl: "",
    });
    setImageData("");
    setVideoFileName("");
    setVideoBlobKey("");
    setVideoPreviewUrl("");
    setVideoSizeMb(undefined);
    setNotice("Project added.");
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="clean-card p-6">
        <h2 className="text-2xl font-black">Add project</h2>
        <p className="mt-2 text-sm text-slate-500">
          Fields are simple: title, summary, category, links, stack, image and
          video.
        </p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="form-label">Project title</span>
            <input className="form-input" {...register("title")} />
            {errors.title && (
              <span className="text-sm text-red-500">Required</span>
            )}
          </label>
          <label className="grid gap-2">
            <span className="form-label">Summary</span>
            <textarea
              className="form-input min-h-28"
              {...register("summary")}
            />
            {errors.summary && (
              <span className="text-sm text-red-500">
                Write minimum 10 characters
              </span>
            )}
          </label>
          <label className="grid gap-2">
            <span className="form-label">Category</span>
            <input
              className="form-input"
              placeholder="Backend / API / Dashboard"
              {...register("category")}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="form-label">GitHub URL</span>
              <input className="form-input" {...register("githubUrl")} />
            </label>
            <label className="grid gap-2">
              <span className="form-label">Demo URL</span>
              <input className="form-input" {...register("demoUrl")} />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="form-label">Tech stack, comma separated</span>
            <input
              className="form-input"
              placeholder="Java, Spring Boot, MySQL"
              {...register("techStack")}
            />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Video URL optional</span>
            <input
              className="form-input"
              placeholder="YouTube, Drive, Firebase Storage URL later"
              {...register("videoUrl")}
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
              <ImageIcon size={18} /> Upload screenshot
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  handleProjectImage(event.target.files?.[0])
                }
              />
            </label>
            <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
              <Video size={18} /> Select video file
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => handleVideoFile(event.target.files?.[0])}
              />
            </label>
          </div>
          {imageData && (
            <img
              src={imageData}
              alt="Project preview"
              className="max-h-52 rounded-2xl object-cover"
            />
          )}
          {videoFileName && (
            <p className="badge">
              Selected video: {videoFileName}
              {videoSizeMb ? ` · ${videoSizeMb}MB` : ""}
            </p>
          )}
          {videoPreviewUrl && (
            <video
              src={videoPreviewUrl}
              controls
              muted
              className="max-h-52 rounded-2xl bg-black"
            />
          )}
          {notice && (
            <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
              {notice}
            </p>
          )}
          <button className="btn-primary inline-flex items-center justify-center gap-2">
            <Plus size={18} /> Add project
          </button>
        </div>
      </form>

      <div className="clean-card p-6">
        <h2 className="text-2xl font-black">Current projects</h2>
        <div className="mt-5 grid gap-4">
          {content.projects.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-6 text-slate-500 dark:bg-slate-900">
              No projects added yet.
            </p>
          )}
          {content.projects.map((project) => (
            <div
              key={project.id}
              className="flex gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              {project.imageData ? (
                <img
                  src={project.imageData}
                  alt=""
                  className="h-20 w-24 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-20 w-24 place-items-center rounded-xl bg-slate-100 text-xs text-slate-500 dark:bg-slate-900">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black">{project.title}</p>
                <p className="line-clamp-2 text-sm text-slate-500">
                  {project.summary}
                </p>
              </div>
              <button
                onClick={() => {
                  deleteMediaFile(project.videoBlobKey);
                  removeProject(project.id);
                }}
                className="self-start rounded-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                aria-label={`Remove ${project.title}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificatesAdmin() {
  const { content, addCertificate, removeCertificate } = usePortfolioStore();
  const [imageData, setImageData] = useState("");
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateForm>({ resolver: zodResolver(certificateSchema) });

  async function handleCertificateImage(file?: File) {
    if (!file) return;
    if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
      setNotice(
        `Certificate image is too large for free local mode. Compress under ${IMAGE_LIMIT_MB}MB or use Firebase Storage later.`,
      );
      return;
    }
    setImageData(await fileToDataUrl(file));
  }

  const onSubmit = (data: CertificateForm) => {
    const certificate: Certificate = {
      id: createId("certificate"),
      title: data.title,
      issuer: data.issuer,
      issueDate: data.issueDate || "",
      category: data.category,
      credentialId: data.credentialId || "",
      certificateLink: data.certificateLink || "",
      imageData,
      createdAt: new Date().toISOString(),
    };
    addCertificate(certificate);
    reset({
      title: "",
      issuer: "",
      issueDate: "",
      category: "",
      credentialId: "",
      certificateLink: "",
    });
    setImageData("");
    setNotice("Certificate added.");
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="clean-card p-6">
        <h2 className="text-2xl font-black">Add certificate</h2>
        <p className="mt-2 text-sm text-slate-500">
          This uses upload-style fields, not image URL-first fields.
        </p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="form-label">Certificate title</span>
            <input className="form-input" {...register("title")} />
            {errors.title && (
              <span className="text-sm text-red-500">Required</span>
            )}
          </label>
          <label className="grid gap-2">
            <span className="form-label">Issuer</span>
            <input className="form-input" {...register("issuer")} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="form-label">Issue date</span>
              <input
                type="date"
                className="form-input"
                {...register("issueDate")}
              />
            </label>
            <label className="grid gap-2">
              <span className="form-label">Category</span>
              <input
                className="form-input"
                placeholder="Java / Backend / SQL"
                {...register("category")}
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="form-label">Credential ID optional</span>
            <input className="form-input" {...register("credentialId")} />
          </label>
          <label className="grid gap-2">
            <span className="form-label">Certificate link optional</span>
            <input
              className="form-input"
              placeholder="Verification link if available"
              {...register("certificateLink")}
            />
          </label>
          <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
            <Upload size={18} /> Upload certificate image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                handleCertificateImage(event.target.files?.[0])
              }
            />
          </label>
          {imageData && (
            <img
              src={imageData}
              alt="Certificate preview"
              className="max-h-64 rounded-2xl object-contain"
            />
          )}
          {notice && (
            <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
              {notice}
            </p>
          )}
          <button className="btn-primary inline-flex items-center justify-center gap-2">
            <Plus size={18} /> Add certificate
          </button>
        </div>
      </form>
      <div className="clean-card p-6">
        <h2 className="text-2xl font-black">Current certificates</h2>
        <div className="mt-5 grid gap-4">
          {content.certificates.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-6 text-slate-500 dark:bg-slate-900">
              No certificates added yet.
            </p>
          )}
          {content.certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="flex gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              {certificate.imageData ? (
                <img
                  src={certificate.imageData}
                  alt=""
                  className="h-20 w-24 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-20 w-24 place-items-center rounded-xl bg-slate-100 text-xs text-slate-500 dark:bg-slate-900">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black">{certificate.title}</p>
                <p className="text-sm text-slate-500">{certificate.issuer}</p>
              </div>
              <button
                onClick={() => removeCertificate(certificate.id)}
                className="self-start rounded-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                aria-label={`Remove ${certificate.title}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumeAdmin() {
  const { content, updateResume } = usePortfolioStore();
  const [resumeUrl, setResumeUrl] = useState(content.resume.fileUrl);
  const [fileName, setFileName] = useState(content.resume.fileName);
  const [notice, setNotice] = useState("");

  async function handleResume(file?: File) {
    if (!file) return;
    if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
      setNotice(
        "Large PDF cannot be stored in localStorage. Replace public/resume.pdf manually or connect Firebase Storage later.",
      );
      return;
    }
    const data = await fileToDataUrl(file);
    setResumeUrl(data);
    setFileName(file.name);
  }

  return (
    <div className="clean-card max-w-3xl p-6">
      <h2 className="text-2xl font-black">Resume settings</h2>
      <p className="mt-2 text-slate-500">
        For production, the cleanest free method is replacing{" "}
        <code>public/resume.pdf</code> before deployment. Admin upload works
        only for small PDFs in local mode.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="form-label">Resume URL</span>
          <input
            className="form-input"
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
          />
        </label>
        <label className="btn-secondary inline-flex cursor-pointer items-center justify-center gap-2">
          <FileUp size={18} /> Upload small PDF
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleResume(event.target.files?.[0])}
          />
        </label>
        <button
          onClick={() => {
            updateResume({ fileName, fileUrl: resumeUrl });
            setNotice("Resume saved.");
          }}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <Save size={18} /> Save resume
        </button>
        {notice && (
          <p className="font-bold text-amber-700 dark:text-amber-300">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}

function AnalyticsAdmin() {
  const futureItems = [
    'Total visits across all users',
    'Repeat visits counted again',
    'Page clicks and section clicks',
    'Time spent on website',
    'Last visited date and time',
    'Device type: mobile / desktop'
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="clean-card p-6 md:p-8">
        <div className="inline-flex rounded-3xl bg-indigo-50 p-4 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
          <BarChart3 size={28} />
        </div>
        <h2 className="mt-5 text-2xl font-black">Real visitor analytics</h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Fake local numbers were removed. After Netlify deployment, this panel should be connected to Firebase Analytics, Google Analytics, or Firestore events to show real visitors across all users.
        </p>
        <div className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--accent-strong)]">Status</p>
          <p className="mt-2 text-2xl font-black">Not connected yet</p>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">Connect Firebase / Google Analytics at the final stage.</p>
        </div>
      </div>
      <div className="clean-card p-6 md:p-8">
        <h2 className="text-2xl font-black">What will be tracked later</h2>
        <div className="mt-5 grid gap-3">
          {futureItems.map((item) => (
            <div key={item} className="rounded-2xl border border-[var(--line)] p-4 font-bold text-[var(--muted)]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataAdmin({
  content,
  setContent,
  resetContent,
}: {
  content: ReturnType<typeof usePortfolioStore>["content"];
  setContent: ReturnType<typeof usePortfolioStore>["setContent"];
  resetContent: ReturnType<typeof usePortfolioStore>["resetContent"];
}) {
  const [importText, setImportText] = useState("");
  const formattedContent = useMemo(
    () => JSON.stringify(content, null, 2),
    [content],
  );
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="clean-card p-6">
        <h2 className="text-2xl font-black">Export backup</h2>
        <p className="mt-2 text-slate-500">
          Download your current content as JSON.
        </p>
        <button
          onClick={() =>
            downloadTextFile(
              "suprabath-portfolio-content.json",
              formattedContent,
            )
          }
          className="btn-primary mt-5 inline-flex items-center gap-2"
        >
          <Download size={18} /> Download JSON
        </button>
        <textarea
          readOnly
          value={formattedContent}
          className="form-input mt-5 h-72 font-mono text-xs"
        />
      </div>
      <div className="clean-card p-6">
        <h2 className="text-2xl font-black">Import backup</h2>
        <p className="mt-2 text-slate-500">
          Paste exported JSON and import it. Use carefully.
        </p>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          className="form-input mt-5 h-72 font-mono text-xs"
          placeholder="Paste JSON here"
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => {
              try {
                setContent(JSON.parse(importText));
                alert("Imported.");
              } catch {
                alert("Invalid JSON.");
              }
            }}
            className="btn-primary"
          >
            Import JSON
          </button>
          <button
            onClick={() => {
              if (confirm("Reset everything to initial data?")) resetContent();
            }}
            className="btn-secondary text-red-500"
          >
            Reset local data
          </button>
        </div>
      </div>
    </div>
  );
}
