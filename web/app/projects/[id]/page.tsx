import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { hasValidInvite } from "@/lib/access";
import {
  loadProjects,
  supabaseConfigured,
  SUPABASE_PLACEHOLDER_MESSAGE,
  type ProjectSummary,
  type ProjectDocument,
} from "@/lib/project-backend";
import ProjectChat from "@/components/ProjectChat";
import ProjectUpload from "@/components/ProjectUpload";
import ProjectDocumentList from "@/components/ProjectDocumentList";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  return { title: `Project ${params.id.slice(0, 8)}` };
}

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Params;
}) {
  if (!(await hasValidInvite())) {
    redirect("/");
  }

  let project: ProjectSummary | null = null;
  let documents: ProjectDocument[] = [];
  let placeholder: string | null = null;

  if (!supabaseConfigured()) {
    placeholder = SUPABASE_PLACEHOLDER_MESSAGE;
  } else {
    const loaded = loadProjects();
    if (!loaded.ok) {
      placeholder = loaded.reason;
    } else {
      try {
        project = (await loaded.mod.getProject?.(params.id)) ?? null;
        if (project) {
          documents =
            (await loaded.mod.listProjectDocuments?.(params.id)) ?? [];
        }
      } catch (err) {
        placeholder =
          err instanceof Error
            ? `Could not load project: ${err.message}`
            : "Could not load project.";
      }
    }
  }

  if (!placeholder && !project) {
    notFound();
  }

  if (placeholder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-ink-500">
          <Link href="/projects" className="hover:text-ink-900">
            Projects
          </Link>{" "}
          / {params.id}
        </nav>
        <div className="rounded-md border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-medium">Workspace is not available yet.</p>
          <p className="mt-2">{placeholder}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-3 text-sm text-ink-500">
        <Link href="/projects" className="hover:text-ink-900">
          Projects
        </Link>{" "}
        / {project!.name}
      </nav>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project!.name}
          </h1>
          <p className="mt-1 font-mono text-xs text-ink-500">{project!.slug}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-500">
              Upload
            </h2>
            <ProjectUpload projectId={project!.id} />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-500">
              Documents
            </h2>
            <ProjectDocumentList
              projectId={project!.id}
              initialDocuments={documents}
            />
          </section>
        </aside>

        <section className="flex h-[70vh] min-h-[480px] flex-col rounded-lg border border-ink-100">
          <div className="border-b border-ink-100 px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
              Project chat
            </h2>
            <p className="mt-1 text-xs text-ink-500">
              Answers cite both this project&apos;s documents and the guide.
            </p>
          </div>
          <ProjectChat projectId={project!.id} />
        </section>
      </div>
    </div>
  );
}
