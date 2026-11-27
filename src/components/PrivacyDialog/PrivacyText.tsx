import { PRIVACY_SECTIONS } from './privacy-dialog.constants';

export function PrivacyText() {
  return (
    <div className="flex flex-col gap-3">
      {PRIVACY_SECTIONS.map(({ title, body }) => (
        <section key={title} className="flex flex-col gap-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-muted-foreground">{body}</p>
        </section>
      ))}
    </div>
  );
}
