"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-border"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        aria-label="Email address"
        className="h-14 flex-1 bg-transparent px-6 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="h-14 shrink-0 rounded-full bg-primary px-8 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Subscribe
      </button>
    </form>
  );
}
