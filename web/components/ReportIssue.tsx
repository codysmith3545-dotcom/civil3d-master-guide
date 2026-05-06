type Props = {
  slug: string;
  title: string;
};

const REPO = "codysmith3545-dotcom/civil3d-master-guide";

export default function ReportIssue({ slug, title }: Props) {
  const issueTitle = `Issue with ${title}`;
  const body = `Page: ${slug}\n\n<Your feedback>`;
  const href =
    `https://github.com/${REPO}/issues/new` +
    `?title=${encodeURIComponent(issueTitle)}` +
    `&body=${encodeURIComponent(body)}`;

  return (
    <div className="mt-10 border-t border-ink-100 pt-4 text-xs text-ink-500">
      Found something wrong on this page?{" "}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-ink-700"
      >
        Report an issue
      </a>
      .
    </div>
  );
}
