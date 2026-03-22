export function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-[85%] items-start gap-2.5 animate-fade-in-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary shadow-sm avatar-glow">
        <span className="text-xs font-bold text-white">A</span>
      </div>
      <div className="flex items-center gap-1.5 bubble-bot bg-card px-5 py-4 shadow-sm">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/60" />
      </div>
    </div>
  );
}
