"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadStatus = "queued" | "uploading" | "done" | "error";

type UploadEntry = {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  message?: string;
};

export default function ProjectUpload({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(list: FileList | File[]) {
    const arr = Array.from(list);
    const next: UploadEntry[] = arr.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`,
      file,
      progress: 0,
      status: "queued",
    }));
    setEntries((cur) => [...cur, ...next]);
    next.forEach((e) => {
      void uploadOne(e);
    });
  }

  async function uploadOne(entry: UploadEntry) {
    updateEntry(entry.id, { status: "uploading", progress: 0 });

    const form = new FormData();
    form.append("file", entry.file);

    try {
      // XHR for upload-progress events; fetch's stream API doesn't expose them.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `/api/projects/${projectId}/documents/upload`,
          true,
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            updateEntry(entry.id, { progress: pct });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            updateEntry(entry.id, { status: "done", progress: 100 });
            resolve();
          } else {
            let message = `Upload failed (${xhr.status}).`;
            try {
              const parsed = JSON.parse(xhr.responseText) as {
                message?: string;
              };
              if (parsed.message) message = parsed.message;
            } catch {
              // ignore
            }
            updateEntry(entry.id, { status: "error", message });
            reject(new Error(message));
          }
        };
        xhr.onerror = () => {
          updateEntry(entry.id, {
            status: "error",
            message: "Network error.",
          });
          reject(new Error("Network error."));
        };
        xhr.send(form);
      });

      // Refresh server-rendered document list once the file is in.
      router.refresh();
    } catch {
      // already reported on the entry
    }
  }

  function updateEntry(id: string, patch: Partial<UploadEntry>) {
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`cursor-pointer rounded-md border-2 border-dashed p-5 text-center text-sm transition ${
          dragOver
            ? "border-[--accent] bg-[--accent-soft]"
            : "border-ink-200 bg-ink-50 hover:border-ink-400"
        }`}
      >
        <p className="text-ink-700">
          Drop files here or <span className="underline">browse</span>
        </p>
        <p className="mt-1 text-xs text-ink-500">
          PDF, image, CAD export, or text. Multiple files supported.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {entries.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {entries.map((e) => (
            <li
              key={e.id}
              className="rounded-md border border-ink-100 bg-white px-3 py-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-ink-900">
                  {e.file.name}
                </span>
                <span className="flex-shrink-0 text-ink-500">
                  {e.status === "done"
                    ? "Done"
                    : e.status === "error"
                      ? "Error"
                      : `${e.progress}%`}
                </span>
              </div>
              {e.status === "uploading" ? (
                <div className="mt-1 h-1 w-full rounded bg-ink-100">
                  <div
                    className="h-1 rounded bg-[--accent] transition-all"
                    style={{ width: `${e.progress}%` }}
                  />
                </div>
              ) : null}
              {e.message ? (
                <p className="mt-1 text-amber-800">{e.message}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
