import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, ChevronDown, Menu, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  hiringPerson: string;
  category: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  contact: string;
  verified: boolean;
  featured: boolean;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
};

type Application = {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  coverNote: string;
  cvName?: string;
  submittedAt: string;
};

const KEYS = {
  jobs: "mig_careers_jobs",
  pending: "mig_careers_pending_jobs",
  applications: "mig_careers_applications",
  seed: "mig_careers_seed_version",
};

const districts = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal", "Biratnagar", "Dharan", "Hetauda", "Nepalgunj", "Janakpur", "Dhangadhi"];
const categories = ["IT & Software", "Marketing & Sales", "Finance & Accounting", "Education & Training", "Health & Care", "Hospitality & Tourism", "Construction & Engineering", "Retail & Operations", "Agriculture & Field Work", "Legal & Admin", "Others"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const levels = ["Entry", "Mid", "Senior"];

const sampleJobs: Job[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `job-${i + 1}`,
  title: ["Frontend Developer", "Account Officer", "Sales Executive", "Project Engineer", "Training Coordinator"][i % 5],
  company: ["Everest Digital Works", "Himalayan Community Finance", "Summit Ventures Nepal", "Unity Build & Engineering", "Future Skills Institute"][i % 5],
  hiringPerson: ["Asha Magar", "Kiran Magar", "Sunita Magar", "Prakash Magar", "Nirmala Magar"][i % 5],
  category: categories[i % categories.length],
  location: districts[i % districts.length],
  type: jobTypes[i % jobTypes.length],
  experience: levels[i % levels.length],
  salary: i % 3 === 0 ? `NPR ${35 + i}k - ${55 + i}k` : undefined,
  summary: "Join a trusted MIG community team and contribute to meaningful growth-focused work.",
  description: "This role is part of the MIG Careers trusted employer network. You will collaborate with cross-functional teams, maintain quality standards, and support community-first outcomes.",
  responsibilities: ["Deliver role-specific outcomes on time", "Coordinate with internal stakeholders", "Report progress to hiring team"],
  requirements: ["Strong communication and teamwork", "1+ years relevant exposure", "Commitment to community values"],
  contact: "careers@magarcommunity.org",
  verified: i % 2 === 0,
  featured: i % 4 === 0,
  status: "approved",
  createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - Math.max(i - 2, 0) * 43200000).toISOString(),
}));

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const card = "glass-card rounded-2xl p-5";
const btn = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition";
const bPri = `${btn} bg-[#F5C542] text-[#111827] hover:brightness-110`;
const bSec = `${btn} border border-slate-500/50 bg-white/5 text-white hover:bg-white/10`;

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedData() {
  if (localStorage.getItem(KEYS.seed) === "6") return;

  const companyMap: Record<string, string> = {
    "Magar Digital Works": "Everest Digital Works",
    "Magar Community Finance": "Himalayan Community Finance",
    "Magar Ventures Nepal": "Summit Ventures Nepal",
    "Magar Build & Engineering": "Unity Build & Engineering",
    "Magar Skills Institute": "Future Skills Institute",
  };

  const migrateCompanies = (items: Job[]) =>
    items.map((job) => ({
      ...job,
      company: companyMap[job.company] ?? job.company,
      createdAt: job.createdAt ?? new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: job.updatedAt ?? new Date(Date.now() - 2 * 86400000).toISOString(),
    }));

  const existingJobs = read<Job[]>(KEYS.jobs, []);
  const existingPending = read<Job[]>(KEYS.pending, []);
  const existingApplications = read<Application[]>(KEYS.applications, []);

  write(KEYS.jobs, existingJobs.length ? migrateCompanies(existingJobs) : sampleJobs);
  write(KEYS.pending, migrateCompanies(existingPending));
  write(KEYS.applications, existingApplications);
  localStorage.setItem(KEYS.seed, "6");
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/post-job", label: "Post Job" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-[#050814]/80 backdrop-blur">
      <div className={`${shell} flex h-16 items-center justify-between`}>
        <Link to="/" className="text-lg font-bold">
          MIG <span className="text-[#F5C542]">Careers</span>
        </Link>
        <nav className="hidden gap-2 md:flex">
          {links.map((link) => <Link key={link.to} to={link.to} className={`${bSec} px-3 py-2`}>{link.label}</Link>)}
        </nav>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className={`${shell} flex flex-col gap-2 pb-4 md:hidden`}>
          {links.map((link) => <Link key={link.to} to={link.to} className={bSec} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </div>
      )}
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/" && location.pathname !== "/jobs";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(245,197,66,0.12),transparent_35%),#050814]">
      <Navbar />
      <div className="pt-2 md:pt-3" />
      {showBack && (
        <div className={`${shell} mt-3 md:mt-4`}>
          <button className={bSec} onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
      {children}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function JobCard({ job }: { job: Job }) {
  return (
    <motion.div whileHover={{ y: -4 }} className={`${card} ${job.featured ? "border-[#F5C542]/50 gold-glow" : ""}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">{job.category}</span>
        {job.verified && <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Verified</span>}
        {job.featured && <span className="rounded-full bg-[#F5C542]/25 px-2 py-1 text-xs text-[#F5C542]">Featured</span>}
      </div>
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-base font-semibold text-slate-100">{job.company}</p>
      <p className="text-sm text-slate-300">Hiring: {job.hiringPerson}</p>
      <p className="mt-2 text-sm text-slate-300">{job.location} · {job.type} · {job.experience}</p>
      <p className="mt-1 text-sm text-[#F5C542]">Salary: {job.salary?.trim() ? job.salary : "Not disclosed"}</p>
      <p className="mt-2 text-sm text-slate-200">{job.summary}</p>
      <div className="mt-4 flex gap-2">
        <Link to={`/job/${job.id}`} className={bSec}>View Details</Link>
        <Link to={`/apply/${job.id}`} className={bPri}>Apply Now</Link>
      </div>
    </motion.div>
  );
}

function HomePage() {
  const jobs = read<Job[]>(KEYS.jobs, []);
  const featured = jobs.filter((j) => j.featured).slice(0, 3);
  const stats = [
    { label: "Total Job Listings", icon: <Briefcase />, value: jobs.length },
    { label: "Verified Listings", icon: <ShieldCheck />, value: jobs.filter((j) => j.verified).length },
    { label: "Total Applications", icon: <CheckCircle2 />, value: read<Application[]>(KEYS.applications, []).length },
    { label: "Community-first Hiring", icon: <Users />, value: "Trusted" },
  ];

  return (
    <Layout>
      <main className={`${shell} py-10`}>
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Discover trusted opportunities in the MIG community</h1>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">Find jobs, post openings, and grow your career through verified community connections.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/jobs" className={bPri}>Explore Jobs</Link>
            <Link to="/post-job" className={bSec}>Post a Job</Link>
          </div>
        </motion.section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className={card}>
              <div className="mb-2 text-[#F5C542]">{stat.icon}</div>
              <p className="text-sm text-slate-300">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Featured Jobs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featured.map((job) => <JobCard key={job.id} job={job} />)}</div>
        </section>

        <section className={`mt-10 ${card}`}>
          <h3 className="text-xl font-semibold">How it works</h3>
          <ol className="mt-3 grid gap-3 text-slate-300 sm:grid-cols-2">
            <li>1. Explore roles</li>
            <li>2. Filter by category/location/type</li>
            <li>3. Apply directly</li>
            <li>4. Grow within the community</li>
          </ol>
        </section>

        <section className={`mt-10 text-center ${card}`}>
          <p className="text-2xl font-bold">Start your career journey with MIG today</p>
          <Link to="/jobs" className={`${bPri} mt-4`}><Sparkles className="mr-2 h-4 w-4" />Explore now</Link>
        </section>
      </main>
    </Layout>
  );
}

function JobsPage() {
  const all = read<Job[]>(KEYS.jobs, []).filter((job) => job.status === "approved");
  const applications = read<Application[]>(KEYS.applications, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const [visibleCount, setVisibleCount] = useState(12);

  const categoryOptions = ["All", "IT & Software", "Finance & Accounting", "Marketing & Sales", "Education & Training"];
  const typeOptions = ["All", "Full-time", "Part-time", "Contract", "Remote"];
  const experienceOptions = ["All", "Entry", "Mid", "Senior"];
  const locationOptions = ["All locations", "Kathmandu", "Pokhara", "Chitwan", "Hetauda", "Butwal", "Remote"];

  const filtered = useMemo(
    () =>
      all.filter((job) =>
        [job.title, job.company, job.summary].join(" ").toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || job.category === selectedCategory) &&
        (selectedLocation === "All locations" || job.location === selectedLocation || (selectedLocation === "Remote" && job.type === "Remote")) &&
        (selectedType === "All" || job.type === selectedType) &&
        (selectedExperience === "All" || job.experience === selectedExperience) &&
        (!featuredOnly || job.featured)
      ),
    [all, featuredOnly, searchTerm, selectedCategory, selectedExperience, selectedLocation, selectedType]
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "Salary high-low") {
      const amount = (salary?: string) => Number((salary || "").replace(/[^\d]/g, "")) || 0;
      return list.sort((a, b) => amount(b.salary) - amount(a.salary));
    }
    if (sortBy === "Most applied") {
      const count = (id: string) => applications.filter((a) => a.jobId === id).length;
      return list.sort((a, b) => count(b.id) - count(a.id));
    }
    return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [applications, filtered, sortBy]);

  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, selectedCategory, selectedLocation, selectedType, selectedExperience, featuredOnly, sortBy]);

  const featuredJobs = sorted.filter((job) => job.featured).slice(0, 6);
  const displayedJobs = sorted.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLocation("All locations");
    setSelectedType("All");
    setSelectedExperience("All");
    setFeaturedOnly(false);
    setSortBy("Newest");
  };

  const fieldClass =
    "w-full appearance-none rounded-xl border border-slate-600/60 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10";

  return (
    <Layout>
      <main className={`${shell} pt-8 pb-10 md:pt-10`}>
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/35 p-5 shadow-2xl shadow-black/25 backdrop-blur-md md:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, keyword"
              className={`${fieldClass} py-3 pl-11 pr-4`}
            />
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</p>
            <div className="relative">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={fieldClass}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-slate-900 text-white">{category}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
              <div className="relative">
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className={fieldClass}>
                  {locationOptions.map((location) => (
                    <option key={location} value={location} className="bg-slate-900 text-white">{location}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured</p>
              <button
                type="button"
                onClick={() => setFeaturedOnly((v) => !v)}
                className={featuredOnly ? "rounded-full border border-[#F5C542] bg-[#F5C542] px-3.5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-400/20" : "rounded-full border border-slate-600/60 bg-slate-900/70 px-3.5 py-2 text-sm text-slate-300 transition hover:border-yellow-400/40 hover:text-white"}
              >
                Featured only
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job type</p>
              <div className="relative">
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={fieldClass}>
                  {typeOptions.map((type) => (
                    <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experience</p>
              <div className="relative">
                <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className={fieldClass}>
                  {experienceOptions.map((level) => (
                    <option key={level} value={level} className="bg-slate-900 text-white">{level}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sort by</p>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={fieldClass}>
                  {["Newest", "Salary high-low", "Most applied"].map((option) => (
                    <option key={option} value={option} className="bg-slate-900 text-white">{option}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</p>
              <button className={bSec} onClick={resetFilters}>Clear all filters</button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Featured jobs</h2>
          {featuredJobs.length === 0 ? (
            <div className={`${card} mt-4 text-center text-slate-300`}>No featured jobs match current filters.</div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">All listings</h2>
          {sorted.length === 0 ? (
            <div className={`${card} mt-4 text-center`}>
              <p className="font-semibold">No matching opportunities found</p>
              <p className="mt-1 text-sm text-slate-300">Try adjusting your filters.</p>
              <button className={`${bPri} mt-4`} onClick={resetFilters}>Reset filters</button>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayedJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
              {visibleCount < sorted.length && (
                <div className="mt-6 flex justify-center">
                  <button className={bSec} onClick={() => setVisibleCount((v) => v + 12)}>Load more jobs</button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </Layout>
  );
}

function JobDetailPage() {
  const { id } = useParams();
  const jobs = read<Job[]>(KEYS.jobs, []);
  const applications = read<Application[]>(KEYS.applications, []);
  const job = jobs.find((entry) => entry.id === id);
  if (!job) return <Layout><div className={`${shell} py-10`}>Job not found.</div></Layout>;
  const similar = jobs.filter((entry) => entry.category === job.category && entry.id !== job.id).slice(0, 3);
  const applicationsCount = applications.filter((a) => a.jobId === job.id).length;

  return (
    <Layout>
      <main className={`${shell} py-10`}>
        <section className={card}>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="mt-1 text-lg font-semibold text-slate-100">{job.company}</p>
          <p className="text-sm text-slate-300">Hiring: {job.hiringPerson}</p>
          <p className="mt-2 text-sm text-slate-300">{job.category} · {job.location} · {job.type} · {job.experience}</p>
          <p className="mt-1 text-xs text-slate-400">
            Posted: {new Date(job.createdAt).toLocaleDateString()} · Updated: {new Date(job.updatedAt).toLocaleDateString()} · Applications: {applicationsCount}
          </p>
          <p className="mt-2 text-sm text-[#F5C542]">Salary range: {job.salary?.trim() ? job.salary : "Not disclosed"}</p>
          <div className="mt-4 flex gap-2">
            <Link to={`/apply/${job.id}`} className={bPri}>Apply Now</Link>
            <button className={bSec} onClick={() => navigator.clipboard.writeText(window.location.href)}>Share</button>
          </div>
          <p className="mt-5 text-slate-200">{job.description}</p>
          <h3 className="mt-5 text-lg font-semibold">Responsibilities</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-300">{job.responsibilities.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          <h3 className="mt-5 text-lg font-semibold">Requirements</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-300">{job.requirements.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          <p className="mt-5 text-slate-300">Contact: {job.contact}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Similar jobs</h2>
          {similar.length === 0 ? (
            <div className={`${card} mt-4 text-center text-slate-300`}>No related jobs available right now.</div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-3">{similar.map((entry) => <JobCard key={entry.id} job={entry} />)}</div>
          )}
        </section>

        <section className={`mt-8 text-center ${card}`}>
          <h3 className="text-2xl font-bold">
            Want to post a job on MIG <span className="text-[#F5C542]">Careers</span>?
          </h3>
          <p className="mt-2 text-slate-300">Reach skilled members inside the MIG community.</p>
          <Link className={`${bPri} mt-4`} to="/post-job">Post a Job</Link>
        </section>
      </main>
    </Layout>
  );
}

function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvName, setCvName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const applications = read<Application[]>(KEYS.applications, []);
    const file = form.get("cv");
    applications.push({
      id: crypto.randomUUID(),
      jobId: id ?? "",
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      location: String(form.get("location") || ""),
      coverNote: String(form.get("coverNote") || ""),
      cvName: file instanceof File ? file.name : "",
      submittedAt: new Date().toISOString(),
    });
    write(KEYS.applications, applications);
    setSuccessMessage("Your application has been submitted successfully.");
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/jobs");
    }, 700);
  };

  return (
    <Layout>
      <main className={`${shell} py-10`}>
        <h1 className="text-3xl font-bold">Apply for this job</h1>
        {successMessage && <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMessage}</div>}
        <form onSubmit={submit} className={`mt-6 grid gap-3 ${card} sm:grid-cols-2`}>
          <input required name="fullName" placeholder="Full name" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required type="email" name="email" placeholder="Email" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="phone" placeholder="Phone" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="location" placeholder="Location" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <textarea required name="coverNote" rows={4} placeholder="Short cover note" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium text-slate-200">CV / Resume</p>
            <label
              htmlFor="cv-upload"
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-600 bg-slate-900/50 px-3 py-2.5 transition hover:border-[#F5C542]/60 hover:bg-slate-900"
            >
              <span className="truncate pr-3 text-sm text-slate-300">{cvName || "No file chosen"}</span>
              <span className="rounded-lg bg-[#F5C542] px-3 py-1 text-xs font-semibold text-[#111827]">Choose File</span>
            </label>
            <input
              id="cv-upload"
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setCvName(e.target.files?.[0]?.name || "")}
            />
            <p className="mt-1 text-xs text-slate-400">Accepted: PDF, DOC, DOCX</p>
          </div>

          <div className="sm:col-span-2 flex justify-center">
            <button className={`${bPri} disabled:cursor-not-allowed disabled:opacity-70`} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}

function PostJobPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const pending = read<Job[]>(KEYS.pending, []);
    pending.push({
      id: `pending-${Date.now()}`,
      title: String(form.get("title") || ""),
      company: String(form.get("company") || ""),
      hiringPerson: String(form.get("hiringPerson") || ""),
      category: String(form.get("category") || ""),
      location: String(form.get("location") || ""),
      type: String(form.get("type") || ""),
      experience: String(form.get("experience") || ""),
      salary: String(form.get("salary") || ""),
      summary: String(form.get("summary") || ""),
      description: String(form.get("description") || ""),
      responsibilities: String(form.get("responsibilities") || "").split("\n").filter(Boolean),
      requirements: String(form.get("requirements") || "").split("\n").filter(Boolean),
      contact: `${String(form.get("contactEmail") || "")} / ${String(form.get("contactPhone") || "")}`,
      verified: false,
      featured: false,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    write(KEYS.pending, pending);
    setSuccessMessage("Your job posting has been submitted for verification.");
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/jobs");
    }, 700);
  };

  return (
    <Layout>
      <main className={`${shell} py-10`}>
        <h1 className="text-3xl font-bold">Post a Job</h1>
        {successMessage && <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMessage}</div>}
        <form onSubmit={submit} className={`mt-6 grid gap-3 ${card} sm:grid-cols-2`}>
          <input required name="hiringPerson" placeholder="Hiring person full name" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="memberId" placeholder="MIG Member ID" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="company" placeholder="Company name" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="title" placeholder="Job title" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <select required name="category" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5"><option value="">Category</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select required name="location" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5"><option value="">District/location</option>{districts.map((d) => <option key={d}>{d}</option>)}</select>
          <select required name="type" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5"><option value="">Job type</option>{jobTypes.map((t) => <option key={t}>{t}</option>)}</select>
          <select required name="experience" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5"><option value="">Experience level</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
          <input name="salary" placeholder="Salary range (optional)" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />
          <textarea required rows={2} name="summary" placeholder="Short summary" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />
          <textarea required rows={4} name="description" placeholder="Full description" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />
          <textarea required rows={4} name="responsibilities" placeholder="Responsibilities (one per line)" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />
          <textarea required rows={4} name="requirements" placeholder="Requirements (one per line)" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5 sm:col-span-2" />
          <input required type="email" name="contactEmail" placeholder="Contact email" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input required name="contactPhone" placeholder="Contact phone" className="rounded-xl border border-slate-600 bg-slate-900/50 p-2.5" />
          <input type="file" name="coverImage" className="sm:col-span-2" />
          <input type="file" name="companyLogo" className="sm:col-span-2" />
          <button className={`${bPri} disabled:cursor-not-allowed disabled:opacity-70`} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Job Posting"}
          </button>
        </form>
      </main>
    </Layout>
  );
}

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>(read<Job[]>(KEYS.jobs, []));
  const [pending, setPending] = useState<Job[]>(read<Job[]>(KEYS.pending, []));
  const applications = read<Application[]>(KEYS.applications, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", company: "", location: "", type: "", experience: "", salary: "", summary: "" });

  const sync = (nextJobs: Job[], nextPending: Job[]) => {
    setJobs(nextJobs);
    setPending(nextPending);
    write(KEYS.jobs, nextJobs);
    write(KEYS.pending, nextPending);
  };

  const approve = (id: string) => {
    const target = pending.find((job) => job.id === id);
    if (!target) return;
    const approved = {
      ...target,
      id: `job-${Date.now()}`,
      status: "approved" as const,
      createdAt: target.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sync([approved, ...jobs], pending.filter((job) => job.id !== id));
  };

  const reject = (id: string) => sync(jobs, pending.filter((job) => job.id !== id));
  const remove = (id: string) => sync(jobs.filter((job) => job.id !== id), pending);
  const toggle = (id: string, key: "featured" | "verified") => sync(jobs.map((job) => job.id === id ? { ...job, [key]: !job[key] } : job), pending);
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = [job.title, job.company, job.location].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === "Featured") return job.featured;
    if (statusFilter === "Verified") return job.verified;
    if (statusFilter === "Approved") return job.status === "approved";
    return true;
  });

  const startEdit = (job: Job) => {
    setEditingJobId(job.id);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary || "",
      summary: job.summary,
    });
  };

  const saveEdit = () => {
    if (!editingJobId) return;
    const nextJobs = jobs.map((job) =>
      job.id === editingJobId ? { ...job, ...editForm, updatedAt: new Date().toISOString() } : job
    );
    sync(nextJobs, pending);
    setEditingJobId(null);
  };

  return (
    <Layout>
      <main className={`${shell} py-10`}>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total jobs", value: jobs.length },
            { label: "Approved jobs", value: jobs.filter((job) => job.status === "approved").length },
            { label: "Pending jobs", value: pending.length },
            { label: "Featured jobs", value: jobs.filter((job) => job.featured).length },
            { label: "Total applications", value: applications.length },
          ].map((item) => <div key={item.label} className={card}><p className="text-sm text-slate-300">{item.label}</p><p className="text-2xl font-bold">{item.value}</p></div>)}
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Pending jobs</h2>
          {pending.length === 0 ? (
            <div className={`${card} mt-3 text-center text-slate-300`}>No pending jobs right now.</div>
          ) : (
            <div className="mt-3 space-y-3">
              {pending.map((job) => (
                <div key={job.id} className={`${card} flex flex-wrap items-center justify-between gap-3`}>
                  <div><p className="font-semibold">{job.title}</p><p className="text-sm text-slate-300">{job.company}</p></div>
                  <div className="flex gap-2">
                    <button className={bPri} onClick={() => approve(job.id)}>Approve</button>
                    <button className={bSec} onClick={() => reject(job.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Manage jobs</h2>
          <div className={`${card} mt-3 grid gap-3 md:grid-cols-3`}>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search jobs..." className="rounded-xl border border-slate-600 bg-slate-900/60 p-2.5 md:col-span-2" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-600 bg-slate-900/60 p-2.5">
              {["All", "Approved", "Featured", "Verified"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {filteredJobs.length === 0 ? (
            <div className={`${card} mt-3 text-center text-slate-300`}>No jobs match your current admin filters.</div>
          ) : (
            <div className="mt-3 space-y-3">
              {filteredJobs.map((job) => (
                <div key={job.id} className={`${card} flex flex-wrap items-center justify-between gap-3`}>
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm text-slate-300">{job.company} · {job.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className={bSec} onClick={() => toggle(job.id, "featured")}>Featured</button>
                    <button className={bSec} onClick={() => toggle(job.id, "verified")}>Verified</button>
                    <button className={bSec} onClick={() => startEdit(job)}>Edit</button>
                    <button className={bSec} onClick={() => remove(job.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Applications</h2>
          {applications.length === 0 ? (
            <div className={`${card} mt-3 text-center text-slate-300`}>No applications submitted yet.</div>
          ) : (
            <div className="mt-3 space-y-3">
              {applications.map((application) => (
                <div key={application.id} className={card}>
                  <p className="font-semibold">{application.fullName} · {application.email}</p>
                  <p className="text-sm text-slate-300">Job: {application.jobId} · {application.phone} · {application.location}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {editingJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-600 bg-slate-900 p-5">
              <h3 className="text-xl font-semibold">Edit job</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <input value={editForm.company} onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <input value={editForm.location} onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <input value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))} placeholder="Type" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <input value={editForm.experience} onChange={(e) => setEditForm((p) => ({ ...p, experience: e.target.value }))} placeholder="Experience" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <input value={editForm.salary} onChange={(e) => setEditForm((p) => ({ ...p, salary: e.target.value }))} placeholder="Salary" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5" />
                <textarea value={editForm.summary} onChange={(e) => setEditForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Summary" className="rounded-xl border border-slate-600 bg-slate-950/70 p-2.5 sm:col-span-2" rows={3} />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className={bSec} onClick={() => setEditingJobId(null)}>Cancel</button>
                <button className={bPri} onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default function App() {
  useEffect(() => seedData(), []);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/apply/:id" element={<ApplyPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
