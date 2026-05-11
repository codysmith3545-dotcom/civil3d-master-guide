import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { hasValidInvite } from "@/lib/access";
import {
  loadProjects,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
  type ProjectSummary,
} from "@/lib/project-backend";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Per-project AI workspaces grounded in your own deeds, plats, and scope documents.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // Auth: invite-token cookie, same primitive used by other gated pages.
  if (!(await hasValidInvite())) {
    redirect("/");
  }

  let projects: ProjectSummary[] = [];
  let placeholder: string | null = null;

  if (!supabaseConfigured()) {
    placeholder = SUPABASE_PLACEHOLDER_MESSAGE;
  } else {
    const loaded = loadProjects();
    if (!loaded.ok) {
      placeholder = loaded.reason;
    } else if (!loaded.mod.listProjects) {
      placeholder =
        "The projects backend module is present but does not yet export listProjects(). Wait for 5B-Schema to merge.";
    } else {
      try {
        projects = await loaded.mod.listProjects();
      } catch (err) {
        placeholder =
          err instanceof Error
            ? `Could not load projects: ${err.message}`
            : "Could not load projects.";
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your projects
          </h1>
          <p className="mt-2 max-w-2xl text-ink-600">
            Project workspaces let the assistant ground its answers in your own
            deeds, plats, scope documents, and field notes alongside the
            jurisdictional reference content.
          </p>
        </div>
        {!placeholder ? (
          <Link href="/projects/new" className="btn btn-primary">
            New project
          </Link>
        ) : null}
      </header>

      {placeholder ? (
        <PlaceholderBlock message={placeholder} />
      ) : projects.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectSummary }) {
  const docCount = project.documentCount ?? 0;
  const updated = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block h-full rounded-lg border border-ink-100 p-5 transition hover:border-ink-300 hover:shadow-sm"
    >
      <div className="text-base font-medium text-ink-900">{project.name}</div>
      <p className="mt-1 font-mono text-xs text-ink-500">{project.slug}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-600">
        <div>
          <dt className="uppercase tracking-wider text-ink-500">Documents</dt>
          <dd className="mt-0.5 text-ink-900">{docCount}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-ink-500">Updated</dt>
          <dd className="mt-0.5 text-ink-900">{updated}</dd>
        </div>
      </dl>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-ink-200 p-8 text-center">
      <p className="text-ink-700">
        Create your first project to ground AI answers in your own deeds,
        plats, and scope documents.
      </p>
      <Link href="/projects/new" className="btn btn-primary mt-5 inline-flex">
        New project
      </Link>
    </div>
  );
}

function PlaceholderBlock({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-medium">Projects are not available yet.</p>
      <p className="mt-2">{message}</p>
      <p className="mt-3 text-xs">
        See the project setup notes in{" "}
        <Link href="/docs" className="underline">
          the docs
        </Link>{" "}
        or contact the operator.
      </p>
    </div>
  );
}
